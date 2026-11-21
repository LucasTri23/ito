import { doc, runTransaction, serverTimestamp, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import catalog from "../data/planB.json";
import { randomInt } from "../utils/game";
import { PLANB_PICKS, PLANB_ROUNDS, type PlanBMission } from "../utils/planB";
import { roundIdOf, type MesaRoom } from "./mesa";

export const missions = catalog as PlanBMission[];

export interface PlanBRound {
  id: string;
  game: "planb";
  no: number;
  missionId: string;
  phase: "choose" | "reveal";
  participants: string[];
  confirmed: string[];
  startedAt: Timestamp | null;
}

/** Anfitrião abre a próxima rodada. O imprevisto é sorteado agora e lacrado. */
export async function startPlanBRound(code: string, uid: string, participants: string[]) {
  const roomRef = doc(db, "mesas", code);
  await runTransaction(db, async (tx) => {
    const room = (await tx.get(roomRef)).data() as MesaRoom | undefined;
    if (!room || room.hostId !== uid) throw new Error("Só o anfitrião pode começar a rodada.");
    if (room.phase !== "lobby") throw new Error("A rodada já começou.");
    if (room.roundNo >= PLANB_ROUNDS) throw new Error("A partida acabou. Comece uma nova partida.");
    if (participants.length < 2 || participants.length > 8) throw new Error("A sala precisa de 2 a 8 jogadores.");
    const available = missions.filter((m) => !room.used.includes(m.id));
    if (!available.length) throw new Error("Todas as missões foram usadas. Comece uma nova partida.");
    const mission = available[randomInt(available.length)];
    const no = room.roundNo + 1;
    const id = roundIdOf(room.gameNo, no);
    const roundRef = doc(db, `mesas/${code}/rounds/${id}`);
    if ((await tx.get(roundRef)).exists()) throw new Error("Essa rodada já foi criada.");
    tx.set(roundRef, {
      id,
      game: "planb",
      no,
      missionId: mission.id,
      phase: "choose",
      participants,
      confirmed: [],
      startedAt: serverTimestamp(),
    });
    tx.set(doc(db, `mesas/${code}/rounds/${id}/sealed/twist`), { twist: randomInt(3) });
    tx.update(roomRef, { phase: "playing", roundNo: no, currentRoundId: id, used: [...room.used, mission.id] });
  });
}

/** Confirma a escolha de 2 itens. Repetir não duplica: a escolha é única por pessoa. */
export async function confirmPlanB(code: string, roundId: string, uid: string, picks: number[]) {
  if (picks.length !== PLANB_PICKS || new Set(picks).size !== PLANB_PICKS || picks.some((p) => p < 0 || p > 5))
    throw new Error("Escolha exatamente dois itens.");
  const roundRef = doc(db, `mesas/${code}/rounds/${roundId}`);
  await runTransaction(db, async (tx) => {
    const round = (await tx.get(roundRef)).data() as PlanBRound | undefined;
    if (!round || round.phase !== "choose") throw new Error("A escolha já foi encerrada.");
    if (!round.participants.includes(uid)) throw new Error("Você entra na próxima rodada.");
    if (round.confirmed.includes(uid)) return;
    tx.set(doc(db, `mesas/${code}/rounds/${roundId}/choices/${uid}`), { uid, picks: [...picks].sort() });
    tx.update(roundRef, { confirmed: [...round.confirmed, uid] });
  });
}

/** Revela o imprevisto (todos confirmaram ou o tempo acabou). Idempotente. */
export async function revealPlanB(code: string, roundId: string) {
  const roomRef = doc(db, "mesas", code);
  const roundRef = doc(db, `mesas/${code}/rounds/${roundId}`);
  await runTransaction(db, async (tx) => {
    const [roundSnap, roomSnap] = await Promise.all([tx.get(roundRef), tx.get(roomRef)]);
    const round = roundSnap.data() as PlanBRound | undefined;
    const room = roomSnap.data() as MesaRoom | undefined;
    if (!round || round.phase !== "choose") return;
    tx.update(roundRef, { phase: "reveal" });
    if (room?.phase === "playing" && room.currentRoundId === roundId) tx.update(roomRef, { phase: "lobby" });
  });
}
