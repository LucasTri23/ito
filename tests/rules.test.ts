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
