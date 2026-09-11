import { doc, runTransaction } from "firebase/firestore";
import { db } from "../lib/firebase";
import { randomInt } from "../utils/game";
import type { Room } from "../types/game";

export async function receiveCard(code: string, uid: string) {
  await runTransaction(db, async (tx) => {
    const room = (await tx.get(doc(db, "rooms", code))).data() as Room;
    if (room.mode !== "IN_PERSON" || room.status !== "LOBBY" || !room.deal) return;
    const ref = doc(db, `rooms/${code}/cards/${uid}`);
    const card = await tx.get(ref);
    if (card.exists() && card.data().deal === room.deal) return;
    tx.set(ref, { uid, deal: room.deal, number: randomInt(100) + 1 });
  });
}

export async function redeal(code: string) {
  await runTransaction(db, async (tx) => {
    const ref = doc(db, "rooms", code);
    const room = (await tx.get(ref)).data() as Room;
    if (room.mode !== "IN_PERSON") throw new Error("Sala incompatível.");
    tx.update(ref, { deal: (room.deal ?? 0) + 1 });
  });
}
