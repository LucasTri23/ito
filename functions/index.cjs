const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { randomInt } = require("node:crypto");
const catalog = require("./catalog.cjs");
initializeApp();
const db = getFirestore();
const fail = (message) => { throw new HttpsError("failed-precondition", message); };
function roles(ids, history) {
  const pairs = [];
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = ids[i], b = ids[j], key = JSON.stringify([a, b]);
    const counts = [history.suspects[a] || 0, history.suspects[b] || 0].sort((x, y) => x - y);
    pairs.push({ a, b, key, counts, used: history.pairs[key] || 0 });
  }
  pairs.sort((a, b) => a.counts[1] - b.counts[1] || a.counts[0] - b.counts[0] || a.used - b.used || a.key.localeCompare(b.key));
  const p = pairs[0], rest = ids.filter(id => id !== p.a && id !== p.b);
  rest.sort((a, b) => (history.investigators[a] || 0) - (history.investigators[b] || 0) || a.localeCompare(b));
  const investigator = rest.shift() || null;
  for (const id of [p.a, p.b]) history.suspects[id] = (history.suspects[id] || 0) + 1;
  if (investigator) history.investigators[investigator] = (history.investigators[investigator] || 0) + 1;
  history.pairs[p.key] = (history.pairs[p.key] || 0) + 1;
  return { suspects: [p.a, p.b], investigator, jurors: rest };
}
function finish(s) {
  const values = Object.values(s.votes), colou = values.filter(v => v === "colou").length, furado = values.length - colou;
  s.result = { colou, furado, result: !values.length ? "sem-veredito" : colou === furado ? "empate" : colou > furado ? "colou" : "furado" };
  s.phase = "result"; s.deadline = null;
}
function projection(s) {
  const revealed = ["reveal", "vote", "result"].includes(s.phase);
  return { id: s.id, phase: s.phase, situation: s.situation, suspects: s.suspects, investigator: s.investigator, jurors: s.jurors,
    deadline: s.deadline, submitted: Object.keys(s.answers), voted: Object.keys(s.votes),
    questions: ["answers", "reveal", "vote", "result"].includes(s.phase) ? s.questions : [],
    answers: revealed ? s.answers : {}, result: s.result, remaining: catalog.length - s.used.length };
}
exports.alibiAction = onCall({ region: "us-central1" }, async req => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Entre novamente.");
  const uid = req.auth.uid, { code, action, roundId, value } = req.data || {};
  if (typeof code !== "string" || !/^[A-HJ-NP-Z2-9]{5}$/.test(code) || typeof action !== "string") throw new HttpsError("invalid-argument", "Pedido inválido.");
  const roomRef = db.doc(`alibiRooms/${code}`), memberRef = roomRef.collection("players").doc(uid), stateRef = roomRef.collection("private").doc("state"), inviteRef = db.doc(`alibiInvites/${code}`);
  return db.runTransaction(async tx => {
    const [roomSnap, memberSnap, stateSnap, inviteSnap] = await Promise.all([tx.get(roomRef), tx.get(memberRef), tx.get(stateRef), tx.get(inviteRef)]);
    if (!roomSnap.exists || !memberSnap.exists || !inviteSnap.exists) fail("Sala ou participante não encontrado.");
    const room = roomSnap.data(), now = Date.now(), host = room.hostId === uid;
    if (action === "clock") return { now };
    let s = stateSnap.exists ? stateSnap.data() : null;
    if (action === "newRound" || action === "newGame") {
      if (!host) fail("Somente o anfitrião inicia a rodada.");
      if (s && !["result", "cancelled"].includes(s.phase)) fail("Termine a rodada atual.");
      const players = await tx.get(roomRef.collection("players"));
      const ids = players.docs.map(d => d.id).sort();
      if (ids.length < 2 || ids.length > 8) fail("A sala precisa de 2 a 8 jogadores.");
      const used = action === "newGame" ? [] : s?.used || [], remaining = catalog.filter(x => !used.includes(x.id));
      if (!remaining.length) fail("Todas as situações foram usadas. Inicie uma nova partida.");
      const item = remaining[randomInt(remaining.length)];
      const history = action === "newGame" ? { suspects: {}, investigators: {}, pairs: {} } : s?.history || { suspects: {}, investigators: {}, pairs: {} };
      const assigned = roles(ids, history);
      s = { id: String((Number(s?.id) || 0) + 1), phase: "presentation", situation: item.situation, questions: item.questions, ...assigned,
        deadline: null, answers: {}, votes: {}, result: null, used: [...used, item.id], history };
      tx.update(inviteRef, { open: false });
    } else {
      if (!s || String(roundId) !== s.id) fail("A rodada mudou. Tente novamente.");
      if (![...s.suspects, ...s.jurors, ...(s.investigator ? [s.investigator] : [])].includes(uid)) fail("Você não participa desta rodada.");
      if (action === "preview") {
        if (s.phase !== "surprise" || uid !== s.investigator || now >= s.deadline) fail("Perguntas indisponíveis.");
        return { questions: s.questions.slice(0, 2) };
      }
      if (action === "myAnswer") return { answer: s.answers[uid] || null };
      if (action === "start") {
        if (!host || s.phase !== "presentation") fail("Ação não permitida.");
        s.phase = "timer"; s.deadline = now + 30000;
      } else if (action === "tick") {
        if (!s.deadline || now < s.deadline) return { ok: true };
        if (s.phase === "timer") {
          s.phase = s.investigator ? "surprise" : "answers";
          s.deadline = s.investigator ? s.deadline + 15000 : null;
          if (s.deadline && now >= s.deadline) { s.phase = "answers"; s.deadline = null; }
        } else if (s.phase === "surprise") { s.phase = "answers"; s.deadline = null; }
        else if (s.phase === "vote") finish(s);
        else return { ok: true };
      } else if (action === "question") {
        if (s.phase !== "surprise" || uid !== s.investigator || now >= s.deadline || typeof value !== "string" || value.length > 200) fail("Pergunta não permitida.");
        if (value.trim()) s.questions[2] = value.trim();
        s.phase = "answers"; s.deadline = null;
      } else if (action === "answer") {
        if (s.phase !== "answers" || !s.suspects.includes(uid) || s.answers[uid] || !Array.isArray(value) || value.length !== 3 || value.some(x => typeof x !== "string" || !x.trim() || x.length > 500)) fail("Resposta inválida ou já enviada.");
        s.answers[uid] = value.map(x => x.trim());
        if (s.suspects.every(id => s.answers[id])) s.phase = "reveal";
      } else if (action === "beginVote") {
        if (!host || s.phase !== "reveal") fail("Ação não permitida.");
        s.phase = "vote"; s.deadline = s.investigator ? now + 30000 : null;
      } else if (action === "vote") {
        const voters = s.jurors.length ? s.jurors : [s.investigator || room.hostId];
        if (s.phase !== "vote" || !voters.includes(uid) || s.votes[uid] || (s.deadline && now >= s.deadline) || !["colou", "furado"].includes(value)) fail("Voto não permitido.");
        s.votes[uid] = value;
        if (voters.every(id => s.votes[id])) finish(s);
      } else if (action === "skipVerdict") {
        if (!host || s.phase !== "vote" || s.investigator) fail("Ação não permitida.");
        finish(s);
      } else if (action === "cancel") {
        if (!host || ["result", "cancelled"].includes(s.phase)) fail("Ação não permitida.");
        s.phase = "cancelled"; s.deadline = null;
      } else fail("Ação desconhecida.");
      if (["result", "cancelled"].includes(s.phase)) tx.update(inviteRef, { open: true });
    }
    tx.set(stateRef, s);
    tx.update(roomRef, { phase: s.phase, round: projection(s) });
    return { ok: true };
  });
});
