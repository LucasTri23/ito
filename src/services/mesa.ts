// Salas compartilhadas dos jogos Plano B, Manual Desmontado e Feira de Invenções.
// Coleções: mesaInvites/{code} (vagas) e mesas/{code} (sala, jogadores e rodadas).
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { hostAway, pickSuccessor, roomCode } from "../utils/game";

export type MesaGame = "planb" | "manual" | "feira";
export const MESA_MAX = 8;
export const MESA_MIN = 2;

export interface MesaRoom {
  code: string;
  game: MesaGame;
  hostId: string;
  phase: "lobby" | "playing";
  gameNo: number;
  roundNo: number;
  currentRoundId: string;
  used: string[];
  mode?: "online" | "presencial";
  inventors?: number;
}
export interface MesaPlayer {
  uid: string;
  name: string;
  joinedAt?: Timestamp | null;
  connected: boolean;
  presenceAt?: Timestamp | null;
}

export const roundIdOf = (gameNo: number, roundNo: number) => `${gameNo}-${roundNo}`;
export const mesaPath = (code: string) => `mesas/${code}`;
const VALID = /^[A-HJ-NP-Z2-9]{5}$/;

/** Cria ou entra numa sala. Retorna o código. Respeita o limite de 8 vagas atomicamente. */
export async function enterMesa(
  game: MesaGame,
  uid: string,
  name: string,
  code: string | null,
  extra: Partial<Pick<MesaRoom, "mode" | "inventors">> = {},
) {
  const clean = name.trim();
  if (!clean) throw new Error("Informe seu apelido.");
  for (let attempt = 0; attempt < (code ? 1 : 10); attempt++) {
    const candidate = code ? code.trim().toUpperCase() : roomCode();
    if (!VALID.test(candidate)) throw new Error("Confira o código da sala.");
    const invite = doc(db, "mesaInvites", candidate);
    const roomRef = doc(db, "mesas", candidate);
    const player = doc(db, `mesas/${candidate}/players/${uid}`);
    const ok = await runTransaction(db, async (tx) => {
      const inv = await tx.get(invite);
      const me = { uid, name: clean, joinedAt: serverTimestamp(), connected: true, presenceAt: serverTimestamp() };
      if (!code) {
        if (inv.exists()) return false;
        tx.set(roomRef, { code: candidate, game, hostId: uid, phase: "lobby", gameNo: 1, roundNo: 0, currentRoundId: "", used: [], ...extra });
        tx.set(invite, { count: 1, game });
        tx.set(player, me);
        return true;
      }
      if (!inv.exists()) throw new Error("Sala não encontrada. Confira o código.");
      if (inv.data().game !== game) throw new Error("Esse código é de outro jogo.");
      const existing = await tx.get(player);
      if (existing.exists()) return true; // reconexão: mesma vaga
      if (inv.data().count >= MESA_MAX) throw new Error("Sala cheia: o limite é de 8 jogadores.");
      tx.update(invite, { count: inv.data().count + 1 });
      tx.set(player, me);
      return true;
    }).catch((e) => {
      // A regra só aceita novas entradas no lobby (entre rodadas).
      if ((e as { code?: string })?.code === "permission-denied" && code)
        throw new Error("Rodada em andamento. Aguarde o fim da rodada para entrar.");
      throw e;
    });
    if (ok) return candidate;
  }
  throw new Error("Não foi possível gerar um código. Tente novamente.");
}

/** Saída voluntária: libera a vaga e, se for o anfitrião, passa o posto. */
export async function leaveMesa(code: string, uid: string, players: MesaPlayer[]) {
  const roomRef = doc(db, "mesas", code);
  const inviteRef = doc(db, "mesaInvites", code);
  const selfRef = doc(db, `mesas/${code}/players/${uid}`);
  await runTransaction(db, async (tx) => {
    const [roomSnap, invSnap, selfSnap] = await Promise.all([tx.get(roomRef), tx.get(inviteRef), tx.get(selfRef)]);
    if (!roomSnap.exists() || !invSnap.exists() || !selfSnap.exists()) throw new Error("Não foi possível confirmar sua vaga. Atualize e tente novamente.");
    const room = roomSnap.data() as MesaRoom;
    const count = invSnap.data().count as number;
    const others = players.filter((p) => p.uid !== uid);
    const update: Record<string, unknown> = {};
    if (room.hostId === uid) {
      const next = pickSuccessor(others, uid);
      update.hostId = next?.uid ?? "";
    }
    // Com menos de 2 pessoas, a rodada não continua: volta ao lobby.
    if (room.phase === "playing" && count - 1 < MESA_MIN) update.phase = "lobby";
    if (Object.keys(update).length) tx.update(roomRef, update);
    tx.update(inviteRef, { count: count - 1 });
    tx.delete(selfRef);
  });
}

export function setPresence(code: string, uid: string, connected: boolean) {
  return updateDoc(doc(db, `mesas/${code}/players/${uid}`), { connected, presenceAt: serverTimestamp() });
}

/** Assume o posto de anfitrião se o atual saiu ou está desconectado há mais de 3 minutos. */
export async function claimMesaHost(code: string, uid: string) {
  const roomRef = doc(db, "mesas", code);
  await runTransaction(db, async (tx) => {
    const room = await tx.get(roomRef);
    const hostId = room.data()?.hostId as string;
    if (!hostId || hostId === uid) return;
    const host = await tx.get(doc(db, `mesas/${code}/players/${hostId}`));
    const data = host.exists() ? (host.data() as MesaPlayer) : undefined;
    if (!hostAway(data, Date.now())) return;
    tx.update(roomRef, { hostId: uid });
  });
}

/** Começa uma nova partida na mesma sala (zera rodadas e catálogo usado). */
export async function newMatch(code: string) {
  const roomRef = doc(db, "mesas", code);
  const room = (await getDoc(roomRef)).data() as MesaRoom;
  await updateDoc(roomRef, { gameNo: room.gameNo + 1, roundNo: 0, currentRoundId: "", used: [] });
}

export function setMesaOption(code: string, patch: Partial<Pick<MesaRoom, "mode" | "inventors">>) {
  return updateDoc(doc(db, "mesas", code), patch);
}

/** Participantes ordenados por entrada (base estável para rodízio). */
export function byJoin(players: MesaPlayer[]) {
  const t = (p: MesaPlayer) => p.joinedAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
  return [...players].sort((a, b) => t(a) - t(b) || (a.uid < b.uid ? -1 : 1));
}
