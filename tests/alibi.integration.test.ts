import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, type Firestore } from "firebase/firestore";

const context = vi.hoisted(() => ({ db: null as unknown as Firestore }));
vi.mock("../src/lib/firebase", () => ({ get db() { return context.db; } }));
import { alibiAction } from "../src/services/alibi";

describe.skipIf(!process.env.FIRESTORE_EMULATOR_HOST)("Álibi: serviço Firestore", () => {
  let env: RulesTestEnvironment;
  beforeAll(async () => { env = await initializeTestEnvironment({ projectId: "demo-alibi", firestore: { rules: readFileSync("firestore.rules", "utf8") } }); });
  afterAll(async () => { await env?.cleanup(); });
  it.each([2, 3, 5, 8])("usa transações do aplicativo com %i identidades", async count => {
    await env.clearFirestore();
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h"].slice(0, count);
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      await setDoc(doc(db, "alibiRooms/ABCDE"), { code: "ABCDE", hostId: "a", phase: "lobby" });
      await setDoc(doc(db, "alibiInvites/ABCDE"), { count, open: true });
      for (const uid of ids) await setDoc(doc(db, `alibiRooms/ABCDE/players/${uid}`), { uid, name: uid });
    });
    const clients = Object.fromEntries(ids.map(uid => [uid, env.authenticatedContext(uid).firestore() as unknown as Firestore]));
    await assertSucceeds(setDoc(doc(clients.a, "alibiRooms/ABCDE/clock/a"), { at: serverTimestamp() }));
    await assertFails(getDoc(doc(clients.b, "alibiRooms/ABCDE/clock/a")));
    const act = async (uid: string, action: string, id?: string, value?: unknown) => { context.db = clients[uid]; await alibiAction("ABCDE", uid, action, id, value, ids); };
    await act("a", "newRound");
    const room = (await getDoc(doc(clients.a, "alibiRooms/ABCDE"))).data()!;
    const id = room.currentRoundId as string, path = `alibiRooms/ABCDE/rounds/${id}`;
    let round = (await getDoc(doc(clients.a, path))).data()!;
    expect(round.phase).toBe("presentation");
    await act("a", "start", id);
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), path), { startedAt: new Date(Date.now() - 31000) }));
    await act("b", "tick", id);
    round = (await getDoc(doc(clients.a, path))).data()!;
    if (count > 2) await act(round.investigator, "question", id, "Qual era a cor?");
    for (const uid of round.suspects) await act(uid, "answer", id, ["um", "dois", "três"]);
    await act("b", "tick", id);
    expect((await getDoc(doc(clients.a, path))).data()!.phase).toBe("reveal");
    await act("a", "beginVote", id);
    round = (await getDoc(doc(clients.a, path))).data()!;
    const voters = round.jurors.length ? round.jurors as string[] : [round.investigator || "a"];
    for (const uid of voters) await act(uid, "vote", id, "colou");
    await act(count === 2 ? "a" : "b", "tick", id);
    expect((await getDoc(doc(clients.a, path))).data()!.phase).toBe("result");
  }, 30000);
  it("aplica perguntas e veredito padrão após os prazos", async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      await setDoc(doc(db, "alibiRooms/ABCDE"), { code: "ABCDE", hostId: "a", phase: "playing", currentRoundId: "r" });
      for (const uid of ["a", "b", "c"]) await setDoc(doc(db, `alibiRooms/ABCDE/players/${uid}`), { uid, name: uid });
      await setDoc(doc(db, "alibiRooms/ABCDE/rounds/r"), { id: "r", phase: "surprise", suspects: ["a", "b"], investigator: "c", jurors: [], submitted: [], voted: [], customQuestion: "", surpriseAt: new Date(Date.now() - 16000) });
    });
    context.db = env.authenticatedContext("a").firestore() as unknown as Firestore;
    await alibiAction("ABCDE", "a", "tick", "r", undefined, []);
    expect((await getDoc(doc(context.db, "alibiRooms/ABCDE/rounds/r"))).data()!.phase).toBe("answers");
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), "alibiRooms/ABCDE/rounds/r"), { phase: "vote", voteStartedAt: new Date(Date.now() - 31000) }));
    await alibiAction("ABCDE", "a", "tick", "r", undefined, []);
    expect((await getDoc(doc(context.db, "alibiRooms/ABCDE/rounds/r"))).data()!.phase).toBe("result");
  }, 30000);
});
