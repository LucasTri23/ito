import { useEffect, useRef, useState } from "react";
import { MesaShell, type MesaContext } from "../components/MesaShell";
import { Notice } from "../components/UI";
import { useCountdown, useLiveCollection, useLiveDoc } from "../hooks/useMesa";
import { byJoin, newMatch, roundIdOf } from "../services/mesa";
import { confirmPlanB, missions, revealPlanB, startPlanBRound, type PlanBRound } from "../services/planB";
import { burst } from "../utils/fx";
import { errorText } from "../utils/game";
import { pairScore, PLANB_PICKS, PLANB_ROUNDS, PLANB_SECONDS } from "../utils/planB";

type Choice = { id: string; uid: string; picks: number[] };

export function PlanoB() {
  return (
    <MesaShell
      game="planb"
      route="plano-b"
      title="Plano B"
      badge="🎒"
      tone="tone-peach"
      eyebrow="ONLINE OU PRESENCIAL · 2 A 8 JOGADORES"
      pitch="Todo mundo recebe a mesma missão e uma dica. Escolha 2 de 6 itens antes de descobrir o imprevisto. Quem se preparou melhor faz mais pontos."
      steps={[
        ["🎯", "Leia a missão e a dica"],
        ["🎒", "Escolha 2 itens em 25 segundos"],
        ["⚡", "O imprevisto decide os pontos"],
      ]}
      note="Cada pessoa joga no próprio celular, juntos na mesma sala ou à distância. Partida de 5 rodadas."
    >
      {(ctx) => <PlanBTable ctx={ctx} />}
    </MesaShell>
  );
}

function PlanBTable({ ctx }: { ctx: MesaContext }) {
  const { code, room, host, players } = ctx;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const roundPath = room.currentRoundId ? `mesas/${code}/rounds/${room.currentRoundId}` : null;
  const round = useLiveDoc<PlanBRound>(roundPath).value;
  const current = round && round.id.startsWith(`${room.gameNo}-`) ? round : null;
  const over = room.roundNo >= PLANB_ROUNDS && current?.phase === "reveal";
  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const start = () => run(() => startPlanBRound(code, ctx.uid, byJoin(players).map((p) => p.uid)));
  return (
    <div className="alibi-round mesa-round">
      {!current && (
        <div className="alibi-idle">
          <span className="alibi-idle-icon" aria-hidden="true">🎒</span>
          <h3>Partida de {PLANB_ROUNDS} rodadas</h3>
          <p>A cada rodada: uma missão, seis itens e um imprevisto escondido.</p>
          {host ? (
            <button className="button primary" disabled={busy || players.length < 2} onClick={() => void start()}>
              Começar partida
            </button>
          ) : (
            <p className="alibi-wait">Aguardando o anfitrião</p>
          )}
        </div>
      )}
      {current && current.phase === "choose" && <ChoosePanel ctx={ctx} round={current} />}
      {current && current.phase === "reveal" && <RevealPanel ctx={ctx} round={current} />}
      {current && room.roundNo > 0 && <Scoreboard ctx={ctx} final={over} />}
      {current?.phase === "reveal" &&
        (host ? (
          over ? (
            <button className="button primary" disabled={busy} onClick={() => void run(() => newMatch(code))}>
              Nova partida
            </button>
          ) : (
            <button className="button primary" disabled={busy || players.length < 2} onClick={() => void start()}>
              Próxima rodada ({room.roundNo + 1} de {PLANB_ROUNDS})
            </button>
          )
        ) : (
          <p className="alibi-wait">Aguardando o anfitrião</p>
        ))}
      {error && <Notice>{error}</Notice>}
    </div>
  );
}

function MissionCard({ round }: { round: PlanBRound }) {
  const mission = missions.find((m) => m.id === round.missionId);
  if (!mission) return null;
  return (
    <>
      <span className="eyebrow">RODADA {round.no} DE {PLANB_ROUNDS} · MISSÃO</span>
      <h2 className="alibi-situation">{mission.mission}</h2>
      <p className="planb-hint">
        <span aria-hidden="true">💡</span> {mission.hint}
      </p>
    </>
  );
}

function ChoosePanel({ ctx, round }: { ctx: MesaContext; round: PlanBRound }) {
  const { code, uid, offset } = ctx;
  const mission = missions.find((m) => m.id === round.missionId);
  const key = `planb.picks.${code}.${round.id}`;
  const [picks, setPicks] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const mine = useLiveDoc<Choice>(`mesas/${code}/rounds/${round.id}/choices/${uid}`).value;
  const endsAt = round.startedAt ? { toMillis: () => round.startedAt!.toMillis() + PLANB_SECONDS * 1000 } : null;
  const { remaining, expired } = useCountdown(endsAt as never, offset);
  const playing = round.participants.includes(uid);
  const confirmed = round.confirmed.includes(uid);
  const everyone = round.confirmed.length >= round.participants.length;
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(picks));
    } catch {
      /* rascunho é opcional */
    }
  }, [key, picks]);
  // Avanço automático: qualquer aparelho pode revelar quando todos confirmaram ou o tempo acabou.
  const lastTry = useRef(0);
  useEffect(() => {
    if (!(everyone || expired) || Date.now() - lastTry.current < 2000) return;
    lastTry.current = Date.now();
    void revealPlanB(code, round.id).catch(() => {});
  }, [everyone, expired, code, round.id, remaining]);
  const toggle = (i: number) =>
    setPicks((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length >= PLANB_PICKS ? [p[1], i] : [...p, i]));
  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await confirmPlanB(code, round.id, uid, picks);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  if (!mission) return <Notice>Missão não encontrada.</Notice>;
  const locked = confirmed || expired || !playing;
  const shown = confirmed && mine ? mine.picks : picks;
  return (
    <>
      <MissionCard round={round} />
      <div className="planb-timer">
        <div className={`alibi-ring${remaining <= 5 ? " urgent" : ""}`} style={{ width: 96, height: 96 }} role="timer" aria-label={`${remaining} segundos restantes`}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="ring-track" cx="60" cy="60" r="54" />
            <circle className="ring-fill" cx="60" cy="60" r="54" strokeDasharray={339.3} strokeDashoffset={339.3 * (1 - remaining / PLANB_SECONDS)} />
          </svg>
          <div className="ring-text">
            <strong>{remaining}</strong>
          </div>
        </div>
        <p className="muted-line">
          {round.confirmed.length} de {round.participants.length} confirmaram
        </p>
      </div>
      {!playing && <p className="alibi-wait">Você entrou depois do início. Participa da próxima rodada.</p>}
      <div className="planb-items" role="group" aria-label="Escolha dois itens">
        {mission.items.map((item, i) => (
          <button
            key={item}
            type="button"
            className={`planb-item${shown.includes(i) ? " picked" : ""}`}
            aria-pressed={shown.includes(i)}
            disabled={locked}
            onClick={() => toggle(i)}
          >
            <span className="planb-check" aria-hidden="true">{shown.includes(i) ? "✓" : ""}</span>
            {item}
          </button>
        ))}
      </div>
      {playing && !confirmed && !expired && (
        <button className="button primary" disabled={busy || picks.length !== PLANB_PICKS} onClick={() => void confirm()}>
          {picks.length === PLANB_PICKS ? "Confirmar escolha" : `Escolha ${PLANB_PICKS - picks.length} item${PLANB_PICKS - picks.length > 1 ? "s" : ""}`}
        </button>
      )}
      {confirmed && <p className="alibi-sent">✅ Escolha confirmada. Aguardando a turma…</p>}
      {playing && !confirmed && expired && <p className="alibi-wait">⏱️ Tempo esgotado. Esta rodada vale 0 para você.</p>}
      {error && <Notice>{error}</Notice>}
    </>
  );
}

function RevealPanel({ ctx, round }: { ctx: MesaContext; round: PlanBRound }) {
  const { code, name, uid } = ctx;
  const mission = missions.find((m) => m.id === round.missionId);
  const sealed = useLiveDoc<{ twist: number }>(`mesas/${code}/rounds/${round.id}/sealed/twist`).value;
  const choicesQ = useLiveCollection<Choice>(`mesas/${code}/rounds/${round.id}/choices`);
  const choices = choicesQ.value;
  const stampRef = useRef<HTMLDivElement>(null);
  const twist = sealed && mission ? mission.twists[sealed.twist] : null;
  useEffect(() => {
    if (twist) burst(stampRef.current, 24);
  }, [twist]);
  if (!mission) return null;
  const rows = round.participants
    .map((pid) => {
      const c = choices.find((x) => x.uid === pid);
      return { pid, picks: c?.picks ?? [], total: c && twist ? pairScore(twist, c.picks) : 0 };
    })
    .sort((a, b) => b.total - a.total);
  return (
    <>
      <MissionCard round={round} />
      <div ref={stampRef} className="planb-twist" key={sealed?.twist ?? "x"}>
        <span className="eyebrow">⚡ IMPREVISTO</span>
        <strong>{twist ? twist.text : "Abrindo o imprevisto…"}</strong>
      </div>
      {twist && choicesQ.ready && (
        <ul className="planb-results">
          {rows.map((r) => (
            <li key={r.pid} className={r.pid === uid ? "is-me" : ""}>
              <div className="planb-result-head">
                <b>{name(r.pid)}</b>
                <span className="planb-points">{r.total} pts</span>
              </div>
              {r.picks.length ? (
                r.picks.map((i) => (
                  <p key={i} className={`planb-line score-${twist.scores[i]}`}>
                    <span className="planb-score">{twist.scores[i]}</span>
                    <span>
                      <b>{mission.items[i]}</b> — {twist.reasons[i]}
                    </span>
                  </p>
                ))
              ) : (
                <p className="planb-line score-0">
                  <span className="planb-score">0</span>
                  <span>Não confirmou a tempo.</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Soma de pontos de cada rodada já revelada desta partida. */
function RoundTotals({ code, roundId, onTotals }: { code: string; roundId: string; onTotals: (id: string, t: Record<string, number>) => void }) {
  const round = useLiveDoc<PlanBRound>(`mesas/${code}/rounds/${roundId}`).value;
  const revealed = round?.phase === "reveal";
  const sealed = useLiveDoc<{ twist: number }>(revealed ? `mesas/${code}/rounds/${roundId}/sealed/twist` : null).value;
  const choicesQ = useLiveCollection<Choice>(revealed ? `mesas/${code}/rounds/${roundId}/choices` : null);
  const choices = choicesQ.value;
  useEffect(() => {
    const mission = missions.find((m) => m.id === round?.missionId);
    if (!round || !revealed || !sealed || !mission || !choicesQ.ready) return;
    const twist = mission.twists[sealed.twist];
    onTotals(roundId, Object.fromEntries(choices.map((c) => [c.uid, pairScore(twist, c.picks)])));
  }, [round, revealed, sealed, choices, choicesQ.ready, roundId, onTotals]);
  return null;
}

function Scoreboard({ ctx, final }: { ctx: MesaContext; final: boolean }) {
  const { code, room, name, players } = ctx;
  const [totals, setTotals] = useState<Record<string, Record<string, number>>>({});
  const onTotals = useRef((id: string, t: Record<string, number>) =>
    setTotals((prev) => (JSON.stringify(prev[id]) === JSON.stringify(t) ? prev : { ...prev, [id]: t })),
  ).current;
  const ids = Array.from({ length: room.roundNo }, (_, i) => roundIdOf(room.gameNo, i + 1));
  const sum: Record<string, number> = {};
  for (const p of players) sum[p.uid] = 0;
  for (const id of ids) for (const [pid, pts] of Object.entries(totals[id] ?? {})) sum[pid] = (sum[pid] ?? 0) + pts;
  const ranking = Object.entries(sum).sort((a, b) => b[1] - a[1]);
  const top = ranking[0]?.[1] ?? 0;
  const winners = ranking.filter(([, s]) => s === top && top > 0).map(([pid]) => name(pid));
  return (
    <div className="planb-board">
      {ids.map((id) => (
        <RoundTotals key={id} code={code} roundId={id} onTotals={onTotals} />
      ))}
      <h3>{final ? "🏁 Placar final" : "Placar da partida"}</h3>
      {final && (
        <div className={`alibi-stamp ${winners.length > 1 ? "stamp-empate" : "stamp-colou"}`}>
          {winners.length === 0 ? "Sem pontos" : winners.length > 1 ? `Empate: ${winners.join(" e ")}` : `${winners[0]} venceu!`}
        </div>
      )}
      <ol className="planb-ranking">
        {ranking.map(([pid, s], i) => (
          <li key={pid}>
            <span className="ranking-position">{i + 1}</span>
            <b>{name(pid)}</b>
            <span className="planb-points">{s} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
