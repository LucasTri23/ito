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
  deleteDoc,
  deleteField,
  Timestamp,
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
  }, 30000);
  afterAll(async () => {
    await env?.cleanup();
  });
  it("Anúncios bíblicos: sala privada limita vagas e seleção de vendedores", async () => {
    const host = env.authenticatedContext("a").firestore();
    const outsider = env.authenticatedContext("z").firestore();
    const batch = writeBatch(host);
    batch.set(doc(host, "adsRooms/BCDFG"), { code: "BCDFG", hostId: "a", phase: "lobby", mode: "presencial", sellerCount: 2 });
    batch.set(doc(host, "adsInvites/BCDFG"), { count: 1, open: true });
    batch.set(doc(host, "adsRooms/BCDFG/players/a"), { uid: "a", name: "Ana", joinedAt: serverTimestamp() });
    await assertSucceeds(batch.commit());
    await assertFails(getDoc(doc(outsider, "adsRooms/BCDFG")));
    await assertFails(getDocs(collection(outsider, "adsRooms/BCDFG/players")));
    await assertFails(updateDoc(doc(host, "adsRooms/BCDFG"), { sellerCount: 3 }));
    for (const [index, uid] of ["b", "c", "d", "e", "f", "g"].entries()) {
      const db = env.authenticatedContext(uid).firestore();
      const join = writeBatch(db);
      join.update(doc(db, "adsInvites/BCDFG"), { count: index + 2 });
      join.set(doc(db, `adsRooms/BCDFG/players/${uid}`), { uid, name: uid, joinedAt: serverTimestamp() });
      await assertSucceeds(join.commit());
    }
    await assertSucceeds(updateDoc(doc(host, "adsRooms/BCDFG"), { sellerCount: 3 }));
    const guest = env.authenticatedContext("b").firestore();
    await assertFails(updateDoc(doc(guest, "adsRooms/BCDFG"), { sellerCount: 2 }));
    const compete = async (uid: string) => {
      const db = env.authenticatedContext(uid).firestore();
      return runTransaction(db, async tx => {
        const invite = doc(db, "adsInvites/BCDFG"), snapshot = await tx.get(invite);
        tx.update(invite, { count: snapshot.data()!.count + 1 });
        tx.set(doc(db, `adsRooms/BCDFG/players/${uid}`), { uid, name: uid, joinedAt: serverTimestamp() });
      });
    };
    const result = await Promise.allSettled([compete("h"), compete("i")]);
    expect(result.filter(entry => entry.status === "fulfilled")).toHaveLength(1);
    const ninth = writeBatch(outsider);
    ninth.update(doc(outsider, "adsInvites/BCDFG"), { count: 9 });
    ninth.set(doc(outsider, "adsRooms/BCDFG/players/z"), { uid: "z", name: "Z", joinedAt: serverTimestamp() });
    await assertFails(ninth.commit());
  }, 30000);
  it("Anúncios bíblicos: estilo é privado e não pode ser repetido", async () => {
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      await setDoc(doc(db, "adsRooms/BCDFG"), { hostId: "a", phase: "playing", currentRoundId: "1" });
      for (const uid of ["a", "b", "c"]) await setDoc(doc(db, `adsRooms/BCDFG/players/${uid}`), { uid });
      await setDoc(doc(db, "adsRooms/BCDFG/rounds/1"), { phase: "preparation", authors: ["a", "b"] });
    });
    const a = env.authenticatedContext("a").firestore(), b = env.authenticatedContext("b").firestore(), c = env.authenticatedContext("c").firestore();
    const path = "adsRooms/BCDFG/rounds/1";
    const first = writeBatch(b);
    first.set(doc(b, `${path}/styles/b`), { uid: "b", style: 0 });
    first.set(doc(b, `${path}/styleSlots/0`), { uid: "b", style: 0 });
    await assertSucceeds(first.commit());
    await assertSucceeds(getDoc(doc(b, `${path}/styles/b`)));
    await assertFails(getDoc(doc(a, `${path}/styles/b`)));
    await assertFails(getDoc(doc(c, `${path}/styles/b`)));
    await assertFails(getDocs(collection(a, `${path}/styles`)));
    await assertFails(getDoc(doc(a, `${path}/styleSlots/0`)));
    const duplicate = writeBatch(a);
    duplicate.set(doc(a, `${path}/styles/a`), { uid: "a", style: 0 });
    duplicate.set(doc(a, `${path}/styleSlots/0`), { uid: "a", style: 0 });
    await assertFails(duplicate.commit());
    const second = writeBatch(a);
    second.set(doc(a, `${path}/styles/a`), { uid: "a", style: 1 });
    second.set(doc(a, `${path}/styleSlots/1`), { uid: "a", style: 1 });
    await assertSucceeds(second.commit());
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), path), { phase: "result" }));
    expect((await assertSucceeds(getDocs(collection(c, `${path}/styles`)))).size).toBe(2);
  }, 30000);
  it("Anúncios bíblicos: textos e autores ficam privados e não há voto próprio", async () => {
    const path = "adsRooms/BCDFG/rounds/1", adA = "AAAAAAAAAAAAAAAAAAAA", adB = "BBBBBBBBBBBBBBBBBBBB";
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      await setDoc(doc(db, "adsRooms/BCDFG"), { hostId: "a", phase: "playing", currentRoundId: "1" });
      for (const uid of ["a", "b", "c"]) await setDoc(doc(db, `adsRooms/BCDFG/players/${uid}`), { uid });
      await setDoc(doc(db, path), { phase: "creation", mode: "online", authors: ["a", "b"], voters: ["a", "b", "c"], startedAt: new Date() });
    });
    const a = env.authenticatedContext("a").firestore(), b = env.authenticatedContext("b").firestore(), c = env.authenticatedContext("c").firestore();
    for (const [db, uid, adId] of [[a, "a", adA], [b, "b", adB]] as const) {
      const batch = writeBatch(db);
      batch.set(doc(db, `${path}/authorIndex/${uid}`), { uid, adId });
      batch.set(doc(db, `${path}/ads/${adId}`), { id: adId, title: "Um título", description: "Uma descrição" });
      await assertSucceeds(batch.commit());
    }
    await assertFails(getDoc(doc(a, `${path}/ads/${adB}`)));
    await assertFails(getDoc(doc(a, `${path}/authorIndex/b`)));
    await assertFails(getDocs(collection(c, `${path}/ads`)));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), path), { phase: "vote", validAdIds: [adA, adB], voteStartedAt: new Date() }));
    const anonymous = await assertSucceeds(getDocs(collection(c, `${path}/ads`)));
    expect(anonymous.docs.every(entry => !Object.hasOwn(entry.data(), "uid"))).toBe(true);
    await assertFails(getDocs(collection(c, `${path}/authorIndex`)));
    await assertFails(setDoc(doc(a, `${path}/writtenVotes/a`), { uid: "a", adId: adA }));
    await assertSucceeds(setDoc(doc(a, `${path}/writtenVotes/a`), { uid: "a", adId: adB }));
    await assertFails(setDoc(doc(a, `${path}/writtenVotes/a`), { uid: "a", adId: adB }));
    await assertFails(getDoc(doc(b, `${path}/writtenVotes/a`)));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), path), { phase: "result" }));
    expect((await assertSucceeds(getDocs(collection(c, `${path}/authorIndex`)))).size).toBe(2);
  }, 30000);
  it("Anúncios bíblicos: plateia vota uma vez por apresentação, vendedores não votam", async () => {
    const path = "adsRooms/BCDFG/rounds/1";
    await env.withSecurityRulesDisabled(async ctx => {
      const db = ctx.firestore();
      await setDoc(doc(db, "adsRooms/BCDFG"), { hostId: "a", phase: "playing", currentRoundId: "1" });
      for (const uid of ["a", "b", "c"]) await setDoc(doc(db, `adsRooms/BCDFG/players/${uid}`), { uid });
      await setDoc(doc(db, path), { phase: "vote", mode: "presencial", authors: ["a", "b"], audience: ["c"], presentationIndex: 0, voteStartedAt: new Date() });
    });
    const a = env.authenticatedContext("a").firestore(), c = env.authenticatedContext("c").firestore();
    await assertFails(setDoc(doc(a, `${path}/presentationVotes/0_a`), { uid: "a", presentation: 0, choice: "compro" }));
    await assertSucceeds(setDoc(doc(c, `${path}/presentationVotes/0_c`), { uid: "c", presentation: 0, choice: "compro" }));
    await assertFails(setDoc(doc(c, `${path}/presentationVotes/0_c`), { uid: "c", presentation: 0, choice: "nao-compro" }));
    await assertFails(getDoc(doc(a, `${path}/presentationVotes/0_c`)));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), path), { presentationIndex: 1, voteStartedAt: new Date() }));
    await assertSucceeds(setDoc(doc(c, `${path}/presentationVotes/1_c`), { uid: "c", presentation: 1, choice: "compro" }));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), path), { presentationIndex: 2, voteStartedAt: new Date(Date.now() - 21000) }));
    await assertFails(setDoc(doc(c, `${path}/presentationVotes/2_c`), { uid: "c", presentation: 2, choice: "compro" }));
    await env.withSecurityRulesDisabled(async ctx => updateDoc(doc(ctx.firestore(), path), { phase: "result" }));
    expect((await assertSucceeds(getDocs(collection(a, `${path}/presentationVotes`)))).size).toBe(2);
  }, 30000);
  it("cria sala presencial com modo fixo", async () => {
    const db = env.authenticatedContext("a").firestore();
    const batch = writeBatch(db);
    batch.set(doc(db, "alibiRooms/FGHJK"), { code: "FGHJK", hostId: "a", phase: "lobby", mode: "presencial" });
    batch.set(doc(db, "alibiInvites/FGHJK"), { count: 1, open: true });
    batch.set(doc(db, "alibiRooms/FGHJK/players/a"), { uid: "a", name: "Ana", joinedAt: serverTimestamp() });
    await assertSucceeds(batch.commit());
    await assertFails(updateDoc(doc(db, "alibiRooms/FGHJK"), { mode: "online" }));
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
  describe("Entrelinhas: saída voluntária e transferência de anfitrião", () => {
    const room = "rooms/ABCDE";
    const as = (uid: string) => env.authenticatedContext(uid).firestore();
    const setHost = (data: Record<string, unknown>) =>
      env.withSecurityRulesDisabled(async (c) => {
        await updateDoc(doc(c.firestore(), `${room}/players/a`), data);
      });
    const minutesAgo = (m: number) => Timestamp.fromMillis(Date.now() - m * 60_000);
    it("jogador sai por conta própria, mas não remove outros", async () => {
      await assertFails(deleteDoc(doc(as("c"), `${room}/players/d`)));
      await assertSucceeds(deleteDoc(doc(as("b"), `${room}/players/b`)));
      await assertFails(getDoc(doc(as("b"), path)));
      await assertFails(getDocs(collection(as("b"), `${room}/players`)));
      // O anfitrião não pode simplesmente sumir sem passar o posto.
      await assertFails(deleteDoc(doc(as("a"), `${room}/players/a`)));
    });
    it("anfitrião sai e passa o posto a outro membro no mesmo commit", async () => {
      const a = as("a");
      await assertFails(updateDoc(doc(a, room), { hostId: "b" }));
      const stranger = writeBatch(a);
      stranger.update(doc(a, room), { hostId: "x" });
      stranger.delete(doc(a, `${room}/players/a`));
      await assertFails(stranger.commit());
      const sneaky = writeBatch(a);
      sneaky.update(doc(a, room), { hostId: "b", roundNo: 9 });
      sneaky.delete(doc(a, `${room}/players/a`));
      await assertFails(sneaky.commit());
      const leave = writeBatch(a);
      leave.update(doc(a, room), { hostId: "b" });
      leave.delete(doc(a, `${room}/players/a`));
      await assertSucceeds(leave.commit());
      const b = as("b");
      expect((await getDoc(doc(b, room))).data()?.hostId).toBe("b");
      await assertFails(updateDoc(doc(as("c"), room), { status: "LOBBY", currentRoundId: "" }));
      await assertSucceeds(updateDoc(doc(b, room), { status: "LOBBY", currentRoundId: "" }));
    });
    it("último anfitrião a sair encerra a sala; menos de 2 jogadores volta ao lobby", async () => {
      await env.withSecurityRulesDisabled(async (c) => {
        for (const uid of ["c", "d"]) await deleteDoc(doc(c.firestore(), `${room}/players/${uid}`));
      });
      const a = as("a");
      const toLobby = writeBatch(a);
      toLobby.update(doc(a, room), { hostId: "b", status: "LOBBY", currentRoundId: "" });
      toLobby.delete(doc(a, `${room}/players/a`));
      await assertSucceeds(toLobby.commit());
      const b = as("b");
      const last = writeBatch(b);
      last.update(doc(b, room), { status: "CLOSED" });
      last.delete(doc(b, `${room}/players/b`));
      await assertSucceeds(last.commit());
    });
    it("presença registra horário do servidor", async () => {
      const b = as("b");
      await assertSucceeds(updateDoc(doc(b, `${room}/players/b`), { connected: false, presenceAt: serverTimestamp() }));
      await assertFails(updateDoc(doc(b, `${room}/players/b`), { connected: false, presenceAt: minutesAgo(30) }));
    });
    it("anfitrião desconectado há pouco tempo (ou sem horário) não pode ser substituído", async () => {
      await setHost({ connected: false, presenceAt: minutesAgo(1) });
      await assertFails(updateDoc(doc(as("b"), room), { hostId: "b" }));
      await setHost({ connected: true, presenceAt: minutesAgo(60) });
      await assertFails(updateDoc(doc(as("b"), room), { hostId: "b" }));
      await setHost({ connected: false, presenceAt: deleteField() });
      await assertFails(updateDoc(doc(as("b"), room), { hostId: "b" }));
    });
    it("não-membro e membro em nome de outro não assumem", async () => {
      await setHost({ connected: false, presenceAt: minutesAgo(10) });
      await assertFails(updateDoc(doc(as("x"), room), { hostId: "x" }));
      await assertFails(updateDoc(doc(as("b"), room), { hostId: "c" }));
      await env.withSecurityRulesDisabled(async (c) => {
        await updateDoc(doc(c.firestore(), `${room}/players/b`), { connected: false });
      });
      await assertFails(updateDoc(doc(as("b"), room), { hostId: "b" }));
    });
    it("dois candidatos tentam assumir: apenas um vira anfitrião", async () => {
      await setHost({ connected: false, presenceAt: minutesAgo(10) });
      const claim = (uid: string) => {
        const db = as(uid);
        return runTransaction(db, async (tx) => {
          const ref = doc(db, room);
          const current = (await tx.get(ref)).data()!;
          if (current.hostId !== "a") throw new Error("já transferido");
          tx.update(ref, { hostId: uid });
        });
      };
      const results = await Promise.allSettled([claim("b"), claim("c")]);
      expect(results.filter((x) => x.status === "fulfilled")).toHaveLength(1);
      const winner = (await getDoc(doc(as("d"), room))).data()?.hostId;
      expect(["b", "c"]).toContain(winner);
      // Sem transação, um terceiro também é barrado: o novo anfitrião está conectado.
      await assertFails(updateDoc(doc(as("d"), room), { hostId: "d" }));
    });
    it("anfitrião pode pular quem saiu durante a apresentação", async () => {
      await env.withSecurityRulesDisabled(async (c) => {
        await updateDoc(doc(c.firestore(), path), { state: "PRESENTING", presentationOrder: ["b", "a", "c", "d"] });
      });
      await assertSucceeds(deleteDoc(doc(as("b"), `${room}/players/b`)));
      const skip = { playerId: "b", playerName: "Jogador que saiu", answer: "Sem pista — jogador pulado", skipped: true };
      await assertFails(setDoc(doc(as("c"), `${path}/answers/b`), skip));
      await assertFails(setDoc(doc(as("a"), `${path}/answers/b`), { ...skip, playerName: "Outro" }));
      await assertSucceeds(setDoc(doc(as("a"), `${path}/answers/b`), skip));
    });
  });
});
