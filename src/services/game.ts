import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Room, Round, Player } from "../types/game";
import { randomInt, roomCode, shuffle } from "../utils/game";
export const roundPath = (code: string, id: string) =>
  `rooms/${code}/rounds/${id}`;
export async function createRoom(
  uid: string,
  name: string,
  mode: "ONLINE" | "IN_PERSON" = "ONLINE",
) {
  for (let i = 0; i < 10; i++) {
    const code = roomCode();
    const ref = doc(db, "rooms", code);
    const ok = await runTransaction(db, async (tx) => {
      if ((await tx.get(ref)).exists()) return false;
      tx.set(ref, {
        mode,
        ...(mode === "IN_PERSON" ? { deal: 0 } : {}),
        code,
        hostId: uid,
        status: "LOBBY",
        roundNo: 0,
        currentRoundId: "",
        createdAt: serverTimestamp(),
      });
      tx.set(doc(db, `rooms/${code}/players/${uid}`), {
        uid,
        name,
        connected: true,
        joinedAt: serverTimestamp(),
      });
      return true;
    });
    if (ok) return code;
  }
  throw new Error("Não foi possível gerar um código. Tente novamente.");
}
export async function joinRoom(code: string, uid: string, name: string) {
  const room = await getDoc(doc(db, "rooms", code));
  if (!room.exists()) throw new Error("Sala não encontrada. Confira o código.");
  if (room.data().status === "CLOSED")
    throw new Error("Esta sala foi encerrada.");
  const ref = doc(db, `rooms/${code}/players/${uid}`);
  if ((await getDoc(ref)).exists()) {
    await updateDoc(ref, { connected: true });
    return;
  }
  if (room.data().status !== "LOBBY")
    throw new Error("A partida já começou. Aguarde uma nova sala.");
  await setDoc(ref, {
    uid,
    name,
    connected: true,
    joinedAt: serverTimestamp(),
  });
}
export async function newRound(code: string, players: Player[]) {
  await runTransaction(db, async (tx) => {
    const ref = doc(db, "rooms", code);
    const room = (await tx.get(ref)).data() as Room;
    if (room.currentRoundId) {
      const old = (
        await tx.get(doc(db, roundPath(code, room.currentRoundId)))
      ).data() as Round;
      if (old.state !== "RESULT") throw new Error("Termine a rodada atual.");
      // Clear private and per-player data atomically with the round switch.
      for (const uid of old.playerIds) {
        for (const collection of ["secrets", "answers", "ready"]) {
          tx.delete(
            doc(
              db,
              `${roundPath(code, room.currentRoundId)}/${collection}/${uid}`,
            ),
          );
        }
      }
    }
    const ids = players.map((p) => p.uid);
    if (ids.length < 2 || ids.length > 8)
      throw new Error("A rodada precisa de 2 a 8 participantes.");
    const id = String(room.roundNo + 1);
    tx.set(doc(db, roundPath(code, id)), {
      state: "WAITING_FOR_THEME",
      theme: "",
      lowLabel: "",
      highLabel: "",
      playerIds: ids,
      presentationOrder: ids,
      currentPresentationIndex: 0,
      groupOrder: ids,
      createdAt: serverTimestamp(),
    });
    tx.update(ref, {
      status: "PLAYING",
      roundNo: room.roundNo + 1,
      currentRoundId: id,
    });
  });
}
export const startTheme = (
  path: string,
  theme: string,
  lowLabel: string,
  highLabel: string,
) =>
  updateDoc(doc(db, path), {
    theme,
    lowLabel,
    highLabel,
    state: "DISTRIBUTING_NUMBERS",
  });
export async function drawSecret(path: string, uid: string) {
  await runTransaction(db, async (tx) => {
    const ref = doc(db, `${path}/secrets/${uid}`);
    if ((await tx.get(ref)).exists()) return;
    tx.set(ref, { playerId: uid, number: randomInt(100) + 1 });
    tx.set(doc(db, `${path}/ready/${uid}`), { uid });
  });
}
export const startPresenting = (path: string, ids: string[]) =>
  updateDoc(doc(db, path), {
    state: "PRESENTING",
    presentationOrder: shuffle(ids),
  });
export async function submitAnswer(
  path: string,
  player: Player,
  answer: string,
  skipped = false,
) {
  await setDoc(doc(db, `${path}/answers/${player.uid}`), {
    playerId: player.uid,
    playerName: player.name,
    answer,
    skipped,
  });
}
export async function advance(path: string) {
  await runTransaction(db, async (tx) => {
    const ref = doc(db, path);
    const round = (await tx.get(ref)).data() as Round;
    if (round.state !== "PRESENTING") return;
    const id = round.presentationOrder[round.currentPresentationIndex];
    if (!(await tx.get(doc(db, `${path}/answers/${id}`))).exists()) return;
    if (round.currentPresentationIndex + 1 === round.playerIds.length)
      tx.update(ref, { state: "ORDERING" });
    else
      tx.update(ref, {
        currentPresentationIndex: round.currentPresentationIndex + 1,
      });
  });
}
export const setOrder = (path: string, groupOrder: string[]) =>
  updateDoc(doc(db, path), { groupOrder });
export const setPhase = (path: string, state: "READY_FOR_RESULT" | "RESULT") =>
  updateDoc(doc(db, path), { state });
export const presence = (code: string, uid: string, connected: boolean) =>
  updateDoc(doc(db, `rooms/${code}/players/${uid}`), { connected });
export const removePlayer = (code: string, uid: string) =>
  deleteDoc(doc(db, `rooms/${code}/players/${uid}`));
export async function closeRoom(code: string) {
  const batch = writeBatch(db);
  batch.update(doc(db, "rooms", code), { status: "CLOSED" });
  await batch.commit();
}
