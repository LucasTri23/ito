import { collection, doc, runTransaction, serverTimestamp, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import catalog from "../data/alibi.json";
import { chooseAlibiRoles, emptyAlibiHistory, recordAlibiRoles, type AlibiHistory } from "../utils/alibi";
import { randomInt } from "../utils/game";

export type AlibiRoundData = {
  id: string; phase: string; catalogId: string; situation: string; suspects: string[];
  investigator: string | null; jurors: string[]; submitted: string[]; voted: string[];
  customQuestion: string; startedAt: Timestamp | null; surpriseAt: Timestamp | null;
  voteStartedAt: Timestamp | null; history: AlibiHistory; used: string[];
};
export const situations = catalog;
export async function alibiAction(code: string, uid: string, action: string, roundId: string | undefined, value: unknown, players: string[]) {
  const roomRef = doc(db, "alibiRooms", code);
  const newRef = doc(collection(db, `alibiRooms/${code}/rounds`));
  await runTransaction(db, async tx => {
    const roomSnap = await tx.get(roomRef);
    if (!roomSnap.exists()) throw new Error("Sala não encontrada.");
    const room = roomSnap.data();
    if (action === "newRound" || action === "newGame") {
      if (room.hostId !== uid || room.phase !== "lobby") throw new Error("Aguarde o fim da rodada.");
      if (players.length < 2 || players.length > 8) throw new Error("A sala precisa de 2 a 8 jogadores.");
      const previous = room.currentRoundId ? (await tx.get(doc(db, `alibiRooms/${code}/rounds/${room.currentRoundId}`))).data() as AlibiRoundData | undefined : undefined;
      const used = action === "newGame" ? [] : previous?.used || [];
      const available = catalog.filter(item => !used.includes(item.id));
      if (!available.length) throw new Error("Todas as situações foram usadas. Inicie uma nova partida.");
      const item = available[randomInt(available.length)];
      const history = action === "newGame" ? emptyAlibiHistory() : previous?.history || emptyAlibiHistory();
      const roles = chooseAlibiRoles(players, history);
      tx.set(newRef, { id: newRef.id, phase: "presentation", catalogId: item.id, situation: item.situation,
        suspects: roles.suspects, investigator: roles.investigator, jurors: roles.jurors,
        submitted: [], voted: [], customQuestion: "", startedAt: null, surpriseAt: null, voteStartedAt: null,
        history: recordAlibiRoles(history, roles), used: [...used, item.id] });
      tx.update(roomRef, { phase: "playing", currentRoundId: newRef.id });
      return;
    }
    if (!roundId || room.currentRoundId !== roundId) throw new Error("A rodada mudou. Tente novamente.");
    const ref = doc(db, `alibiRooms/${code}/rounds/${roundId}`);
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Rodada não encontrada.");
    const round = snap.data() as AlibiRoundData;
    switch (action) {
      case "start": tx.update(ref, { phase: "timer", startedAt: serverTimestamp() }); break;
      case "question": tx.update(ref, { phase: "answers", customQuestion: typeof value === "string" ? value.trim() : "" }); break;
      case "answer": {
        if (!Array.isArray(value) || value.length !== 3 || value.some(x => typeof x !== "string" || !x.trim() || x.length > 500)) throw new Error("Preencha as três respostas.");
        if (round.submitted.includes(uid)) throw new Error("Resposta já enviada.");
        tx.set(doc(db, `${ref.path}/answers/${uid}`), { uid, values: value.map(x => x.trim()) });
        tx.update(ref, { submitted: [...round.submitted, uid] }); break;
      }
      case "beginVote": tx.update(ref, { phase: "vote", voteStartedAt: serverTimestamp() }); break;
      case "vote": {
        if (!["colou", "furado"].includes(String(value)) || round.voted.includes(uid)) throw new Error("Voto inválido ou já registrado.");
        tx.set(doc(db, `${ref.path}/votes/${uid}`), { uid, choice: value });
        tx.update(ref, { voted: [...round.voted, uid] }); break;
      }
      case "tick": {
        if (round.phase === "timer" && round.startedAt)
          tx.update(ref, round.investigator ? { phase: "surprise", surpriseAt: serverTimestamp() } : { phase: "answers" });
        else if (round.phase === "surprise" && round.surpriseAt)
          tx.update(ref, { phase: "answers", customQuestion: "" });
        else if (round.phase === "answers" && round.submitted.length === 2) tx.update(ref, { phase: "reveal" });
        else if (round.phase === "vote" && !round.investigator && room.hostId === uid && round.voted.includes(uid)) {
          tx.update(ref, { phase: "result" }); tx.update(roomRef, { phase: "lobby" });
        }
        else if (round.phase === "vote" && round.investigator && round.voteStartedAt) {
          tx.update(ref, { phase: "result" }); tx.update(roomRef, { phase: "lobby" });
        }
        break;
      }
      case "skipVerdict": tx.update(ref, { phase: "result" }); tx.update(roomRef, { phase: "lobby" }); break;
      case "finishDuo": tx.update(ref, { phase: "result" }); tx.update(roomRef, { phase: "lobby" }); break;
      case "cancel": tx.update(ref, { phase: "cancelled" }); tx.update(roomRef, { phase: "lobby" }); break;
      default: throw new Error("Ação desconhecida.");
    }
  });
}
