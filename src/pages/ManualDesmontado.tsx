import { useEffect, useRef, useState } from "react";
import { MesaShell, type MesaContext } from "../components/MesaShell";
import { Notice } from "../components/UI";
import { useCountdown, useLiveCollection, useLiveDoc } from "../hooks/useMesa";
import { byJoin, newMatch } from "../services/mesa";
import {
  challenges,
  finishManual,
  MANUAL_ROUNDS,
  moveManual,
  startManualRound,
  testManual,
  type Bench,
  type ClueHand,
  type ManualRound,
  type Team,
} from "../services/manual";
import { burst } from "../utils/fx";
import { errorText } from "../utils/game";
import { clueText, MANUAL_ATTEMPTS, MANUAL_SECONDS } from "../utils/manual";

const TEAM_NAME: Record<Team, string> = { A: "Equipe Amarela", B: "Equipe Rosa" };

export function ManualDesmontado() {
  return (
    <MesaShell
      game="manual"
      route="manual-desmontado"
      title="Manual Desmontado"
      badge="🔧"
      tone="tone-sky"
      eyebrow="COOPERATIVO · 2 A 8 JOGADORES"
      pitch="A equipe precisa montar uma máquina na ordem certa, mas cada pessoa só tem um pedaço do manual. Juntem as pistas, organizem a bancada e testem a montagem."
      steps={[
        ["📄", "Cada um lê só as suas pistas"],
        ["🗣️", "Conversem ao vivo ou por chamada"],
        ["🔧", "Montem e testem em 3 minutos"],
      ]}
      note="Com 2 ou 3 pessoas, todos jogam juntos. Com 4 a 8, duas equipes disputam o mesmo desafio. A conversa pode ser presencial ou numa chamada; a bancada fica sincronizada no site."
    >
      {(ctx) => <ManualTable ctx={ctx} />}
    </MesaShell>
  );
}

function ManualTable({ ctx }: { ctx: MesaContext }) {
  const { code, room, host, players } = ctx;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const round = useLiveDoc<ManualRound>(room.currentRoundId ? `mesas/${code}/rounds/${room.currentRoundId}` : null).value;
  const current = round && round.id.startsWith(`${room.gameNo}-`) ? round : null;
  const over = room.roundNo >= MANUAL_ROUNDS && current?.phase === "done";
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
  const start = () => run(() => startManualRound(code, ctx.uid, byJoin(players).map((p) => p.uid)));
  return (
    <div className="alibi-round mesa-round">
      {!current && (
        <div className="alibi-idle">
          <span className="alibi-idle-icon" aria-hidden="true">🔧</span>
          <h3>Partida de {MANUAL_ROUNDS} desafios</h3>
          <p>{players.length >= 4 ? "Vocês serão divididos em duas equipes." : "Todos jogam juntos na mesma bancada."}</p>
          {host ? (
            <button className="button primary" disabled={busy || players.length < 2} onClick={() => void start()}>
              Começar desafio
            </button>
          ) : (
            <p className="alibi-wait">Aguardando o anfitrião</p>
          )}
        </div>
      )}
      {current?.phase === "build" && <BuildPanel ctx={ctx} round={current} />}
      {current?.phase === "done" && <DonePanel ctx={ctx} round={current} />}
      {current?.phase === "done" &&
        (host ? (
          over ? (
            <button className="button primary" disabled={busy} onClick={() => void run(() => newMatch(code))}>
              Nova partida
            </button>
          ) : (
            <button className="button primary" disabled={busy || players.length < 2} onClick={() => void start()}>
              Próximo desafio ({room.roundNo + 1} de {MANUAL_ROUNDS})
            </button>
          )
        ) : (
          <p className="alibi-wait">Aguardando o anfitrião</p>
        ))}
      {error && <Notice>{error}</Notice>}
    </div>
  );
}

function Header({ round }: { round: ManualRound }) {
  const ch = challenges.find((c) => c.id === round.challengeId);
  return (
    <>
      <span className="eyebrow">
        DESAFIO {round.no} DE {MANUAL_ROUNDS} · {round.size} PEÇAS
      </span>
      <h2 className="alibi-situation">{ch?.theme}</h2>
      {ch && <p className="muted-line">{ch.intro}</p>}
    </>
  );
}

function BuildPanel({ ctx, round }: { ctx: MesaContext; round: ManualRound }) {
  const { code, uid, offset, name } = ctx;
  const team: Team | null = round.teamA.includes(uid) ? "A" : round.teamB.includes(uid) ? "B" : null;
  const base = `mesas/${code}/rounds/${round.id}`;
  const bench = useLiveDoc<Bench>(team ? `${base}/benches/${team}` : null).value;
  const hand = useLiveDoc<ClueHand>(team ? `${base}/clues/${uid}` : null).value;
  const ch = challenges.find((c) => c.id === round.challengeId);
  const endsAt = round.startedAt ? { toMillis: () => round.startedAt!.toMillis() + MANUAL_SECONDS * 1000 } : null;
  const { remaining, expired } = useCountdown(endsAt as never, offset);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const closed = !bench || bench.status !== "open" || expired;
  // Fecha o desafio quando a bancada encerrou ou o tempo acabou (a regra confere as duas equipes).
  // Sem prazo vencido, só um integrante da equipe que já terminou tenta fechar (evita sobrecarregar as regras).
  const lastTry = useRef(0);
  useEffect(() => {
    const ownDone = bench && bench.status !== "open" && bench.members[0] === uid;
    const gap = expired ? 3000 : 6000;
    if (!(expired || ownDone) || Date.now() - lastTry.current < gap) return;
    lastTry.current = Date.now();
    void finishManual(code, round.id).catch(() => {});
  }, [expired, bench, code, round.id, remaining, uid]);
  useEffect(() => {
    if (bench?.status === "solved") burst(document.querySelector(".manual-bench"), 30);
  }, [bench?.status]);
  if (!ch) return <Notice>Desafio não encontrado.</Notice>;
  const pieceName = (id: string) => ch.pieces.find((p) => p.id === id)?.name ?? id;
  async function act(fn: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await fn();
      setSelected(null);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const clickSlot = (i: number) => {
    if (!bench || closed) return;
    if (selected) return void act(() => moveManual(code, round.id, team!, bench.slots, selected, i));
    if (bench.slots[i]) setSelected(bench.slots[i]);
  };
  const tray = ch.pieces.filter((p) => !bench?.slots.includes(p.id));
  const mates = (team === "A" ? round.teamA : round.teamB).filter((m) => m !== uid);
  const left = bench ? MANUAL_ATTEMPTS - bench.attempts : MANUAL_ATTEMPTS;
  const selectedSlot = selected && bench ? bench.slots.indexOf(selected) : -1;
  return (
    <>
      <Header round={round} />
      {!team && <p className="alibi-wait">Você entrou durante o desafio. Participa do próximo.</p>}
      {team && (
        <>
          <div className="manual-status">
            <span className={`manual-team team-${team}`}>{TEAM_NAME[team]}</span>
            <span className="muted-line">com {mates.map(name).join(", ") || "—"}</span>
            <span className={`manual-clock${remaining <= 30 ? " urgent" : ""}`} role="timer">
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
            </span>
          </div>
          <div className="manual-clues">
            <span className="eyebrow">📄 SEU PEDAÇO DO MANUAL · SÓ VOCÊ VÊ</span>
            <ul>{hand?.clues.map((i) => <li key={i}>{clueText(ch.clues[i], ch.pieces)}</li>) ?? <li>Carregando…</li>}</ul>
          </div>
          {bench && (
            <>
              <ol className={`manual-bench${closed ? " locked" : ""}`} aria-label="Bancada de montagem">
                {bench.slots.map((piece, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className={`manual-slot${piece ? " filled" : ""}${selected === piece && piece ? " selected" : ""}`}
                      disabled={closed || busy}
                      onClick={() => clickSlot(i)}
                      aria-label={`Espaço ${i + 1}: ${piece ? pieceName(piece) : "vazio"}`}
                    >
                      <span className="slot-no">{i + 1}</span>
                      {piece ? pieceName(piece) : selected ? "Colocar aqui" : "vazio"}
                    </button>
                  </li>
                ))}
              </ol>
              {!closed && (
                <>
                  <span className="eyebrow">PEÇAS SOLTAS · TOQUE NUMA PEÇA E DEPOIS NUM ESPAÇO</span>
                  <div className="manual-tray">
                    {tray.map((p) => (
                      <button key={p.id} type="button" className={`manual-piece${selected === p.id ? " selected" : ""}`} onClick={() => setSelected(selected === p.id ? null : p.id)}>
                        {p.name}
                      </button>
                    ))}
                    {!tray.length && <span className="muted-line">Todas as peças estão na bancada.</span>}
                  </div>
                  {selectedSlot >= 0 && (
                    <button className="button secondary" disabled={busy} onClick={() => void act(() => moveManual(code, round.id, team, bench.slots, null, selectedSlot))}>
                      Retirar {pieceName(selected!)} do espaço {selectedSlot + 1}
                    </button>
                  )}
                </>
              )}
              <p className="muted-line">
                Tentativas restantes: <b>{left}</b> · Quem testa agora: <b>{bench.tester === uid ? "você" : name(bench.tester)}</b>
              </p>
              {bench.lastCorrect >= 0 && bench.status === "open" && (
                <p className="manual-feedback">
                  ❌ Ainda não. <b>{bench.lastCorrect}</b> de {bench.slots.length} peças estão na posição certa.
                </p>
              )}
              {bench.status === "open" && !expired && bench.tester === uid && (
                <button className="button primary" disabled={busy || bench.slots.includes("")} onClick={() => void act(() => testManual(code, round.id, team, bench, null))}>
                  {bench.slots.includes("") ? "Preencha todos os espaços para testar" : "Testar montagem"}
                </button>
              )}
              {bench.status === "solved" && <p className="alibi-sent">✅ Montagem correta! Aguardando o fim do desafio…</p>}
              {bench.status === "failed" && <p className="manual-feedback">Acabaram as tentativas. Aguardando o fim do desafio…</p>}
              {bench.status === "open" && expired && <p className="manual-feedback">⏱️ Tempo esgotado.</p>}
            </>
          )}
        </>
      )}
      {error && <Notice>{error}</Notice>}
    </>
  );
}

function verdict(round: ManualRound, a: Bench | null, b: Bench | null) {
  if (!round.teamB.length) {
    if (!a) return "";
    return a.status === "solved" ? `🎉 Vocês conseguiram em ${a.attempts} tentativa${a.attempts > 1 ? "s" : ""}!` : "Não foi dessa vez.";
  }
  const solved = [a, b].filter((x): x is Bench => !!x && x.status === "solved");
  if (!solved.length) return "Ninguém montou a máquina. Sem vencedor.";
  if (solved.length === 1) return `🏆 ${TEAM_NAME[solved[0].team]} venceu!`;
  const [x, y] = solved;
  if (x.attempts !== y.attempts) return `🏆 ${TEAM_NAME[(x.attempts < y.attempts ? x : y).team]} venceu com menos tentativas!`;
  const tx = x.solvedAt?.toMillis() ?? 0;
  const ty = y.solvedAt?.toMillis() ?? 0;
  if (tx === ty) return "Empate!";
  return `🏆 ${TEAM_NAME[(tx < ty ? x : y).team]} venceu por ter terminado primeiro!`;
}

function DonePanel({ ctx, round }: { ctx: MesaContext; round: ManualRound }) {
  const { code, name } = ctx;
  const base = `mesas/${code}/rounds/${round.id}`;
  const ch = challenges.find((c) => c.id === round.challengeId);
  const a = useLiveDoc<Bench>(`${base}/benches/A`).value;
  const b = useLiveDoc<Bench>(round.teamB.length ? `${base}/benches/B` : null).value;
  const hands = useLiveCollection<ClueHand>(`${base}/clues`).value;
  if (!ch) return null;
  const owner = (i: number) => hands.filter((h) => h.clues.includes(i)).map((h) => name(h.uid));
  return (
    <>
      <Header round={round} />
      <div className="alibi-stamp stamp-colou manual-verdict">{verdict(round, a, b) || "Apurando…"}</div>
      <div className="manual-solution">
        <span className="eyebrow">MONTAGEM CORRETA</span>
        <ol>
          {ch.solution.map((id) => (
            <li key={id}>{ch.pieces.find((p) => p.id === id)?.name}</li>
          ))}
        </ol>
      </div>
      {[a, b].filter((x): x is Bench => !!x).map((x) => (
        <p key={x.team} className="muted-line">
          <b>{TEAM_NAME[x.team]}</b>: {x.status === "solved" ? `montou em ${x.attempts} tentativa(s)` : x.status === "failed" ? "esgotou as tentativas" : "não terminou a tempo"}
        </p>
      ))}
      <div className="manual-clues">
        <span className="eyebrow">COMO AS PISTAS SE ENCAIXAM</span>
        <ul>
          {ch.clues.map((c, i) => (
            <li key={i}>
              {clueText(c, ch.pieces)} <span className="muted-line">— {owner(i).join(", ") || "pista"}</span>
            </li>
          ))}
        </ul>
        <p>{ch.explanation}</p>
      </div>
    </>
  );
}
