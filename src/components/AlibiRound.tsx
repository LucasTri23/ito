import { useEffect, useRef, useState } from "react";
import { collection, doc, getDocFromServer, onSnapshot, serverTimestamp, setDoc, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { alibiAction, situations, type AlibiRoundData } from "../services/alibi";
import { compareAlibiAnswers, tallyAlibiVotes } from "../utils/alibi";
import { Notice } from "./UI";
import { burst } from "../utils/fx";
import { errorText } from "../utils/game";

type Props = { code: string; uid: string; hostId: string; round: AlibiRoundData | null; players: { uid: string; name: string }[] };

export function AlibiRound({ code, uid, hostId, round, players }: Props) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [answers, setAnswers] = useState(["", "", ""]);
  const [question, setQuestion] = useState("");
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, string[]>>({});
  const [votes, setVotes] = useState<Array<"colou" | "furado">>([]);
  const [votesReady, setVotesReady] = useState(false);
  const [tickBusy, setTickBusy] = useState(false);
  const [offset, setOffset] = useState(0);
  const nextTick = useRef(0);
  const roundId = round?.id;
  const phase = round?.phase;
  const deadline = phase === "timer" ? (round?.startedAt?.toMillis() ?? 0) + 30000 : phase === "surprise" ? (round?.surpriseAt?.toMillis() ?? 0) + 15000 : phase === "vote" && round?.investigator ? (round.voteStartedAt?.toMillis() ?? 0) + 30000 : 0;
  const host = uid === hostId;
  const name = (id: string) => players.find(p => p.uid === id)?.name || "Jogador";
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { setAnswers(["", "", ""]); setQuestion(""); setRevealedAnswers({}); setVotes([]); setVotesReady(false); }, [roundId]);
  useEffect(() => {
    let active = true;
    async function syncClock() {
      if (document.visibilityState === "hidden") return;
      const ref = doc(db, `alibiRooms/${code}/clock/${uid}`), start = Date.now();
      try {
        await setDoc(ref, { at: serverTimestamp() });
        const snapshot = await getDocFromServer(ref);
        const at = snapshot.data()?.at as Timestamp | undefined;
        if (active && at) setOffset(at.toMillis() - (start + Date.now()) / 2);
      } catch { /* Rules remain the authority if clock synchronization fails. */ }
    }
    void syncClock();
    const interval = window.setInterval(() => void syncClock(), 60000);
    document.addEventListener("visibilitychange", syncClock);
    return () => { active = false; window.clearInterval(interval); document.removeEventListener("visibilitychange", syncClock); };
  }, [code, uid]);
  useEffect(() => {
    if (!roundId || !phase || !["reveal", "vote", "result"].includes(phase)) return;
    return onSnapshot(collection(db, `alibiRooms/${code}/rounds/${roundId}/answers`), s => setRevealedAnswers(Object.fromEntries(s.docs.map(d => [d.id, d.data().values as string[]]))), e => setError(e.message));
  }, [code, roundId, phase]);
  useEffect(() => {
    if (!roundId || phase !== "result") return;
    return onSnapshot(collection(db, `alibiRooms/${code}/rounds/${roundId}/votes`), s => { setVotes(s.docs.map(d => d.data().choice as "colou" | "furado")); setVotesReady(true); }, e => setError(e.message));
  }, [code, roundId, phase]);
  useEffect(() => {
    const due = (phase === "timer" || phase === "surprise") ? !!deadline && now + offset >= deadline
      : phase === "answers" ? round?.submitted.length === 2
      : phase === "vote" ? (!!round?.investigator && (round.voted.length >= (round.jurors.length || 1) || (!!deadline && now + offset >= deadline))) || (!round?.investigator && host && !!round?.voted.includes(uid))
      : false;
    if (!roundId || !due || tickBusy || now < nextTick.current) return;
    nextTick.current = now + 2000;
    setTickBusy(true);
    void alibiAction(code, uid, "tick", roundId, undefined, []).catch(() => {}).finally(() => setTickBusy(false));
  }, [code, uid, roundId, round, phase, now, offset, deadline, host, tickBusy]);
  async function send(action: string, value?: unknown) {
    setBusy(true); setError("");
    try { await alibiAction(code, uid, action, round?.id, value, players.map(p => p.uid)); }
    catch (e) { setError(errorText(e)); }
    finally { setBusy(false); }
  }
  // Confete quando o álibi cola; o carimbo do resultado é o alvo.
  const stampRef = useRef<HTMLDivElement>(null);
  const tally = tallyAlibiVotes(votes);
  useEffect(() => {
    if (phase === "result" && votesReady && tally.result === "colou") burst(stampRef.current, 40);
    // Só dispara quando o resultado chega.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, votesReady]);
  const button = (label: string, action: string, value?: unknown, kind = "primary", disabled = false) => <button disabled={busy || disabled} className={`button ${kind}`} onClick={() => void send(action, value)}>{label}</button>;
  const who = (id: string) => {
    const index = Math.max(0, players.findIndex(p => p.uid === id));
    return <span className={`alibi-who${id === uid ? " is-me" : ""}`} key={id}>
      <span className={`avatar avatar-${index % 4}`} aria-hidden="true">{name(id).trim().charAt(0).toUpperCase()}</span>
      {name(id)}{id === uid ? " (você)" : ""}
    </span>;
  };
  if (!round || round.phase === "cancelled") return <div className="alibi-round alibi-idle">
    <span className="alibi-idle-icon" aria-hidden="true">🕵️</span>
    <h3>{round?.phase === "cancelled" ? "A rodada foi cancelada" : players.length < 2 ? `Falta${2 - players.length > 1 ? "m" : ""} ${2 - players.length} pessoa${2 - players.length > 1 ? "s" : ""} para começar` : "Tudo pronto para a primeira rodada"}</h3>
    <p>Reúna de 2 a 8 pessoas para iniciar.</p>
    {host ? button("Iniciar rodada", "newRound", undefined, "primary", players.length < 2) : <p className="alibi-wait">Aguardando o anfitrião<span className="dots" aria-hidden="true"><i /><i /><i /></span></p>}
    {error && <Notice>{error}</Notice>}
  </div>;
  const suspect = round.suspects.includes(uid), investigator = uid === round.investigator, juror = round.jurors.includes(uid);
  const remaining = deadline ? Math.max(0, Math.ceil((deadline - now - offset) / 1000)) : 0;
  const item = situations.find(x => x.id === round.catalogId);
  const questions = item ? [item.questions[0], item.questions[1], round.customQuestion || item.questions[2]] : [];
  const comparisons = questions.map((_, i) => compareAlibiAnswers(revealedAnswers[round.suspects[0]]?.[i], revealedAnswers[round.suspects[1]]?.[i]));
  const compared = questions.length === 3 && comparisons.every(value => value !== "aguardando");
  const matching = comparisons.filter(value => value === "igual").length;
  const result = tally;
  const steps = ["presentation", "timer", ...(round.investigator ? ["surprise"] : []), "answers", "reveal", "vote", "result"];
  const stepNames: Record<string, string> = { presentation: "Situação", timer: "30 segundos", surprise: "Surpresa", answers: "Respostas", reveal: "Revelação", vote: "Veredito", result: "Resultado" };
  const current = steps.indexOf(round.phase);
  const role = suspect
    ? { icon: "🎭", label: "Suspeito", tip: round.investigator ? "Combine a história com seu parceiro. Depois, cada um responde sozinho." : "Combinem a história e, no fim, decidam juntos se colou." }
    : investigator ? { icon: "🔎", label: "Investigador", tip: "Escute a dupla e prepare uma pergunta surpresa para pegar o álibi." }
    : juror ? { icon: "⚖️", label: "Jurado", tip: "Compare as versões e vote: colou ou furou?" }
    : { icon: "👀", label: "Participante", tip: "Acompanhe a rodada. Você entra na próxima." };
  const total = round.phase === "surprise" ? 15 : 30;
  const ring = (size: number, label: string, sub?: string) => {
    const r = 54, c = 2 * Math.PI * r, progress = Math.min(1, remaining / total);
    return <div className={`alibi-ring${size > 200 ? " big" : ""}${remaining <= 10 ? " urgent" : ""}`} style={{ width: size, height: size }} role="timer" aria-live="off" aria-label={`${remaining} segundos restantes`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring-track" cx="60" cy="60" r={r} />
        <circle className="ring-fill" cx="60" cy="60" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
      </svg>
      <div className="ring-text"><strong>{label}</strong>{sub && <span>{sub}</span>}</div>
    </div>;
  };
  const resultNames: Record<string, string> = { colou: "Colou!", furado: "Álibi furado!", empate: "Empate", "sem-veredito": "Sem veredito" };
  const canVote = (round.jurors.length ? juror : round.investigator ? investigator : host) && !round.voted.includes(uid);
  const voters = round.jurors.length || 1;
  return <div className={`alibi-round phase-${round.phase}`}>
    <ol className="alibi-steps" aria-label="Etapas da rodada">
      {steps.map((s, i) => <li key={s} className={i < current ? "done" : i === current ? "now" : ""} aria-current={i === current ? "step" : undefined}><span>{stepNames[s]}</span></li>)}
    </ol>
    <span className="eyebrow">RODADA {round.id} · {stepNames[round.phase]}</span>
    <h2 className="alibi-situation">{round.situation}</h2>
    <div className="alibi-cast">
      <div><span className="cast-label">🎭 Suspeitos</span><div className="cast-people">{round.suspects.map(who)}</div></div>
      {round.investigator && <div><span className="cast-label">🔎 Investigador</span><div className="cast-people">{who(round.investigator)}</div></div>}
      {round.jurors.length > 0 && <div><span className="cast-label">⚖️ Júri</span><div className="cast-people">{round.jurors.map(who)}</div></div>}
    </div>
    <div className="alibi-role" key={`${round.id}-${role.label}`}>
      <span className="role-icon" aria-hidden="true">{role.icon}</span>
      <div><span className="eyebrow">SEU PAPEL NESTA RODADA</span><strong>{role.label}</strong><p>{role.tip}</p></div>
    </div>

    {round.phase === "presentation" && (host ? button("Começar os 30 segundos", "start") : <p className="alibi-wait">Aguardando o anfitrião<span className="dots" aria-hidden="true"><i /><i /><i /></span></p>)}

    {round.phase === "timer" && <div className="alibi-stage">
      {ring(240, `00:${String(remaining).padStart(2, "0")}`)}
      <p className="stage-call">{suspect ? "Combinem a história!" : "Os suspeitos estão combinando a versão."}</p>
    </div>}

    {(round.phase === "surprise" || round.phase === "answers") && <div className="alibi-shiu" key="shiu">
      <span className="shiu-emoji" aria-hidden="true">🤫</span>
      <h2>Shiu! Sem conversar. Respondam agora.</h2>
    </div>}

    {round.phase === "surprise" && <div className="alibi-stage">
      {ring(120, `${remaining}s`, "restantes")}
      {investigator ? <div className="alibi-panel">
        <p><strong>Escreva a pergunta surpresa</strong> ou use a pergunta do jogo. Ela substitui só a terceira.</p>
        <ol className="alibi-questions muted">{questions.slice(0, 2).map(q => <li key={q}>{q}</li>)}</ol>
        <label htmlFor="alibi-question">Pergunta surpresa</label>
        <input id="alibi-question" maxLength={200} value={question} placeholder="Ex.: Que música tocava no carro?" onChange={e => setQuestion(e.target.value)} />
        {button("Enviar pergunta surpresa", "question", question, "primary", !question.trim())}
        {button("Usar pergunta do jogo", "question", "", "secondary")}
      </div> : <p className="stage-call soft">O investigador está preparando a última pergunta. Mantenham o silêncio.</p>}
    </div>}

    {round.phase === "answers" && <div className="alibi-stage">
      <div className="alibi-submitted" aria-label={`${round.submitted.length} de 2 suspeitos responderam`}>
        {round.suspects.map(id => <span key={id} className={round.submitted.includes(id) ? "sent" : ""}>{round.submitted.includes(id) ? "✓" : "…"} {name(id)}</span>)}
      </div>
      <p className="muted-line">{round.submitted.length} de 2 suspeitos responderam.</p>
      {suspect && (round.submitted.includes(uid)
        ? <p className="alibi-sent">✅ Resposta enviada. Aguardando o outro suspeito.</p>
        : <div className="alibi-panel">
          {questions.map((q, i) => <div className="alibi-q" key={q}>
            <span className="q-num" aria-hidden="true">{i + 1}</span>
            <label htmlFor={`alibi-answer-${i}`}>{q}</label>
            <input id={`alibi-answer-${i}`} maxLength={500} value={answers[i]} onChange={e => setAnswers(a => a.map((v, n) => n === i ? e.target.value : v))} />
          </div>)}
          {answers.some(a => !a.trim()) && <p className="muted-line">Preencha as três respostas para enviar.</p>}
          {button("Enviar respostas", "answer", answers, "primary", answers.some(a => !a.trim()))}
        </div>)}
    </div>}

    {["reveal", "vote", "result"].includes(round.phase) && <div className="alibi-reveals">
      <h2>As versões 👀</h2>
      {!round.investigator && compared && <div className="alibi-comparison-summary" role="status">
        <strong>{matching === questions.length ? "Sugestão: as versões parecem bater" : "Sugestão: confiram as diferenças"}</strong>
        <p>{matching} de {questions.length} respostas têm textos iguais.</p>
        <p>Comparamos as palavras, ignorando maiúsculas, acentos e pontuação. Textos diferentes podem dizer a mesma coisa: a decisão é da turma.</p>
      </div>}
      {questions.map((q, i) => <article className="alibi-reveal" key={q}>
        <h3><span className="q-num" aria-hidden="true">{i + 1}</span>{q}</h3>
        <div className="alibi-answers">{round.suspects.map((id, n) => <div key={id} className={`bubble bubble-${n}`}>
          {who(id)}
          <p>{revealedAnswers[id]?.[i] ?? "…"}</p>
        </div>)}</div>
        {!round.investigator && comparisons[i] !== "aguardando" && <p className={`alibi-comparison alibi-comparison-${comparisons[i]}`}>
          {comparisons[i] === "igual" ? "✓ Textos iguais" : "≠ Textos diferentes — confiram o sentido"}
        </p>}
      </article>)}
    </div>}

    {round.phase === "reveal" && (host ? button("Abrir veredito", "beginVote") : <p className="alibi-wait">Aguardando o anfitrião abrir o veredito<span className="dots" aria-hidden="true"><i /><i /><i /></span></p>)}

    {round.phase === "vote" && <div className="alibi-stage">
      <h2>{!round.investigator ? "Decidam juntos" : round.jurors.length ? "Vote no álibi" : "Seu veredito, investigador"}</h2>
      {!!deadline && ring(110, `${remaining}s`, "para votar")}
      <div className="vote-progress" aria-label={`${round.voted.length} de ${voters} votos`}>
        <span style={{ width: `${(round.voted.length / voters) * 100}%` }} />
      </div>
      <p className="muted-line">{round.jurors.length ? `${round.voted.length} de ${voters} jurados votaram` : `${round.voted.length} de ${voters} voto(s) recebido(s)`}</p>
      {canVote ? <div className="vote-buttons">
        <button className="vote-btn vote-colou" disabled={busy} onClick={() => void send("vote", "colou")}><span aria-hidden="true">🤝</span>Colou</button>
        <button className="vote-btn vote-furado" disabled={busy} onClick={() => void send("vote", "furado")}><span aria-hidden="true">💥</span>Álibi furado</button>
        {!round.investigator && button("Seguir sem veredito", "skipVerdict", undefined, "secondary")}
      </div> : <p className="alibi-wait">{round.voted.includes(uid) ? "✅ Voto registrado." : "Aguardando o veredito"}{!round.voted.includes(uid) && <span className="dots" aria-hidden="true"><i /><i /><i /></span>}</p>}
    </div>}

    {round.phase === "result" && <div className="alibi-stage">
      <div ref={stampRef} className={`alibi-stamp stamp-${votesReady ? result.result : "loading"}`} key={votesReady ? result.result : "loading"}>
        {votesReady ? resultNames[result.result] : "Apurando…"}
      </div>
      {votesReady && round.jurors.length > 0 && <p className="alibi-score">Colou <b>{result.colou}</b> a <b>{result.furado}</b> Álibi furado</p>}
      {round.used.length >= situations.length && <p>Todas as situações foram usadas.</p>}
      {host ? (round.used.length >= situations.length ? button("Iniciar nova partida", "newGame") : button("Próxima rodada", "newRound")) : <p className="alibi-wait">Aguardando o anfitrião<span className="dots" aria-hidden="true"><i /><i /><i /></span></p>}
    </div>}

    {host && !["result", "cancelled"].includes(round.phase) && <button className="text-button alibi-cancel" disabled={busy} onClick={() => void send("cancel")}>Cancelar rodada</button>}
    {error && <Notice>{error}</Notice>}
  </div>;
}
