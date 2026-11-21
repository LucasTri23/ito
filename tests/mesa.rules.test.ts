import { readFileSync, existsSync } from "node:fs";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, getDocs, collection, updateDoc, writeBatch, serverTimestamp, runTransaction } from "firebase/firestore";
type Firestore = ReturnType<ReturnType<RulesTestEnvironment["authenticatedContext"]>["firestore"]>;

/** Regras reais; enquanto o bloco das mesas não estiver no arquivo principal, injeta o arquivo separado. */
export function mesaRules() {
  const main = readFileSync("firestore.rules", "utf8");
  if (main.includes("match /mesas/{c}") || !existsSync("firestore.mesas.rules")) return main;
  const block = readFileSync("firestore.mesas.rules", "utf8");
  const end = main.lastIndexOf("}", main.lastIndexOf("}") - 1);
  return main.slice(0, end) + block + "\n " + main.slice(end);
}

const enabled = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
let seq = 0;
const nextCode = () => `M${"ABCDEFGHJK"[Math.floor(seq / 10) % 10]}${"ABCDEFGHJK"[seq++ % 10]}23`;

export async function createMesa(env: RulesTestEnvironment, code: string, game: string, host = "a") {
  const db = env.authenticatedContext(host).firestore();
  const b = writeBatch(db);
  b.set(doc(db, `mesas/${code}`), { code, game, hostId: host, phase: "lobby", gameNo: 1, roundNo: 0, currentRoundId: "", used: [] });
  b.set(doc(db, `mesaInvites/${code}`), { count: 1, game });
  b.set(doc(db, `mesas/${code}/players/${host}`), { uid: host, name: host, joinedAt: serverTimestamp(), connected: true, presenceAt: serverTimestamp() });
  await assertSucceeds(b.commit());
  return db;
}
export async function joinMesa(env: RulesTestEnvironment, code: string, uid: string) {
  const db = env.authenticatedContext(uid).firestore();
  await runTransaction(db, async (tx) => {
    const inv = await tx.get(doc(db, `mesaInvites/${code}`));
    tx.update(doc(db, `mesaInvites/${code}`), { count: inv.data()!.count + 1 });
    tx.set(doc(db, `mesas/${code}/players/${uid}`), { uid, name: uid, joinedAt: serverTimestamp(), connected: true, presenceAt: serverTimestamp() });
  });
  return db;
}
function startPlanB(db: Firestore, code: string, participants: string[], no = 1, used: string[] = []) {
  const id = `1-${no}`;
  const b = writeBatch(db);
  b.update(doc(db, `mesas/${code}`), { phase: "playing", roundNo: no, currentRoundId: id, used: [...used, "pb-01"] });
  b.set(doc(db, `mesas/${code}/rounds/${id}`), { id, game: "planb", no, missionId: "pb-01", phase: "choose", participants, confirmed: [], startedAt: serverTimestamp() });
  b.set(doc(db, `mesas/${code}/rounds/${id}/sealed/twist`), { twist: 2 });
  return b.commit();
}
function confirm(db: Firestore, code: string, uid: string, confirmed: string[], picks = [0, 3]) {
  const b = writeBatch(db);
  b.set(doc(db, `mesas/${code}/rounds/1-1/choices/${uid}`), { uid, picks });
  b.update(doc(db, `mesas/${code}/rounds/1-1`), { confirmed: [...confirmed, uid] });
  return b.commit();
}

describe.skipIf(!enabled)("Mesas (Plano B, Manual, Feira): regras", () => {
  let env: RulesTestEnvironment;
  beforeAll(async () => {
    env = await initializeTestEnvironment({ projectId: "demo-mesas", firestore: { rules: mesaRules() } });
  }, 30000);
  afterAll(async () => {
    await env?.cleanup();
  });

  it("sala: só membros leem, limite de 8, disputa pela última vaga e nono jogador", async () => {
    const code = nextCode();
    await createMesa(env, code, "planb");
    const out = env.authenticatedContext("zz").firestore();
    await assertFails(getDoc(doc(out, `mesas/${code}`)));
    await assertFails(getDocs(collection(out, `mesas/${code}/players`)));
    for (const uid of ["b", "c", "d", "e", "f", "g"]) await joinMesa(env, code, uid);
    const race = await Promise.allSettled(["h", "i"].map((uid) => joinMesa(env, code, uid)));
    expect(race.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    await expect(joinMesa(env, code, "j")).rejects.toBeTruthy();
    const inv = await getDoc(doc(env.authenticatedContext("a").firestore(), `mesaInvites/${code}`));
    expect(inv.data()?.count).toBe(8);
  });

  it("Plano B: imprevisto lacrado, escolha privada, única e revelação só quando todos confirmam", async () => {
    const code = nextCode();
    const a = await createMesa(env, code, "planb");
    const b = await joinMesa(env, code, "b");
    const c = await joinMesa(env, code, "c");
    await assertFails(startPlanB(b, code, ["a", "b", "c"])); // só o anfitrião
    await assertSucceeds(startPlanB(a, code, ["a", "b", "c"]));
    await assertFails(getDoc(doc(a, `mesas/${code}/rounds/1-1/sealed/twist`))); // nem o anfitrião lê
    await assertFails(joinMesa(env, code, "late")); // rodada em andamento
    await assertSucceeds(confirm(b, code, "b", []));
    await assertFails(confirm(b, code, "b", ["b"], [1, 2])); // não troca depois de confirmar
    await assertFails(getDoc(doc(a, `mesas/${code}/rounds/1-1/choices/b`))); // escolha alheia
    await assertSucceeds(getDoc(doc(b, `mesas/${code}/rounds/1-1/choices/b`)));
    await assertFails(confirm(c, code, "c", ["b"], [1, 1])); // itens repetidos
    await assertFails(updateDoc(doc(a, `mesas/${code}/rounds/1-1`), { phase: "reveal" })); // falta gente e há tempo
    await assertSucceeds(confirm(c, code, "c", ["b"]));
    await assertSucceeds(confirm(a, code, "a", ["b", "c"]));
    const reveal = writeBatch(b);
    reveal.update(doc(b, `mesas/${code}/rounds/1-1`), { phase: "reveal" });
    reveal.update(doc(b, `mesas/${code}`), { phase: "lobby" });
    await assertSucceeds(reveal.commit());
    expect((await getDoc(doc(c, `mesas/${code}/rounds/1-1/sealed/twist`))).data()?.twist).toBe(2);
    await assertSucceeds(getDocs(collection(c, `mesas/${code}/rounds/1-1/choices`)));
    const outsider = env.authenticatedContext("zz").firestore();
    await assertFails(getDoc(doc(outsider, `mesas/${code}/rounds/1-1/sealed/twist`)));
  });

  it("saída: jogador libera vaga; anfitrião passa o posto; com menos de 2 volta ao lobby", async () => {
    const code = nextCode();
    const a = await createMesa(env, code, "planb");
    const b = await joinMesa(env, code, "b");
    await joinMesa(env, code, "c");
    const leaveB = writeBatch(b);
    leaveB.update(doc(b, `mesaInvites/${code}`), { count: 2 });
    leaveB.delete(doc(b, `mesas/${code}/players/b`));
    await assertSucceeds(leaveB.commit());
    const bad = writeBatch(a); // passa o posto para quem não está na sala
    bad.update(doc(a, `mesaInvites/${code}`), { count: 1 });
    bad.update(doc(a, `mesas/${code}`), { hostId: "zz" });
    bad.delete(doc(a, `mesas/${code}/players/a`));
    await assertFails(bad.commit());
    const leaveA = writeBatch(a);
    leaveA.update(doc(a, `mesaInvites/${code}`), { count: 1 });
    leaveA.update(doc(a, `mesas/${code}`), { hostId: "c" });
    leaveA.delete(doc(a, `mesas/${code}/players/a`));
    await assertSucceeds(leaveA.commit());
    const c = env.authenticatedContext("c").firestore();
    expect((await getDoc(doc(c, `mesas/${code}`))).data()?.hostId).toBe("c");
  });

  it("Manual: bancada e pistas por equipe, sem peça duplicada, teste só do responsável e conferido pelo gabarito", async () => {
    const code = nextCode();
    const a = await createMesa(env, code, "manual");
    for (const uid of ["b", "c", "d"]) await joinMesa(env, code, uid);
    const base = `mesas/${code}/rounds/1-1`;
    const sol = ["p1", "p2", "p3", "p4"];
    const start = writeBatch(a);
    start.update(doc(a, `mesas/${code}`), { phase: "playing", roundNo: 1, currentRoundId: "1-1", used: ["md-01"] });
    start.set(doc(a, base), { id: "1-1", game: "manual", no: 1, challengeId: "md-01", phase: "build", teamA: ["a", "b"], teamB: ["c", "d"], size: 4, startedAt: serverTimestamp() });
    start.set(doc(a, `${base}/sealed/solution`), { solution: sol });
    for (const [t, members] of [["A", ["a", "b"]], ["B", ["c", "d"]]] as const)
      start.set(doc(a, `${base}/benches/${t}`), { team: t, members, slots: ["", "", "", ""], attempts: 0, status: "open", lastCorrect: -1, solvedAt: null, tester: members[0] });
    for (const [uid, team, clues] of [["a", "A", [0, 2]], ["b", "A", [1, 3]], ["c", "B", [0, 2]], ["d", "B", [1, 3]]] as const)
      start.set(doc(a, `${base}/clues/${uid}`), { uid, team, clues });
    await assertSucceeds(start.commit());
    const b = env.authenticatedContext("b").firestore();
    const c = env.authenticatedContext("c").firestore();
    await assertFails(getDoc(doc(b, `${base}/benches/B`))); // bancada da outra equipe
    await assertFails(getDoc(doc(b, `${base}/clues/a`))); // pista alheia
    await assertSucceeds(getDoc(doc(b, `${base}/clues/b`)));
    await assertFails(getDoc(doc(b, `${base}/sealed/solution`)));
    await assertFails(updateDoc(doc(c, `${base}/benches/A`), { slots: ["p1", "", "", ""] })); // outra equipe
    await assertFails(updateDoc(doc(b, `${base}/benches/A`), { slots: ["p1", "p1", "", ""] })); // peça duplicada
    await assertFails(updateDoc(doc(b, `${base}/benches/A`), { slots: ["zz", "", "", ""] })); // peça inexistente
    await assertSucceeds(updateDoc(doc(b, `${base}/benches/A`), { slots: ["p2", "p1", "p3", "p4"] }));
    const wrong = { attempts: 1, status: "open", lastCorrect: 2, solvedAt: null, tester: "b" };
    await assertFails(updateDoc(doc(b, `${base}/benches/A`), wrong)); // b não é o responsável
    await assertFails(updateDoc(doc(a, `${base}/benches/A`), { ...wrong, lastCorrect: 4 })); // resultado falso
    await assertFails(updateDoc(doc(a, `${base}/benches/A`), { ...wrong, status: "solved", solvedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(a, `${base}/benches/A`), wrong)); // 2 peças certas, de verdade
    await assertSucceeds(updateDoc(doc(b, `${base}/benches/A`), { slots: ["p1", "p2", "p3", "p4"] }));
    await assertFails(updateDoc(doc(a, `${base}/benches/A`), { attempts: 2, status: "solved", lastCorrect: 4, solvedAt: serverTimestamp(), tester: "a" })); // vez do b
    await assertSucceeds(updateDoc(doc(b, `${base}/benches/A`), { attempts: 2, status: "solved", lastCorrect: 4, solvedAt: serverTimestamp(), tester: "a" }));
    await assertFails(updateDoc(doc(b, `${base}/benches/A`), { slots: ["p2", "p1", "p3", "p4"] })); // bloqueada
    const finish = () => {
      const f = writeBatch(c);
      f.update(doc(c, base), { phase: "done" });
      f.update(doc(c, `mesas/${code}`), { phase: "lobby" });
      return f.commit();
    };
    await assertFails(finish()); // equipe B ainda montando e há tempo
    const d = env.authenticatedContext("d").firestore();
    await assertSucceeds(updateDoc(doc(d, `${base}/benches/B`), { slots: ["p4", "p3", "p2", "p1"] }));
    await assertSucceeds(updateDoc(doc(c, `${base}/benches/B`), { attempts: 1, status: "open", lastCorrect: 0, solvedAt: null, tester: "d" }));
    await assertSucceeds(updateDoc(doc(d, `${base}/benches/B`), { attempts: 2, status: "failed", lastCorrect: 0, solvedAt: null, tester: "c" }));
    await assertSucceeds(finish());
    await assertSucceeds(getDoc(doc(b, `${base}/benches/B`)));
    await assertSucceeds(getDoc(doc(b, `${base}/sealed/solution`)));
  });

  it("Feira online: autor oculto, sem voto na própria invenção, voto único e autores só no resultado", async () => {
    const code = nextCode();
    const a = await createMesa(env, code, "feira");
    for (const uid of ["b", "c", "d"]) await joinMesa(env, code, uid);
    const base = `mesas/${code}/rounds/1-1`;
    const start = writeBatch(a);
    start.update(doc(a, `mesas/${code}`), { phase: "playing", roundNo: 1, currentRoundId: "1-1", used: ["fi-01"] });
    start.set(doc(a, base), { id: "1-1", game: "feira", no: 1, mode: "online", problemId: "fi-01", phase: "create", inventors: ["a", "b", "c", "d"], voters: ["a", "b", "c", "d"], submitted: [], voted: [], startedAt: serverTimestamp(), voteAt: null });
    for (const uid of ["a", "b", "c", "d"]) start.set(doc(a, `${base}/materials/${uid}`), { uid, materialId: `m-${uid}` });
    await assertSucceeds(start.commit());
    const dbs = Object.fromEntries(["a", "b", "c", "d"].map((u) => [u, env.authenticatedContext(u).firestore()]));
    await assertFails(getDoc(doc(dbs.b, `${base}/materials/a`)));
    await assertSucceeds(getDoc(doc(dbs.b, `${base}/materials/b`)));
    const submit = (uid: string, anon: string, submitted: string[]) => {
      const db = dbs[uid];
      const bt = writeBatch(db);
      bt.set(doc(db, `${base}/entries/${anon}`), { anon, name: `Invento ${uid}`, how: "Funciona assim.", slogan: "Compre já!" });
      bt.set(doc(db, `${base}/authors/${anon}`), { anon, uid });
      bt.set(doc(db, `${base}/authorOf/${uid}`), { uid, anon });
      bt.update(doc(db, base), { submitted: [...submitted, uid] });
      return bt.commit();
    };
    await assertSucceeds(submit("a", "xa", []));
    await assertFails(submit("a", "xa2", ["a"])); // segunda invenção
    await assertFails(getDoc(doc(dbs.b, `${base}/entries/xa`))); // antes da votação
    await assertSucceeds(submit("b", "xb", ["a"]));
    await assertSucceeds(submit("c", "xc", ["a", "b"]));
    await assertSucceeds(submit("d", "xd", ["a", "b", "c"]));
    await assertSucceeds(updateDoc(doc(dbs.c, base), { phase: "vote", voteAt: serverTimestamp() }));
    await assertSucceeds(getDocs(collection(dbs.b, `${base}/entries`)));
    await assertFails(getDoc(doc(dbs.b, `${base}/authors/xa`))); // autor oculto na votação
    const vote = (uid: string, target: string, voted: string[]) => {
      const db = dbs[uid];
      const bt = writeBatch(db);
      bt.set(doc(db, `${base}/votes/${uid}`), { uid, target });
      bt.update(doc(db, base), { voted: [...voted, uid] });
      return bt.commit();
    };
    await assertFails(vote("a", "xa", [])); // própria invenção
    await assertSucceeds(vote("a", "xb", []));
    await assertFails(vote("a", "xc", ["a"])); // segundo voto
    await assertFails(getDoc(doc(dbs.b, `${base}/votes/a`)));
    await assertFails(updateDoc(doc(dbs.b, base), { phase: "result" })); // faltam votos e há tempo
    await assertSucceeds(vote("b", "xa", ["a"]));
    await assertSucceeds(vote("c", "xb", ["a", "b"]));
    await assertSucceeds(vote("d", "xb", ["a", "b", "c"]));
    const fin = writeBatch(dbs.d);
    fin.update(doc(dbs.d, base), { phase: "result" });
    fin.update(doc(dbs.d, `mesas/${code}`), { phase: "lobby" });
    await assertSucceeds(fin.commit());
    expect((await getDoc(doc(dbs.b, `${base}/authors/xb`))).data()?.uid).toBe("b");
    await assertSucceeds(getDocs(collection(dbs.b, `${base}/votes`)));
    await assertSucceeds(getDocs(collection(dbs.b, `${base}/materials`)));
  });

  it("Feira presencial: só a plateia vota, uma vez por produto; só o anfitrião abre a votação", async () => {
    const code = nextCode();
    const a = await createMesa(env, code, "feira");
    for (const uid of ["b", "c", "d", "e"]) await joinMesa(env, code, uid);
    await assertSucceeds(updateDoc(doc(a, `mesas/${code}`), { mode: "presencial", inventors: 2 }));
    const base = `mesas/${code}/rounds/1-1`;
    const start = writeBatch(a);
    start.update(doc(a, `mesas/${code}`), { phase: "playing", roundNo: 1, currentRoundId: "1-1", used: ["fi-02"] });
    start.set(doc(a, base), { id: "1-1", game: "feira", no: 1, mode: "presencial", problemId: "fi-02", phase: "prep", inventors: ["a", "b"], audience: ["c", "d", "e"], current: 0, pvoted: [], startedAt: serverTimestamp(), voteAt: null });
    start.set(doc(a, `${base}/materials/a`), { uid: "a", materialId: "m1" });
    start.set(doc(a, `${base}/materials/b`), { uid: "b", materialId: "m2" });
    await assertSucceeds(start.commit());
    await assertFails(updateDoc(doc(a, `mesas/${code}`), { inventors: 3 })); // modo fixo depois de começar
    const c = env.authenticatedContext("c").firestore();
    await assertFails(updateDoc(doc(c, base), { phase: "present", current: 0 })); // preparação ainda correndo
    // Simula o fim da preparação: o anfitrião pula para a apresentação só depois do prazo; aqui testamos a votação.
    await env.withSecurityRulesDisabled(async (ctx) => {
      await updateDoc(doc(ctx.firestore(), base), { phase: "present" });
    });
    await assertFails(updateDoc(doc(c, base), { phase: "vote", voteAt: serverTimestamp(), pvoted: [] })); // só o anfitrião
    await assertSucceeds(updateDoc(doc(a, base), { phase: "vote", voteAt: serverTimestamp(), pvoted: [] }));
    const pvote = (uid: string, voted: string[], buy = true, inventor = "a") => {
      const db = env.authenticatedContext(uid).firestore();
      const bt = writeBatch(db);
      bt.set(doc(db, `${base}/pvotes/${inventor}_${uid}`), { inventor, voter: uid, buy });
      bt.update(doc(db, base), { pvoted: [...voted, uid] });
      return bt.commit();
    };
    await assertFails(pvote("b", [])); // inventor não vota
    await assertFails(pvote("c", [], true, "b")); // produto que não está em votação
    await assertSucceeds(pvote("c", []));
    await assertFails(pvote("c", ["c"], false)); // segundo voto
    await assertFails(getDoc(doc(c, `${base}/pvotes/a_c`))); // escondido até o resultado
    await assertSucceeds(pvote("d", ["c"], false));
    await assertSucceeds(pvote("e", ["c", "d"]));
    await assertSucceeds(updateDoc(doc(c, base), { phase: "present", current: 1, pvoted: [] })); // todos votaram
  });

  it("anfitrião: ninguém assume enquanto o anfitrião está conectado", async () => {
    const code = nextCode();
    await createMesa(env, code, "planb");
    const b = await joinMesa(env, code, "b");
    await assertFails(updateDoc(doc(b, `mesas/${code}`), { hostId: "b" }));
    await assertFails(updateDoc(doc(b, `mesas/${code}/players/a`), { connected: false, presenceAt: serverTimestamp() }));
  });
});
