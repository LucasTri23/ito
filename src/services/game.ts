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
import {
  hostAway,
  pickSuccessor,
  randomInt,
  roomCode,
  shuffle,
} from "../utils/game";
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
        presenceAt: serverTimestamp(),
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
    await updateDoc(ref, { connected: true, presenceAt: serverTimestamp() });
    return;
  }
  if (room.data().status !== "LOBBY")
    throw new Error("A partida já começou. Aguarde uma nova sala.");
  await setDoc(ref, {
    uid,
    name,
    connected: true,
    joinedAt: serverTimestamp(),
    presenceAt: serverTimestamp(),
  });
}
export async function newRound(code: string, players: Player[]) {
  await runTransaction(db, async (tx) => {
    const ref = doc(db, "rooms", code);
    const room = (await tx.get(ref)).data() as Room;
    // After "voltar ao lobby" currentRoundId is "", so nothing to clean up.
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
  updateDoc(doc(db, `rooms/${code}/players/${uid}`), {
    connected,
    presenceAt: serverTimestamp(),
  });
export const removePlayer = (code: string, uid: string) =>
  deleteDoc(doc(db, `rooms/${code}/players/${uid}`));
export async function closeRoom(code: string) {
  const batch = writeBatch(db);
  batch.update(doc(db, "rooms", code), { status: "CLOSED" });
  await batch.commit();
}
/** Host-only: abandon the current round and go back to the lobby. */
export const backToLobby = (code: string) =>
  updateDoc(doc(db, "rooms", code), { status: "LOBBY", currentRoundId: "" });
/**
 * Voluntary exit: the player document is deleted (not just `connected: false`).
 * A leaving host hands `hostId` to the predictable successor in the same
 * transaction; if nobody remains, the room is closed. If fewer than two people
 * remain during a round, the room goes back to the lobby.
 */
export async function leaveRoom(code: string, uid: string, players: Player[]) {
  await runTransaction(db, async (tx) => {
    const roomRef = doc(db, "rooms", code);
    const meRef = doc(db, `rooms/${code}/players/${uid}`);
    const snap = await tx.get(roomRef);
    if (!snap.exists()) return;
    const room = snap.data() as Room;
    if (room.status === "CLOSED" || !(await tx.get(meRef)).exists()) return;
    // Confirm the remaining members against the server inside the transaction.
    const others: Player[] = [];
    for (const p of players) {
      if (p.uid === uid) continue;
      const s = await tx.get(doc(db, `rooms/${code}/players/${p.uid}`));
      if (s.exists()) others.push(s.data() as Player);
    }
    if (room.hostId === uid) {
      const next = pickSuccessor(others, uid);
      if (!next) tx.update(roomRef, { status: "CLOSED" });
      else
        tx.update(roomRef, {
          hostId: next.uid,
          ...(room.status === "PLAYING" && others.length < 2
            ? { status: "LOBBY", currentRoundId: "" }
            : {}),
        });
    }
    tx.delete(meRef);
  });
}
/**
 * Takes over a room whose host left or has been offline for longer than
 * HOST_TAKEOVER_MINUTES. The rules accept it only for an existing member
 * claiming for themselves while the previous host is still away, so two
 * concurrent claims cannot both succeed.
 */
export async function claimHost(code: string, uid: string) {
  return runTransaction(db, async (tx) => {
    const roomRef = doc(db, "rooms", code);
    const room = (await tx.get(roomRef)).data() as Room | undefined;
    if (!room || room.status === "CLOSED" || room.hostId === uid) return false;
    const old = await tx.get(doc(db, `rooms/${code}/players/${room.hostId}`));
    if (!hostAway(old.exists() ? (old.data() as Player) : undefined, Date.now()))
      return false;
    tx.update(roomRef, { hostId: uid });
    return true;
  });
}
