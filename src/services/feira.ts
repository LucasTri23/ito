import { collection, doc, runTransaction, serverTimestamp, writeBatch, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import catalog from "../data/feira.json";
import { randomInt, shuffle } from "../utils/game";
import { FEIRA_ROUNDS, type FeiraCatalog } from "../utils/feira";
import { roundIdOf, type MesaRoom } from "./mesa";

export const feira = catalog as FeiraCatalog;
export { FEIRA_ROUNDS };

interface Common {
  id: string;
  game: "feira";
  no: number;
  problemId: string;
  inventors: string[];
  startedAt: Timestamp | null;
  voteAt: Timestamp | null;
}
export interface FeiraOnlineRound extends Common {
  mode: "online";
  phase: "create" | "vote" | "result";
  voters: string[];
  submitted: string[];
  voted: string[];
}
export interface FeiraLiveRound extends Common {
  mode: "presencial";
  phase: "prep" | "present" | "vote" | "result";
  audience: string[];
  current: number;
  pvoted: string[];
}
export type FeiraRound = FeiraOnlineRound | FeiraLiveRound;
export interface Entry {
  id: string;
  anon: string;
  name: string;
  how: string;
  slogan: string;
}

/** Quantos inventores na rodada, conforme o modo e o tamanho da sala. */
export function inventorCount(mode: "online" | "presencial", players: number, chosen = 2) {
  if (players <= 2) return players;
  if (mode === "online") return players === 3 ? 2 : players;
  return players <= 4 ? 2 : chosen;
}

/** Rodízio: a cada rodada a janela de inventores anda pela lista (ordem de entrada). */
export function rotate(players: string[], no: number, count: number) {
  const n = players.length;
  const start = ((no - 1) * count) % n;
  const ring = [...players.slice(start), ...players.slice(0, start)];
  return { inventors: ring.slice(0, count), others: ring.slice(count) };
}

export async function startFeiraRound(code: string, uid: string, players: string[]) {
  const roomRef = doc(db, "mesas", code);
  await runTransaction(db, async (tx) => {
    const room = (await tx.get(roomRef)).data() as MesaRoom | undefined;
    if (!room || room.hostId !== uid) throw new Error("Só o anfitrião pode começar a rodada.");
    if (room.phase !== "lobby") throw new Error("A rodada já começou.");
    if (room.roundNo >= FEIRA_ROUNDS) throw new Error("A partida acabou. Comece uma nova partida.");
    if (players.length < 2 || players.length > 8) throw new Error("A sala precisa de 2 a 8 jogadores.");
    const available = feira.problems.filter((p) => !room.used.includes(p.id));
    if (!available.length) throw new Error("Todos os problemas foram usados. Comece uma nova partida.");
    const problem = available[randomInt(available.length)];
    const mode = room.mode ?? "online";
    const no = room.roundNo + 1;
    const id = roundIdOf(room.gameNo, no);
    const base = `mesas/${code}/rounds/${id}`;
    if ((await tx.get(doc(db, base))).exists()) throw new Error("Essa rodada já foi criada.");
    const { inventors, others } = rotate(players, no, inventorCount(mode, players.length, room.inventors));
    const order = mode === "presencial" ? shuffle(inventors) : inventors;
    const common = { id, game: "feira", no, mode, problemId: problem.id, inventors: order, startedAt: serverTimestamp(), voteAt: null };
    if (mode === "online")
      tx.set(doc(db, base), { ...common, phase: "create", voters: players.length >= 4 ? players : others, submitted: [], voted: [] });
    else tx.set(doc(db, base), { ...common, phase: "prep", audience: others, current: 0, pvoted: [] });
    const materials = shuffle(problem.materials).slice(0, order.length);
    order.forEach((inv, i) => tx.set(doc(db, `${base}/materials/${inv}`), { uid: inv, materialId: materials[i] }));
    tx.update(roomRef, { phase: "playing", roundNo: no, currentRoundId: id, used: [...room.used, problem.id] });
  });
}

/** Envia a invenção. O id da invenção é aleatório; a ligação com o autor fica lacrada até o resultado. */
export async function submitInvention(code: string, roundId: string, uid: string, entry: { name: string; how: string; slogan: string }) {
  const clean = { name: entry.name.trim(), how: entry.how.trim(), slogan: entry.slogan.trim() };
  if (!clean.name || !clean.how || !clean.slogan) throw new Error("Preencha nome, como funciona e slogan.");
  const base = `mesas/${code}/rounds/${roundId}`;
  const anon = doc(collection(db, `${base}/entries`)).id;
  await runTransaction(db, async (tx) => {
    const round = (await tx.get(doc(db, base))).data() as FeiraOnlineRound | undefined;
    if (!round || round.phase !== "create") throw new Error("O tempo de criação acabou.");
    if (round.submitted.includes(uid)) return;
    tx.set(doc(db, `${base}/entries/${anon}`), { anon, ...clean });
    tx.set(doc(db, `${base}/authors/${anon}`), { anon, uid });
    tx.set(doc(db, `${base}/authorOf/${uid}`), { uid, anon });
    tx.update(doc(db, base), { submitted: [...round.submitted, uid] });
  });
}

/** Avança a fase quando todos terminaram ou o prazo acabou. Idempotente; a regra confere o prazo. */
export async function advanceFeira(code: string, round: FeiraRound) {
  const base = `mesas/${code}/rounds/${round.id}`;
  const b = writeBatch(db);
  const finish = () => b.update(doc(db, "mesas", code), { phase: "lobby" });
  if (round.mode === "online") {
    if (round.phase === "create") {
      const vote = round.voters.length > 0 && round.submitted.length >= 2;
      b.update(doc(db, base), vote ? { phase: "vote", voteAt: serverTimestamp() } : { phase: "result" });
      if (!vote) finish();
    } else if (round.phase === "vote") {
      b.update(doc(db, base), { phase: "result" });
      finish();
    } else return;
  } else {
    if (round.phase === "prep") b.update(doc(db, base), { phase: "present", current: 0 });
    else if (round.phase === "vote") {
      const last = round.current + 1 >= round.inventors.length;
      b.update(doc(db, base), last ? { phase: "result", pvoted: [] } : { phase: "present", current: round.current + 1, pvoted: [] });
      if (last) finish();
    } else return;
  }
  await b.commit();
}

export async function voteOnline(code: string, round: FeiraOnlineRound, uid: string, target: string) {
  const base = `mesas/${code}/rounds/${round.id}`;
  await runTransaction(db, async (tx) => {
    const r = (await tx.get(doc(db, base))).data() as FeiraOnlineRound | undefined;
    if (!r || r.phase !== "vote") throw new Error("A votação já foi encerrada.");
    if (r.voted.includes(uid)) return;
    tx.set(doc(db, `${base}/votes/${uid}`), { uid, target });
    tx.update(doc(db, base), { voted: [...r.voted, uid] });
  });
}

/** Anfitrião: abre a votação do produto atual, ou passa para o próximo (sem plateia ou se o inventor saiu). */
export async function hostLive(code: string, round: FeiraLiveRound, action: "openVote" | "next") {
  const base = `mesas/${code}/rounds/${round.id}`;
  const b = writeBatch(db);
  if (action === "openVote") b.update(doc(db, base), { phase: "vote", voteAt: serverTimestamp(), pvoted: [] });
  else {
    const last = round.current + 1 >= round.inventors.length;
    b.update(doc(db, base), last ? { phase: "result" } : { phase: "present", current: round.current + 1 });
    if (last) b.update(doc(db, "mesas", code), { phase: "lobby" });
  }
  await b.commit();
}

export async function voteLive(code: string, round: FeiraLiveRound, uid: string, buy: boolean) {
  const base = `mesas/${code}/rounds/${round.id}`;
  const inventor = round.inventors[round.current];
  await runTransaction(db, async (tx) => {
    const r = (await tx.get(doc(db, base))).data() as FeiraLiveRound | undefined;
    if (!r || r.phase !== "vote" || r.current !== round.current) throw new Error("A votação deste produto foi encerrada.");
    if (r.pvoted.includes(uid)) return;
    tx.set(doc(db, `${base}/pvotes/${inventor}_${uid}`), { inventor, voter: uid, buy });
    tx.update(doc(db, base), { pvoted: [...r.pvoted, uid] });
  });
}

/** Vencedores de uma rodada a partir dos votos (empate: todos com o maior total). */
export function topOf(counts: Record<string, number>) {
  const max = Math.max(0, ...Object.values(counts));
  return max > 0 ? Object.keys(counts).filter((k) => counts[k] === max) : [];
}
