import { readFileSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, describe, it, expect } from "vitest";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  writeBatch,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
const enabled = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
describe.skipIf(!enabled)("Firestore: fronteira de segurança", () => {
  let env: RulesTestEnvironment;
  const path = "rooms/ABCDE/rounds/1";
  beforeAll(async () => {
    env = await initializeTestEnvironment({
      projectId: "demo-entrelinhas",
      firestore: { rules: readFileSync("firestore.rules", "utf8") },
    });
  });
  afterAll(async () => {
    await env?.cleanup();
  });
  it.each([2, 3, 5, 8])("Álibi sem Functions: conclui rodada com %i jogadores", async (count) => {
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h"].slice(0, count);
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      await setDoc(doc(db, "alibiRooms/ZZZZZ"), { code: "ZZZZZ", hostId: "a", phase: "lobby" });
      await setDoc(doc(db, "alibiInvites/ZZZZZ"), { count, open: true });
      for (const uid of ids) await setDoc(doc(db, `alibiRooms/ZZZZZ/players/${uid}`), { uid, name: uid });
    });
    const contexts = Object.fromEntries(ids.map(uid => [uid, env.authenticatedContext(uid).firestore()]));
    const db = (uid: string) => contexts[uid];
    const room = "alibiRooms/ZZZZZ", round = `${room}/rounds/one`;
    const create = writeBatch(db("a"));
    create.set(doc(db("a"), round), { id: "one", phase: "presentation", catalogId: "teste", situation: "Uma situação.", suspects: ["a", "b"], investigator: count > 2 ? "c" : null, jurors: ids.slice(3), submitted: [], voted: [], customQuestion: "", startedAt: null, surpriseAt: null, voteStartedAt: null, history: {}, used: ["teste"] });
    create.update(doc(db("a"), room), { phase: "playing", currentRoundId: "one" });
    await assertSucceeds(create.commit());
    await assertFails(updateDoc(doc(db("b"), round), { phase: "timer", startedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(db("a"), round), { phase: "timer", startedAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(db("b"), round), count === 2 ? { phase: "answers" } : { phase: "surprise", surpriseAt: serverTimestamp() }));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), round), { startedAt: new Date(Date.now() - 31000) }));
    await assertSucceeds(updateDoc(doc(db("b"), round), count === 2 ? { phase: "answers" } : { phase: "surprise", surpriseAt: serverTimestamp() }));
    if (count > 2) await assertSucceeds(updateDoc(doc(db("c"), round), { phase: "answers", customQuestion: "Qual era a cor?" }));
    for (const [index, uid] of ["a", "b"].entries()) {
      const batch = writeBatch(db(uid));
      batch.set(doc(db(uid), `${round}/answers/${uid}`), { uid, values: ["um", "dois", "três"] });
      batch.update(doc(db(uid), round), { submitted: ["a", "b"].slice(0, index + 1) });
      await assertSucceeds(batch.commit());
      if (index === 0) await assertFails(getDoc(doc(db("b"), `${round}/answers/a`)));
    }
    await assertSucceeds(updateDoc(doc(db("b"), round), { phase: "reveal" }));
    await assertSucceeds(getDocs(collection(db("b"), `${round}/answers`)));
    await assertSucceeds(updateDoc(doc(db("a"), round), { phase: "vote", voteStartedAt: serverTimestamp() }));
    const voters = count === 2 ? ["a"] : count === 3 ? ["c"] : ids.slice(3);
    for (const [index, uid] of voters.entries()) {
      const batch = writeBatch(db(uid));
      batch.set(doc(db(uid), `${round}/votes/${uid}`), { uid, choice: "colou" });
      batch.update(doc(db(uid), round), { voted: voters.slice(0, index + 1) });
      await assertSucceeds(batch.commit());
    }
    if (count > 2) await assertFails(getDocs(collection(db("a"), `${round}/votes`)));
    const finisher = count === 2 ? "a" : "b";
    const finish = writeBatch(db(finisher));
    finish.update(doc(db(finisher), round), { phase: "result" });
    finish.update(doc(db(finisher), room), { phase: "lobby" });
    await assertSucceeds(finish.commit());
    expect((await assertSucceeds(getDocs(collection(db("a"), `${round}/votes`)))).size).toBe(voters.length);
  });
  it("Álibi sem Functions: respostas e votos são privados, imutáveis e vinculados à rodada", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, "alibiRooms/KLMNP"), { hostId: "a", currentRoundId: "1" });
      for (const uid of ["a", "b", "c", "d"]) await setDoc(doc(db, `alibiRooms/KLMNP/players/${uid}`), { uid, name: uid });
      await setDoc(doc(db, "alibiRooms/KLMNP/rounds/1"), { phase: "answers", suspects: ["a", "b"], investigator: "c", jurors: ["d"], submitted: [], voted: [] });
    });
    const a = env.authenticatedContext("a").firestore();
    const b = env.authenticatedContext("b").firestore();
    const c = env.authenticatedContext("c").firestore();
    const d = env.authenticatedContext("d").firestore();
    const outsider = env.authenticatedContext("outsider").firestore();
    const answer = "alibiRooms/KLMNP/rounds/1/answers/a";
    const answerBatch = writeBatch(a);
    answerBatch.set(doc(a, answer), { uid: "a", values: ["um", "dois", "três"] });
    answerBatch.update(doc(a, "alibiRooms/KLMNP/rounds/1"), { submitted: ["a"] });
    await assertSucceeds(answerBatch.commit());
    await assertSucceeds(getDoc(doc(a, answer)));
    await assertFails(getDoc(doc(b, answer)));
    await assertFails(getDoc(doc(c, answer)));
    await assertFails(getDoc(doc(outsider, answer)));
    await assertFails(setDoc(doc(a, answer), { uid: "a", values: ["alterada", "dois", "três"] }));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), "alibiRooms/KLMNP/rounds/1"), { phase: "vote", voteStartedAt: new Date() }));
    await assertSucceeds(getDoc(doc(b, answer)));
    const vote = "alibiRooms/KLMNP/rounds/1/votes/d";
    await assertFails(setDoc(doc(c, "alibiRooms/KLMNP/rounds/1/votes/c"), { uid: "c", choice: "colou" }));
    const voteBatch = writeBatch(d);
    voteBatch.set(doc(d, vote), { uid: "d", choice: "colou" });
    voteBatch.update(doc(d, "alibiRooms/KLMNP/rounds/1"), { voted: ["d"] });
    await assertSucceeds(voteBatch.commit());
    await assertFails(getDoc(doc(a, vote)));
    await assertFails(setDoc(doc(d, vote), { uid: "d", choice: "furado" }));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), "alibiRooms/KLMNP/rounds/1"), { phase: "result" }));
    await assertSucceeds(getDoc(doc(a, vote)));
    await assertFails(getDoc(doc(outsider, vote)));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), "alibiRooms/KLMNP"), { currentRoundId: "2" }));
    await assertFails(getDoc(doc(a, answer)));
  });
  it("Álibi: ingresso atômico respeita capacidade e restringe leitura", async () => {
    const a = env.authenticatedContext("a").firestore();
    const outside = env.authenticatedContext("z").firestore();
    const first = writeBatch(a);
    first.set(doc(a, "alibiRooms/FGHJK"), { code: "FGHJK", hostId: "a", phase: "lobby" });
    first.set(doc(a, "alibiInvites/FGHJK"), { count: 1, open: true });
    first.set(doc(a, "alibiRooms/FGHJK/players/a"), { uid: "a", name: "Ana", joinedAt: serverTimestamp() });
    await assertSucceeds(first.commit());
    await assertFails(getDoc(doc(outside, "alibiRooms/FGHJK")));
    await assertFails(getDocs(collection(outside, "alibiRooms/FGHJK/players")));
    await assertFails(setDoc(doc(outside, "alibiRooms/FGHJK/players/z"), { uid: "z", name: "Z", joinedAt: serverTimestamp() }));
    for (const [i, uid] of ["b", "c", "d", "e", "f", "g"].entries()) {
      const db = env.authenticatedContext(uid).firestore();
      const batch = writeBatch(db);
      batch.update(doc(db, "alibiInvites/FGHJK"), { count: i + 2 });
      batch.set(doc(db, `alibiRooms/FGHJK/players/${uid}`), { uid, name: uid, joinedAt: serverTimestamp() });
      await assertSucceeds(batch.commit());
      await assertSucceeds(getDoc(doc(db, "alibiRooms/FGHJK")));
    }
    const compete = async (uid: string) => {
      const db = env.authenticatedContext(uid).firestore();
      return runTransaction(db, async (tx) => {
        const invite = doc(db, "alibiInvites/FGHJK");
        const snap = await tx.get(invite);
        tx.update(invite, { count: snap.data()!.count + 1 });
        tx.set(doc(db, `alibiRooms/FGHJK/players/${uid}`), { uid, name: uid, joinedAt: serverTimestamp() });
      });
    };
    const race = await Promise.allSettled([compete("h"), compete("i")]);
    expect(race.filter(r => r.status === "fulfilled")).toHaveLength(1);
    const ninth = writeBatch(outside);
    ninth.update(doc(outside, "alibiInvites/FGHJK"), { count: 9 });
    ninth.set(doc(outside, "alibiRooms/FGHJK/players/z"), { uid: "z", name: "Z", joinedAt: serverTimestamp() });
    await assertFails(ninth.commit());
  });
  it("presencial: cartas privadas, entrada tardia e reenvio somente pelo anfitrião", async () => {
    const a = env.authenticatedContext("a").firestore();
    const b = env.authenticatedContext("b").firestore();
    const roomRef = doc(a, "rooms/PQRST");
    const batch = writeBatch(a);
    batch.set(roomRef, {
      code: "PQRST",
      hostId: "a",
      mode: "IN_PERSON",
      deal: 0,
      status: "LOBBY",
      roundNo: 0,
      currentRoundId: "",
      createdAt: serverTimestamp(),
    });
    batch.set(doc(a, "rooms/PQRST/players/a"), {
      uid: "a",
      name: "Ana",
      connected: true,
      joinedAt: serverTimestamp(),
    });
    await assertSucceeds(batch.commit());
    await assertFails(
      setDoc(doc(a, "rooms/PQRST/cards/a"), { uid: "a", deal: 0, number: 73 }),
    );
    await assertFails(
      setDoc(doc(a, "rooms/PQRST/cards/a"), { uid: "a", deal: 1, number: 73 }),
    );
    await assertSucceeds(updateDoc(roomRef, { deal: 1 }));
    await assertSucceeds(
      setDoc(doc(a, "rooms/PQRST/cards/a"), { uid: "a", deal: 1, number: 73 }),
    );
    await assertSucceeds(
      setDoc(doc(b, "rooms/PQRST/players/b"), {
        uid: "b",
        name: "Bia",
        connected: true,
        joinedAt: serverTimestamp(),
      }),
    );
    await assertSucceeds(
      setDoc(doc(b, "rooms/PQRST/cards/b"), { uid: "b", deal: 1, number: 21 }),
    );
    await assertSucceeds(getDoc(doc(b, "rooms/PQRST/cards/b")));
    await assertFails(getDoc(doc(a, "rooms/PQRST/cards/b")));
    await assertFails(getDocs(collection(a, "rooms/PQRST/cards")));
    await assertFails(updateDoc(doc(b, "rooms/PQRST/cards/b"), { number: 99 }));
    await assertFails(updateDoc(doc(b, "rooms/PQRST"), { deal: 2 }));
    await assertFails(updateDoc(roomRef, { mode: "ONLINE" }));
    await assertSucceeds(updateDoc(roomRef, { deal: 2 }));
    await assertFails(
      setDoc(doc(b, "rooms/PQRST/cards/b"), { uid: "b", deal: 1, number: 55 }),
    );
    await assertSucceeds(
      setDoc(doc(b, "rooms/PQRST/cards/b"), { uid: "b", deal: 2, number: 55 }),
    );
    await assertFails(updateDoc(doc(b, "rooms/PQRST/cards/b"), { number: 56 }));
    await assertFails(
      setDoc(doc(a, "rooms/PQRST/cards/b"), { uid: "b", deal: 2, number: 88 }),
    );
  });
  beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async (c) => {
      const db = c.firestore();
      await setDoc(doc(db, "rooms/ABCDE"), {
        code: "ABCDE",
        hostId: "a",
        status: "PLAYING",
        roundNo: 1,
        currentRoundId: "1",
      });
      for (const uid of ["a", "b", "c", "d"])
        await setDoc(doc(db, `rooms/ABCDE/players/${uid}`), {
          uid,
          name: uid,
          connected: true,
        });
      await setDoc(doc(db, path), {
        state: "DISTRIBUTING_NUMBERS",
        theme: "Tema",
        lowLabel: "Pouco",
        highLabel: "Muito",
        playerIds: ["a", "b", "c", "d"],
        presentationOrder: ["a", "b", "c", "d"],
        groupOrder: ["a", "b", "c", "d"],
        currentPresentationIndex: 0,
      });
    });
  });
  it("protege números inclusive contra o anfitrião e proíbe sobrescrita", async () => {
    const a = env.authenticatedContext("a").firestore();
    const b = env.authenticatedContext("b").firestore();
    await assertSucceeds(
      setDoc(doc(b, `${path}/secrets/b`), { playerId: "b", number: 73 }),
    );
    await assertSucceeds(getDoc(doc(b, `${path}/secrets/b`)));
    await assertFails(getDoc(doc(a, `${path}/secrets/b`)));
    await assertFails(getDocs(collection(a, `${path}/secrets`)));
    await assertFails(updateDoc(doc(b, `${path}/secrets/b`), { number: 1 }));
    await assertFails(
      setDoc(doc(a, `${path}/secrets/c`), { playerId: "c", number: 2 }),
    );
  });
  it("bloqueia anônimos sem login, estranhos e revelação prematura", async () => {
    for (const c of [
      env.unauthenticatedContext(),
      env.authenticatedContext("x"),
    ])
      await assertFails(getDoc(doc(c.firestore(), path)));
    const b = env.authenticatedContext("b").firestore();
    await assertFails(updateDoc(doc(b, path), { state: "RESULT" }));
    await assertFails(
      updateDoc(doc(env.authenticatedContext("a").firestore(), path), {
        state: "RESULT",
      }),
    );
    await assertFails(
      setDoc(doc(b, `${path}/secrets/b`), { playerId: "b", number: 101 }),
    );
  });
  it("executa quatro jogadores até resultado, com respostas imutáveis e rodada nova", async () => {
    const a = env.authenticatedContext("a").firestore();
    await assertFails(updateDoc(doc(a, path), { state: "PRESENTING" }));
    for (const uid of ["a", "b", "c", "d"]) {
      const db = env.authenticatedContext(uid).firestore();
      const batch = writeBatch(db);
      batch.set(doc(db, `${path}/secrets/${uid}`), {
        playerId: uid,
        number: uid.charCodeAt(0) - 90,
      });
      batch.set(doc(db, `${path}/ready/${uid}`), { uid });
      await assertSucceeds(batch.commit());
    }
    await assertSucceeds(
      updateDoc(doc(a, path), {
        state: "PRESENTING",
        presentationOrder: ["a", "b", "c", "d"],
      }),
    );
    const b = env.authenticatedContext("b").firestore();
    await assertFails(
      setDoc(doc(b, `${path}/answers/b`), {
        playerId: "b",
        playerName: "b",
        answer: "Cedo",
        skipped: false,
      }),
    );
    for (const [i, uid] of ["a", "b", "c", "d"].entries()) {
      const db = env.authenticatedContext(uid).firestore();
      await assertSucceeds(
        setDoc(doc(db, `${path}/answers/${uid}`), {
          playerId: uid,
          playerName: uid,
          answer: `Pista ${uid}`,
          skipped: false,
        }),
      );
      await assertFails(
        updateDoc(doc(db, `${path}/answers/${uid}`), { answer: "Editada" }),
      );
      await assertSucceeds(
        updateDoc(
          doc(a, path),
          i < 3 ? { currentPresentationIndex: i + 1 } : { state: "ORDERING" },
        ),
      );
    }
    await assertFails(
      updateDoc(doc(b, path), { groupOrder: ["d", "c", "b", "a"] }),
    );
    await assertFails(
      updateDoc(doc(a, path), { groupOrder: ["a", "a", "a", "a"] }),
    );
    await assertSucceeds(
      updateDoc(doc(a, path), { groupOrder: ["d", "c", "b", "a"] }),
    );
    await assertSucceeds(
      updateDoc(doc(a, path), { state: "READY_FOR_RESULT" }),
    );
    await assertFails(getDocs(collection(b, `${path}/secrets`)));
    await assertFails(updateDoc(doc(b, path), { state: "RESULT" }));
    await assertSucceeds(updateDoc(doc(a, path), { state: "RESULT" }));
    expect(
      (await assertSucceeds(getDocs(collection(b, `${path}/secrets`)))).size,
    ).toBe(4);
    await assertFails(
      getDocs(
        collection(
          env.authenticatedContext("x").firestore(),
          `${path}/secrets`,
        ),
      ),
    );
    const batch = writeBatch(a);
    batch.update(doc(a, "rooms/ABCDE"), {
      roundNo: 2,
      currentRoundId: "2",
      status: "PLAYING",
    });
    batch.set(doc(a, "rooms/ABCDE/rounds/2"), {
      state: "WAITING_FOR_THEME",
      theme: "",
      lowLabel: "",
      highLabel: "",
      playerIds: ["a", "b", "c", "d"],
      presentationOrder: ["a", "b", "c", "d"],
      groupOrder: ["a", "b", "c", "d"],
      currentPresentationIndex: 0,
      createdAt: serverTimestamp(),
    });
    for (const uid of ["a", "b", "c", "d"]) {
      for (const collection of ["secrets", "answers", "ready"])
        batch.delete(doc(a, `${path}/${collection}/${uid}`));
    }
    await assertSucceeds(batch.commit());
    await assertFails(getDoc(doc(b, `${path}/secrets/b`)));
    await env.withSecurityRulesDisabled(async (context) => {
      expect(
        (await getDocs(collection(context.firestore(), `${path}/secrets`)))
          .empty,
      ).toBe(true);
      expect(
        (await getDocs(collection(context.firestore(), `${path}/answers`)))
          .empty,
      ).toBe(true);
    });
  });
  it("suporta oito marcadores dentro do limite de acessos das regras", async () => {
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h"];
    await env.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await updateDoc(doc(db, path), {
        playerIds: ids,
        presentationOrder: ids,
        groupOrder: ids,
      });
      for (const uid of ids) {
        await setDoc(doc(db, `rooms/ABCDE/players/${uid}`), {
          uid,
          name: uid,
          connected: true,
        });
        await setDoc(doc(db, `${path}/ready/${uid}`), { uid });
      }
    });
    await assertSucceeds(
      updateDoc(doc(env.authenticatedContext("a").firestore(), path), {
        state: "PRESENTING",
        presentationOrder: [...ids].reverse(),
      }),
    );
  });
  it("cria sala atomicamente e permite ingresso somente no lobby", async () => {
    const db = env.authenticatedContext("z").firestore();
    const batch = writeBatch(db);
    batch.set(doc(db, "rooms/FGHJK"), {
      code: "FGHJK",
      hostId: "z",
      status: "LOBBY",
      roundNo: 0,
      currentRoundId: "",
      createdAt: serverTimestamp(),
    });
    batch.set(doc(db, "rooms/FGHJK/players/z"), {
      uid: "z",
      name: "Z",
      connected: true,
      joinedAt: serverTimestamp(),
    });
    await assertSucceeds(batch.commit());
    await assertFails(
      setDoc(doc(db, "rooms/ABCDE/players/z"), {
        uid: "z",
        name: "Z",
        connected: true,
        joinedAt: serverTimestamp(),
      }),
    );
  });
});
