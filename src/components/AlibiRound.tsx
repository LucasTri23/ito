import { useEffect, useRef, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";
import { Notice } from "./UI";

export type AlibiPublicRound = {
  id: string; phase: string; situation: string; suspects: string[]; investigator: string | null; jurors: string[];
  deadline: number | null; questions: string[]; submitted: string[]; voted: string[];
  answers: Record<string, string[]>; result: { result: string; colou: number; furado: number } | null;
  remaining: number;
};
type Props = { code: string; uid: string; hostId: string; round?: AlibiPublicRound; players: { uid: string; name: string }[] };
const call = httpsCallable<{ code: string; roundId?: string; action: string; value?: unknown }, { questions?: string[]; now?: number }>(functions, "alibiAction");

export function AlibiRound({ code, uid, hostId, round, players }: Props) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [answers, setAnswers] = useState(["", "", ""]);
  const [question, setQuestion] = useState("");
  const [preview, setPreview] = useState<string[]>([]);
  const [tickBusy, setTickBusy] = useState(false);
  const [offset, setOffset] = useState(0);
  const nextTick = useRef(0);
  const roundId = round?.id;
  const phase = round?.phase;
  const investigatorId = round?.investigator;
  const deadline = round?.deadline;
  const host = uid === hostId;
  const name = (id: string) => players.find(p => p.uid === id)?.name || "Jogador";
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    let active = true;
    const start = Date.now();
    void call({ code, action: "clock" }).then(r => { if (active && r.data.now) setOffset(r.data.now - (start + Date.now()) / 2); }).catch(() => {});
    return () => { active = false; };
  }, [code, roundId]);
  useEffect(() => { setAnswers(["", "", ""]); setQuestion(""); setPreview([]); }, [roundId]);
  useEffect(() => {
    if (!roundId || phase !== "surprise" || investigatorId !== uid) return;
    let active = true;
    void call({ code, roundId, action: "preview" }).then(r => { if (active) setPreview(r.data.questions || []); }).catch(() => {});
    return () => { active = false; };
  }, [code, uid, roundId, phase, investigatorId]);
  useEffect(() => {
    if (!deadline || !roundId || now + offset < deadline || tickBusy || now < nextTick.current) return;
    nextTick.current = now + 2000;
    setTickBusy(true);
    void call({ code, roundId, action: "tick" }).catch(() => {}).finally(() => setTickBusy(false));
  }, [code, roundId, deadline, now, offset, tickBusy]);
  async function send(action: string, value?: unknown) {
    setBusy(true); setError("");
    try { await call({ code, roundId: round?.id, action, value }); }
    catch (e) { setError(e instanceof Error ? e.message : "Falha de conexão. Tente novamente."); }
    finally { setBusy(false); }
  }
  const button = (label: string, action: string, value?: unknown) => <button disabled={busy} className="button primary" onClick={() => void send(action, value)}>{label}</button>;
  if (!round || round.phase === "cancelled") return <div><p>Reúna de 2 a 8 pessoas para iniciar.</p>{host && button("Iniciar rodada", "newRound")}{!host && <p>Aguardando o anfitrião.</p>}{error && <Notice>{error}</Notice>}</div>;
  const suspect = round.suspects.includes(uid), investigator = uid === round.investigator, juror = round.jurors.includes(uid);
  const remaining = round.deadline ? Math.max(0, Math.ceil((round.deadline - now - offset) / 1000)) : 0;
  const phaseNames: Record<string, string> = { presentation: "Situação", timer: "Combinem a história", surprise: "Pergunta surpresa", answers: "Respostas", reveal: "Revelação", vote: "Veredito", result: "Resultado" };
  return <div className="alibi-round">
    <span className="eyebrow">RODADA {round.id} · {phaseNames[round.phase]}</span>
    <h2>{round.situation}</h2>
    <p>Suspeitos: {round.suspects.map(name).join(" e ")}{round.investigator ? ` · Investigador: ${name(round.investigator)}` : ""}{round.jurors.length ? ` · Júri: ${round.jurors.map(name).join(", ")}` : ""}</p>
    <p><strong>Seu papel nesta rodada:</strong> {suspect ? "suspeito" : investigator ? "investigador" : juror ? "jurado" : "participante"}.</p>
    {round.phase === "presentation" && (host ? button("Começar os 30 segundos", "start") : <p>Aguardando o anfitrião.</p>)}
    {round.phase === "timer" && <div className="alibi-timer"><strong>00:{String(remaining).padStart(2, "0")}</strong><p>{suspect ? "Combinem a história!" : "Os suspeitos estão combinando a versão."}</p></div>}
    {round.phase === "surprise" && <><h2>🤫 Shiu! Sem conversar. Respondam agora.</h2><p>Tempo restante: {remaining}s</p>{investigator ? <><p>Escreva a pergunta surpresa ou use a pergunta do jogo.</p>{preview.map(q => <p key={q}>{q}</p>)}<label htmlFor="alibi-question">Pergunta surpresa</label><input id="alibi-question" maxLength={200} value={question} onChange={e => setQuestion(e.target.value)} />{button("Enviar pergunta surpresa", "question", question)}{button("Usar pergunta do jogo", "question", "")}</> : <p>O investigador está preparando a última pergunta. Mantenham o silêncio.</p>}</>}
    {round.phase === "answers" && <><h2>🤫 Shiu! Sem conversar. Respondam agora.</h2><p>{round.submitted.length} de 2 suspeitos responderam.</p>{suspect && (round.submitted.includes(uid) ? <p>Resposta enviada. Aguardando o outro suspeito.</p> : <>{round.questions.map((q, i) => <div key={q}><label htmlFor={`alibi-answer-${i}`}>{q}</label><input id={`alibi-answer-${i}`} maxLength={500} value={answers[i]} onChange={e => setAnswers(a => a.map((v, n) => n === i ? e.target.value : v))} /></div>)}{button("Enviar respostas", "answer", answers)}</>)}</>}
    {["reveal", "vote", "result"].includes(round.phase) && <div><h2>As respostas</h2>{round.questions.map((q, i) => <article className="alibi-reveal" key={q}><h3>{q}</h3><div className="alibi-answers">{round.suspects.map(id => <p key={id}><strong>{name(id)}</strong><br />{round.answers[id]?.[i]}</p>)}</div></article>)}</div>}
    {round.phase === "reveal" && (host ? button("Abrir veredito", "beginVote") : <p>Aguardando o anfitrião abrir o veredito.</p>)}
    {round.phase === "vote" && <><h2>{!round.investigator ? "Decidam juntos" : "Vote no álibi"}</h2>{round.deadline && <p>Tempo restante: {remaining}s</p>}<p>{round.voted.length} de {round.jurors.length || 1} voto(s) recebido(s).</p>{(round.jurors.length ? juror : round.investigator ? investigator : host) && !round.voted.includes(uid) ? <>{button("Colou", "vote", "colou")}{button("Álibi furado", "vote", "furado")}{!round.investigator && button("Seguir sem veredito", "skipVerdict")}</> : <p>{round.voted.includes(uid) ? "Voto registrado." : "Aguardando o veredito."}</p>}</>}
    {round.phase === "result" && <><h2>{({ colou: "Colou", furado: "Álibi furado", empate: "Empate", "sem-veredito": "Sem veredito" } as Record<string, string>)[round.result?.result || ""]}</h2>{round.jurors.length > 0 && round.result && <p>Colou {round.result.colou} a {round.result.furado} Álibi furado</p>}{round.remaining === 0 && <p>Todas as situações foram usadas.</p>}{host && (round.remaining === 0 ? button("Iniciar nova partida", "newGame") : button("Próxima rodada", "newRound"))}</>}
    {host && !["result", "cancelled"].includes(round.phase) && <button className="text-button" disabled={busy} onClick={() => void send("cancel")}>Cancelar rodada</button>}
    {error && <Notice>{error}</Notice>}
  </div>;
}
