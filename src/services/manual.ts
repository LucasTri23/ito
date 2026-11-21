import { doc, runTransaction, serverTimestamp, updateDoc, writeBatch, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import catalog from "../data/manual.json";
import { randomInt, shuffle } from "../utils/game";
import { correctCount, distributeClues, MANUAL_ATTEMPTS, type Challenge } from "../utils/manual";
import { roundIdOf, type MesaRoom } from "./mesa";

export const challenges = catalog as Challenge[];
export const MANUAL_ROUNDS = 3;
export type Team = "A" | "B";

export interface ManualRound {
  id: string;
  game: "manual";
  no: number;
  challengeId: string;
  phase: "build" | "done";
  teamA: string[];
  teamB: string[];
  size: number;
  startedAt: Timestamp | null;
}
export interface Bench {
  team: Team;
  members: string[];
  slots: string[];
  attempts: number;
  status: "open" | "solved" | "failed";
  lastCorrect: number;
  solvedAt: Timestamp | null;
  tester: string;
}
export interface ClueHand {
  uid: string;
  team: Team;
  clues: number[];
}

/** 2–3 pessoas: uma equipe. 4–8: duas equipes com diferença máxima de uma pessoa. */
export function makeTeams(players: string[]): [string[], string[]] {
  const mixed = shuffle(players);
  if (mixed.length <= 3) return [mixed, []];
  const half = Math.ceil(mixed.length / 2);
  return [mixed.slice(0, half), mixed.slice(half)];
}

export async function startManualRound(code: string, uid: string, players: string[]) {
  const roomRef = doc(db, "mesas", code);
  await runTransaction(db, async (tx) => {
    const room = (await tx.get(roomRef)).data() as MesaRoom | undefined;
    if (!room || room.hostId !== uid) throw new Error("Só o anfitrião pode começar o desafio.");
    if (room.phase !== "lobby") throw new Error("O desafio já começou.");
    if (room.roundNo >= MANUAL_ROUNDS) throw new Error("A partida acabou. Comece uma nova partida.");
    if (players.length < 2 || players.length > 8) throw new Error("A sala precisa de 2 a 8 jogadores.");
    const available = challenges.filter((c) => !room.used.includes(c.id));
    if (!available.length) throw new Error("Todos os desafios foram usados. Comece uma nova partida.");
    const ch = available[randomInt(available.length)];
    const no = room.roundNo + 1;
    const id = roundIdOf(room.gameNo, no);
    const base = `mesas/${code}/rounds/${id}`;
    if ((await tx.get(doc(db, base))).exists()) throw new Error("Esse desafio já foi criado.");
    const [teamA, teamB] = makeTeams(players);
    tx.set(doc(db, base), { id, game: "manual", no, challengeId: ch.id, phase: "build", teamA, teamB, size: ch.pieces.length, startedAt: serverTimestamp() });
    tx.set(doc(db, `${base}/sealed/solution`), { solution: ch.solution });
    for (const [team, members] of [["A", teamA], ["B", teamB]] as [Team, string[]][]) {
      if (!members.length) continue;
      tx.set(doc(db, `${base}/benches/${team}`), {
        team,
        members,
        slots: ch.pieces.map(() => ""),
        attempts: 0,
        status: "open",
        lastCorrect: -1,
        solvedAt: null,
        tester: members[(no - 1) % members.length],
      });
      // Pistas por índice: cada integrante só lê as próprias.
      const hands = distributeClues(ch.clues.map((_, i) => i), members.length);
      members.forEach((member, i) => tx.set(doc(db, `${base}/clues/${member}`), { uid: member, team, clues: hands[i] }));
    }
    tx.update(roomRef, { phase: "playing", roundNo: no, currentRoundId: id, used: [...room.used, ch.id] });
  });
}

/** Coloca, move ou retira uma peça. Recusa se a bancada mudou desde que a pessoa viu. */
export async function moveManual(
  code: string,
  roundId: string,
  team: Team,
  seen: string[],
  piece: string | null,
  slot: number,
) {
  const ref = doc(db, `mesas/${code}/rounds/${roundId}/benches/${team}`);
  const attempt = () => runTransaction(db, async (tx) => {
    const bench = (await tx.get(ref)).data() as Bench | undefined;
    if (!bench || bench.status !== "open") throw new Error("A bancada já está bloqueada.");
    const from = piece ? bench.slots.indexOf(piece) : -1;
    if (bench.slots[slot] !== seen[slot] || (from >= 0 && seen[from] !== bench.slots[from]))
      throw new Error("Alguém mexeu nesse espaço agora. Confira a bancada e tente de novo.");
    const slots = [...bench.slots];
    if (from >= 0) slots[from] = "";
    slots[slot] = piece ?? "";
    tx.update(ref, { slots });
  });
  try {
    await attempt();
  } catch (e) {
    // Recusa momentânea do servidor: tenta uma vez mais. A transação relê a bancada, então não duplica nada.
    if ((e as { code?: string })?.code !== "permission-denied") throw e;
    await new Promise((r) => setTimeout(r, 400));
    await attempt();
  }
}

/** O responsável da vez testa a montagem completa. A regra confere com o gabarito lacrado. */
export async function testManual(code: string, roundId: string, team: Team, bench: Bench, solution: string[] | null) {
  if (bench.slots.includes("")) throw new Error("Preencha todos os espaços antes de testar.");
  // O gabarito só é lido pela regra; o cliente propõe o resultado e a regra recusa se estiver errado.
  const tries = solution ? [solution] : candidates(bench);
  let lastError: unknown;
  for (const guess of tries) {
    const solved = guess.join() === bench.slots.join();
    const attempts = bench.attempts + 1;
    try {
      await updateDoc(doc(db, `mesas/${code}/rounds/${roundId}/benches/${team}`), {
        attempts,
        status: solved ? "solved" : attempts >= MANUAL_ATTEMPTS ? "failed" : "open",
        lastCorrect: correctCount(bench.slots, guess),
        solvedAt: solved ? serverTimestamp() : null,
        tester: bench.members[(bench.members.indexOf(bench.tester) + 1) % bench.members.length],
      });
      return;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

/**
 * Sem acesso ao gabarito, o cliente tenta as respostas possíveis para o resultado
 * (acertou ou quantas peças certas) e a regra aceita somente a verdadeira.
 * Representamos cada hipótese por um "gabarito" que produz aquele resultado.
 */
function candidates(bench: Bench): string[][] {
  const n = bench.slots.length;
  const out: string[][] = [bench.slots];
  for (let correct = n - 2; correct >= 0; correct--) {
    // Hipótese com exatamente `correct` posições iguais à montagem.
    const g = bench.slots.map((p, i) => (i < correct ? p : `x${i}`));
    out.push(g);
  }
  return out;
}

/** Fecha o desafio quando todas as bancadas encerraram ou o prazo acabou. */
export async function finishManual(code: string, roundId: string) {
  const b = writeBatch(db);
  b.update(doc(db, `mesas/${code}/rounds/${roundId}`), { phase: "done" });
  b.update(doc(db, "mesas", code), { phase: "lobby" });
  await b.commit();
}
