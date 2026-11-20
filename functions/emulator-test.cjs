const assert = require("node:assert/strict");
const { initializeApp, deleteApp } = require("firebase/app");
const { getAuth, connectAuthEmulator, signInAnonymously, inMemoryPersistence, setPersistence } = require("firebase/auth");
const { getFirestore, connectFirestoreEmulator, doc, getDoc, writeBatch, serverTimestamp } = require("firebase/firestore");
const { getFunctions, connectFunctionsEmulator, httpsCallable } = require("firebase/functions");
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "demo-entrelinhas" });
const server = admin.firestore();
const cfg = { apiKey: "demo-key", projectId: "demo-entrelinhas", appId: "demo-app" };
async function client(n) {
  const app = initializeApp(cfg, `client-${n}`), auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  await setPersistence(auth, inMemoryPersistence);
  const uid = (await signInAnonymously(auth)).user.uid;
  const db = getFirestore(app); connectFirestoreEmulator(db, "127.0.0.1", 8080);
  const fn = getFunctions(app, "us-central1"); connectFunctionsEmulator(fn, "127.0.0.1", 5001);
  return { app, uid, db, action: httpsCallable(fn, "alibiAction") };
}
async function play(code, n, clients) {
  const group = clients.slice(0, n), host = group[0], invite = `alibiInvites/${code}`, room = `alibiRooms/${code}`;
  const first = writeBatch(host.db);
  first.set(doc(host.db, room), { code, hostId: host.uid, phase: "lobby" });
  first.set(doc(host.db, invite), { count: 1, open: true });
  first.set(doc(host.db, `${room}/players/${host.uid}`), { uid: host.uid, name: "Anfitrião", joinedAt: serverTimestamp() });
  await first.commit();
  for (const [i, player] of group.slice(1).entries()) {
    const batch = writeBatch(player.db);
    batch.update(doc(player.db, invite), { count: i + 2 });
    batch.set(doc(player.db, `${room}/players/${player.uid}`), { uid: player.uid, name: `Jogador ${i}`, joinedAt: serverTimestamp() });
    await batch.commit();
  }
  const act = (p, action, value) => p.action({ code, roundId: "1", action, value });
  await act(host, "newRound");
  let data = (await getDoc(doc(host.db, room))).data().round;
  assert.equal(data.questions.length, 0);
  await assert.rejects(getDoc(doc(group[1].db, `${room}/private/state`)));
  await act(host, "start");
  await server.doc(`${room}/private/state`).update({ deadline: Date.now() - 1 });
  await act(group[1], "tick");
  data = (await getDoc(doc(host.db, room))).data().round;
  if (n > 2) {
    const investigator = group.find(p => p.uid === data.investigator);
    const preview = await act(investigator, "preview"); assert.equal(preview.data.questions.length, 2);
    await act(investigator, "question", "Qual era a cor?");
  }
  data = (await getDoc(doc(host.db, room))).data().round;
  assert.equal(data.phase, "answers");
  const [a, b] = data.suspects.map(id => group.find(p => p.uid === id));
  await act(a, "answer", ["primeiro segredo", "resposta", "resposta"]);
  data = (await getDoc(doc(b.db, room))).data().round;
  assert.deepEqual(data.answers, {});
  await assert.rejects(act(a, "answer", ["alterada", "x", "x"]));
  await act(b, "answer", ["outro segredo", "resposta", "resposta"]);
  data = (await getDoc(doc(host.db, room))).data().round;
  assert.equal(data.phase, "reveal");
  assert.equal(data.answers[a.uid][0], "primeiro segredo");
  await act(host, "beginVote");
  const voters = data.jurors.length ? data.jurors : [data.investigator || host.uid];
  if (!voters.includes(a.uid)) await assert.rejects(act(a, "vote", "colou"));
  for (const id of voters) await act(group.find(p => p.uid === id), "vote", "colou");
  data = (await getDoc(doc(host.db, room))).data().round;
  assert.equal(data.phase, "result"); assert.equal(data.result.result, "colou");
  await assert.rejects(host.action({ code, roundId: "0", action: "start" }));
  console.log(`${n} jogadores: rodada concluída`);
}
async function main() {
  const clients = await Promise.all(Array.from({ length: 8 }, (_, i) => client(i)));
  try {
    for (const [code, n] of [["ABCDE", 2], ["FGHJK", 3], ["LMNPQ", 5], ["RSTUV", 8]]) await play(code, n, clients);
  } finally { await Promise.all(clients.map(c => deleteApp(c.app))); await admin.app().delete(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
