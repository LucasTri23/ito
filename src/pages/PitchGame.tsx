import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { MesaShell, type MesaContext } from "../components/MesaShell";
import { Notice } from "../components/UI";
import { useCountdown, useLiveCollection, useLiveDoc } from "../hooks/useMesa";
import { byJoin, newMatch, roundIdOf, setMesaOption, type MesaGame } from "../services/mesa";
import {
  advanceFeira,
  FEIRA_ROUNDS,
  hostLive,
  inventorCount,
  startFeiraRound,
  submitInvention,
  topOf,
  voteLive,
  voteOnline,
  type Entry,
  type FeiraLiveRound,
  type FeiraOnlineRound,
  type FeiraRound,
} from "../services/feira";
import { burst } from "../utils/fx";
import { errorText } from "../utils/game";
import { FEIRA_LIVE_VOTE_SECONDS, FEIRA_VOTE_SECONDS } from "../utils/feira";

/**
 * Motor dos jogos de "criar e vender" (Feira de Invenções e Anúncios dos Tempos Bíblicos):
 * um tema da rodada para todos, um segredo diferente para cada criador, criação escrita
 * ou apresentação ao vivo, e votação. Cada jogo entra só com textos e catálogo.
 */
export interface PitchConfig {
  game: MesaGame;
  route: string;
  title: string;
  badge: string;
  tone: string;
  eyebrow: string;
  pitch: string;
  steps: [string, string][];
  note: string;
  seconds: number;
  topicText: (id: string) => string;
  topicDetail?: (id: string) => ReactNode;
  secretName: (id?: string) => string;
  t: {
    person: string; // inventor / vendedor
    people: string; // inventores / vendedores
    People: string;
    thing: string; // invenção / anúncio
    things: string;
    Thing: string;
    Things: string;
    thingGender: "a" | "o"; // "a sua" / "o seu"
    topicEyebrow: string; // PROBLEMA DA FEIRA / OBJETO DO ANÚNCIO
    secretEyebrow: string; // SEU MATERIAL SECRETO / SEU ESTILO SECRETO
    secretHint: string;
    secretIcon: string;
    fields: [string, string, string]; // nome, como funciona, slogan
    creating: string; // "estão inventando…"
    onlineMode: string;
    liveMode: string;
    board: string;
    champion: string; // "é o inventor do ano!"
  };
}
type Material = { uid: string; materialId: string };
type Author = { anon: string; uid: string };
type Vote = { uid: string; target: string };
type PVote = { id: string; inventor: string; voter: string; buy: boolean };
const Pitch = createContext<PitchConfig>(null as never);
const usePitch = () => useContext(Pitch);
const letter = (i: number) => String.fromCharCode(65 + i);
const deadline = (t: { toMillis(): number } | null | undefined, s: number) => (t ? ({ toMillis: () => t.toMillis() + s * 1000 } as never) : null);

export function PitchGame({ config }: { config: PitchConfig }) {
  return (
    <Pitch.Provider value={config}>
      <MesaShell
        game={config.game}
        route={config.route}
        title={config.title}
        badge={config.badge}
        tone={config.tone}
        eyebrow={config.eyebrow}
        pitch={config.pitch}
        steps={config.steps}
        note={config.note}
      >
        {(ctx) => <FeiraTable ctx={ctx} />}
      </MesaShell>
    </Pitch.Provider>
  );
}

function FeiraTable({ ctx }: { ctx: MesaContext }) {
  const cfg = usePitch();
  const { code, room, host, players } = ctx;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const round = useLiveDoc<FeiraRound>(room.currentRoundId ? `mesas/${code}/rounds/${room.currentRoundId}` : null).value;
  const current = round && round.id.startsWith(`${room.gameNo}-`) ? round : null;
  const mode = room.mode ?? "online";
  const over = room.roundNo >= FEIRA_ROUNDS && current?.phase === "result";
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
  const start = () => run(() => startFeiraRound(code, ctx.uid, byJoin(players).map((p) => p.uid)));
  const count = inventorCount(mode, players.length, room.inventors);
  return (
    <div className="alibi-round mesa-round">
      {!current && (
        <div className="alibi-idle">
          <span className="alibi-idle-icon" aria-hidden="true">💡</span>
          <h3>Como vamos jogar?</h3>
          <div className="feira-modes" role="radiogroup" aria-label="Modo de jogo">
            {(
              [
                ["online", `✍️ Online · ${cfg.t.Things} escrit${cfg.t.thingGender}s`, cfg.t.onlineMode],
                ["presencial", "🎤 Presencial · Apresentações ao vivo", cfg.t.liveMode],
              ] as const
            ).map(([value, label, text]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={mode === value}
                className={`feira-mode${mode === value ? " selected" : ""}`}
                disabled={!host || busy || room.roundNo > 0}
                onClick={() => void run(() => setMesaOption(code, { mode: value }))}
              >
                <b>{label}</b>
                <small>{text}</small>
              </button>
            ))}
          </div>
          {mode === "presencial" && players.length >= 5 && (
            <div className="feira-count">
              <span>{cfg.t.People} por rodada:</span>
              {[2, 3].map((n) => (
                <button key={n} type="button" className={`manual-piece${(room.inventors ?? 2) === n ? " selected" : ""}`} disabled={!host || busy || room.roundNo > 0} onClick={() => void run(() => setMesaOption(code, { inventors: n }))}>
                  {n}
                </button>
              ))}
            </div>
          )}
          <p className="muted-line">
            {players.length >= 2 ? `${count} ${count > 1 ? cfg.t.people : cfg.t.person} por rodada · ${FEIRA_ROUNDS} rodadas.` : ""} {!host && "O anfitrião escolhe o modo."}
          </p>
          {host ? (
            <button className="button primary" disabled={busy || players.length < 2} onClick={() => void start()}>
              Começar partida
            </button>
          ) : (
            <p className="alibi-wait">Aguardando o anfitrião</p>
          )}
        </div>
      )}
      {current?.mode === "online" && <OnlineRound ctx={ctx} round={current} />}
      {current?.mode === "presencial" && <LiveRound ctx={ctx} round={current} />}
      {current && <FeiraScore ctx={ctx} final={over} />}
      {current?.phase === "result" &&
        (host ? (
          over ? (
            <button className="button primary" disabled={busy} onClick={() => void run(() => newMatch(code))}>
              Nova partida
            </button>
          ) : (
            <button className="button primary" disabled={busy || players.length < 2} onClick={() => void start()}>
              Próxima rodada ({room.roundNo + 1} de {FEIRA_ROUNDS})
            </button>
          )
        ) : (
          <p className="alibi-wait">Aguardando o anfitrião</p>
        ))}
      {error && <Notice>{error}</Notice>}
    </div>
  );
}

function Problem({ round }: { round: FeiraRound }) {
  const cfg = usePitch();
  return (
    <>
      <span className="eyebrow">
        RODADA {round.no} DE {FEIRA_ROUNDS} · {cfg.t.topicEyebrow}
      </span>
      <h2 className="alibi-situation">{cfg.topicText(round.problemId)}</h2>
      {cfg.topicDetail?.(round.problemId)}
    </>
  );
}

function MyMaterial({ code, round, uid }: { code: string; round: FeiraRound; uid: string }) {
  const cfg = usePitch();
  const mine = useLiveDoc<Material>(round.inventors.includes(uid) ? `mesas/${code}/rounds/${round.id}/materials/${uid}` : null).value;
  if (!round.inventors.includes(uid)) return null;
  return (
    <div className="feira-material">
      <span className="eyebrow">{cfg.t.secretIcon} {cfg.t.secretEyebrow}</span>
      <strong>{mine ? cfg.secretName(mine.materialId) : "…"}</strong>
      <small>{cfg.t.secretHint}</small>
    </div>
  );
}

/** Avança a fase automaticamente (qualquer aparelho); a regra confere prazo e progresso. */
function useAutoAdvance(code: string, round: FeiraRound, due: boolean) {
  const last = useRef(0);
  useEffect(() => {
    if (!due || Date.now() - last.current < 2000) return;
    last.current = Date.now();
    void advanceFeira(code, round).catch(() => {});
  });
}

function Clock({ remaining, total }: { remaining: number; total: number }) {
  return (
    <div className={`alibi-ring${remaining <= 10 ? " urgent" : ""}`} style={{ width: 96, height: 96 }} role="timer" aria-label={`${remaining} segundos restantes`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring-track" cx="60" cy="60" r="54" />
        <circle className="ring-fill" cx="60" cy="60" r="54" strokeDasharray={339.3} strokeDashoffset={339.3 * (1 - remaining / total)} />
      </svg>
      <div className="ring-text">
        <strong>{remaining}</strong>
      </div>
    </div>
  );
}

/* ---------------- Online: invenções escritas ---------------- */

function OnlineRound({ ctx, round }: { ctx: MesaContext; round: FeiraOnlineRound }) {
  return (
    <>
      <Problem round={round} />
      {round.phase === "create" && <CreatePanel ctx={ctx} round={round} />}
      {round.phase === "vote" && <VotePanel ctx={ctx} round={round} />}
      {round.phase === "result" && <OnlineResult ctx={ctx} round={round} />}
    </>
  );
}

function CreatePanel({ ctx, round }: { ctx: MesaContext; round: FeiraOnlineRound }) {
  const cfg = usePitch();
  const { code, uid, offset, name } = ctx;
  const key = `feira.draft.${code}.${round.id}`;
  const [draft, setDraft] = useState<{ name: string; how: string; slogan: string }>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "") as { name: string; how: string; slogan: string };
    } catch {
      return { name: "", how: "", slogan: "" };
    }
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { remaining, expired } = useCountdown(deadline(round.startedAt, round.secs ?? cfg.seconds), offset);
  const inventor = round.inventors.includes(uid);
  const sent = round.submitted.includes(uid);
  const all = round.inventors.every((i) => round.submitted.includes(i));
  useAutoAdvance(code, round, all || expired);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(draft));
    } catch {
      /* rascunho opcional */
    }
  }, [key, draft]);
  const field = (k: "name" | "how" | "slogan", label: string, max: number, long = false) => (
    <div className="feira-field">
      <label htmlFor={`feira-${k}`}>{label}</label>
      {long ? (
        <textarea id={`feira-${k}`} maxLength={max} rows={3} value={draft[k]} disabled={sent || expired} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
      ) : (
        <input id={`feira-${k}`} maxLength={max} value={draft[k]} disabled={sent || expired} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
      )}
    </div>
  );
  return (
    <>
      <div className="planb-timer">
        <Clock remaining={remaining} total={round.secs ?? cfg.seconds} />
        <p className="muted-line">
          {round.submitted.length} de {round.inventors.length} {cfg.t.people} enviaram
        </p>
      </div>
      {inventor ? (
        <>
          <MyMaterial code={code} round={round} uid={uid} />
          {!sent ? (
            <div className="alibi-panel">
              {field("name", cfg.t.fields[0], 40)}
              {field("how", cfg.t.fields[1], 200, true)}
              {field("slogan", cfg.t.fields[2], 80)}
              {!expired && (
                <button
                  className="button primary"
                  disabled={busy || !draft.name.trim() || !draft.how.trim() || !draft.slogan.trim()}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await submitInvention(code, round.id, uid, draft);
                    } catch (e) {
                      setError(errorText(e));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Enviar {cfg.t.thing}
                </button>
              )}
              {expired && <p className="manual-feedback">⏱️ Tempo esgotado.</p>}
            </div>
          ) : (
            <p className="alibi-sent">✅ {cfg.t.Thing} enviad{cfg.t.thingGender}! Aguardando os outros {cfg.t.people}…</p>
          )}
        </>
      ) : (
        <p className="alibi-wait">
          🛒 Nesta rodada você é {round.voters.includes(uid) ? "quem compra" : "plateia"}. {round.inventors.map(name).join(" e ")} {cfg.t.creating}
        </p>
      )}
      {error && <Notice>{error}</Notice>}
    </>
  );
}

function VotePanel({ ctx, round }: { ctx: MesaContext; round: FeiraOnlineRound }) {
  const cfg = usePitch();
  const { code, uid, offset } = ctx;
  const entries = useLiveCollection<Entry>(`mesas/${code}/rounds/${round.id}/entries`).value;
  const mineAuthor = useLiveDoc<{ anon: string }>(round.inventors.includes(uid) ? `mesas/${code}/rounds/${round.id}/authorOf/${uid}` : null).value;
  const myVote = useLiveDoc<Vote>(round.voters.includes(uid) ? `mesas/${code}/rounds/${round.id}/votes/${uid}` : null).value;
  const { remaining, expired } = useCountdown(deadline(round.voteAt, FEIRA_VOTE_SECONDS), offset);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const all = round.voters.every((v) => round.voted.includes(v));
  useAutoAdvance(code, round, all || expired);
  const ordered = [...entries].sort((a, b) => (a.anon < b.anon ? -1 : 1));
  const canVote = round.voters.includes(uid) && !round.voted.includes(uid) && !expired;
  return (
    <>
      <div className="planb-timer">
        <Clock remaining={remaining} total={FEIRA_VOTE_SECONDS} />
        <p className="muted-line">
          {round.voted.length} de {round.voters.length} votaram
        </p>
      </div>
      <p className="stage-call soft">{round.voters.length === 1 ? `Qual ${cfg.t.thing} você compraria?` : `Vote n${cfg.t.thingGender} ${cfg.t.thing} favorit${cfg.t.thingGender} (não vale votar ${cfg.t.thingGender === "a" ? "na sua" : "no seu"}).`}</p>
      <div className="feira-entries">
        {ordered.map((e, i) => {
          const own = mineAuthor?.anon === e.anon;
          const chosen = myVote?.target === e.anon;
          return (
            <article key={e.anon} className={`feira-entry${own ? " own" : ""}${chosen ? " chosen" : ""}`}>
              <span className="eyebrow">{cfg.t.thing.toUpperCase()} {letter(i)}{own ? (cfg.t.thingGender === "a" ? " · A SUA" : " · O SEU") : ""}</span>
              <h3>{e.name}</h3>
              <p>{e.how}</p>
              <p className="feira-slogan">“{e.slogan}”</p>
              {canVote && !own && (
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await voteOnline(code, round, uid, e.anon);
                    } catch (err) {
                      setError(errorText(err));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {round.voters.length === 1 ? "Comprar esta" : "Votar nesta"}
                </button>
              )}
              {chosen && <p className="alibi-sent">✅ Seu voto</p>}
            </article>
          );
        })}
      </div>
      {!round.voters.includes(uid) && <p className="alibi-wait">Aguardando a votação…</p>}
      {round.voted.includes(uid) && <p className="alibi-sent">Voto registrado. Aguardando a turma…</p>}
      {error && <Notice>{error}</Notice>}
    </>
  );
}

function OnlineResult({ ctx, round }: { ctx: MesaContext; round: FeiraOnlineRound }) {
  const cfg = usePitch();
  const { code, name } = ctx;
  const base = `mesas/${code}/rounds/${round.id}`;
  const entriesQ = useLiveCollection<Entry>(`${base}/entries`);
  const authorsQ = useLiveCollection<Author>(`${base}/authors`);
  const votesQ = useLiveCollection<Vote>(`${base}/votes`);
  const entries = entriesQ.value;
  const authors = authorsQ.value;
  const votes = votesQ.value;
  const loaded = entriesQ.ready && authorsQ.ready && votesQ.ready;
  const materials = useLiveCollection<Material>(`${base}/materials`).value;
  const ref = useRef<HTMLDivElement>(null);
  const counts = Object.fromEntries(entries.map((e) => [e.anon, votes.filter((v) => v.target === e.anon).length]));
  const winners = topOf(counts);
  const voting = round.voters.length > 0 && entries.length >= 2;
  useEffect(() => {
    if (winners.length) burst(ref.current, 30);
  }, [winners.length]);
  const authorOf = (anon: string) => authors.find((a) => a.anon === anon)?.uid ?? "";
  const label = !loaded
    ? "Apurando…"
    : !entries.length
    ? `Ninguém enviou ${cfg.t.thing}`
    : !voting
      ? entries.length < 2 && round.voters.length
        ? `Menos de dois ${cfg.t.things}: sem votação`
        : `${cfg.t.Things} lado a lado`
      : !votes.length
        ? "Sem vencedor"
        : winners.length > 1
          ? `Empate: ${winners.map((w) => name(authorOf(w))).join(" e ")}`
          : `🏆 ${name(authorOf(winners[0]))} venceu!`;
  return (
    <>
      <div ref={ref} className={`alibi-stamp ${winners.length > 1 ? "stamp-empate" : winners.length ? "stamp-colou" : "stamp-sem-veredito"} manual-verdict`}>
        {label}
      </div>
      <div className="feira-entries">
        {[...entries]
          .sort((a, b) => (counts[b.anon] ?? 0) - (counts[a.anon] ?? 0))
          .map((e) => {
            const author = authorOf(e.anon);
            return (
              <article key={e.anon} className={`feira-entry${winners.includes(e.anon) ? " chosen" : ""}`}>
                <span className="eyebrow">
                  {name(author)} · {cfg.t.secretIcon} {cfg.secretName(materials.find((m) => m.uid === author)?.materialId)}
                </span>
                <h3>{e.name}</h3>
                <p>{e.how}</p>
                <p className="feira-slogan">“{e.slogan}”</p>
                {voting && <p className="planb-points">{counts[e.anon] ?? 0} voto(s)</p>}
              </article>
            );
          })}
      </div>
    </>
  );
}

/* ---------------- Presencial: apresentações ao vivo ---------------- */

function LiveRound({ ctx, round }: { ctx: MesaContext; round: FeiraLiveRound }) {
  const cfg = usePitch();
  const { code, uid, offset, name, host } = ctx;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const prep = useCountdown(deadline(round.startedAt, round.secs ?? cfg.seconds), offset);
  const vote = useCountdown(deadline(round.voteAt, FEIRA_LIVE_VOTE_SECONDS), offset);
  const presenter = round.inventors[round.current];
  const allVoted = round.audience.every((a) => round.pvoted.includes(a));
  useAutoAdvance(code, round, (round.phase === "prep" && prep.expired) || (round.phase === "vote" && (allVoted || vote.expired)));
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
  const presentStillHere = ctx.players.some((p) => p.uid === presenter);
  return (
    <>
      <Problem round={round} />
      {round.phase === "prep" && (
        <>
          <div className="planb-timer">
            <Clock remaining={prep.remaining} total={round.secs ?? cfg.seconds} />
            <p className="muted-line">
              {cfg.t.People}: <b>{round.inventors.map(name).join(", ")}</b>
            </p>
          </div>
          <MyMaterial code={code} round={round} uid={uid} />
          {!round.inventors.includes(uid) && <p className="alibi-wait">Os {cfg.t.people} estão se preparando. Você é da plateia!</p>}
        </>
      )}
      {(round.phase === "present" || round.phase === "vote") && (
        <>
          <div className="feira-stage" key={round.current}>
            <span className="feira-mic" aria-hidden="true">🎤</span>
            <h2>Hora de apresentar!</h2>
            <p>
              {presenter === uid ? "É a sua vez!" : `Agora: ${name(presenter)}`} <small>({round.current + 1} de {round.inventors.length})</small>
            </p>
          </div>
          <ol className="feira-order">
            {round.inventors.map((inv, i) => (
              <li key={inv} className={i === round.current ? "now" : i < round.current ? "done" : ""}>
                {name(inv)}
              </li>
            ))}
          </ol>
          {round.phase === "present" && round.inventors.includes(uid) && <MyMaterial code={code} round={round} uid={uid} />}
          {round.phase === "present" &&
            host &&
            (round.audience.length ? (
              <button className="button primary" disabled={busy} onClick={() => void run(() => hostLive(code, round, "openVote"))}>
                Abrir votação de {name(presenter)}
              </button>
            ) : (
              <button className="button primary" disabled={busy} onClick={() => void run(() => hostLive(code, round, "next"))}>
                {round.current + 1 < round.inventors.length ? `Próximo ${cfg.t.person}` : "Encerrar rodada"}
              </button>
            ))}
          {round.phase === "present" && host && round.audience.length > 0 && (
            <button className="text-button" disabled={busy} onClick={() => void run(() => hostLive(code, round, "next"))}>
              {presentStillHere ? "Pular apresentação" : `${name(presenter)} saiu — pular`}
            </button>
          )}
          {round.phase === "present" && !host && <p className="alibi-wait">Quando terminar, o anfitrião abre a votação.</p>}
          {round.phase === "vote" && (
            <>
              <div className="planb-timer">
                <Clock remaining={vote.remaining} total={FEIRA_LIVE_VOTE_SECONDS} />
                <p className="muted-line">
                  {round.pvoted.length} de {round.audience.length} votaram
                </p>
              </div>
              {round.audience.includes(uid) && !round.pvoted.includes(uid) && !vote.expired ? (
                <div className="vote-buttons">
                  <button className="vote-btn vote-colou" disabled={busy} onClick={() => void run(() => voteLive(code, round, uid, true))}>
                    <span aria-hidden="true">🛒</span>Compro
                  </button>
                  <button className="vote-btn vote-furado" disabled={busy} onClick={() => void run(() => voteLive(code, round, uid, false))}>
                    <span aria-hidden="true">🙅</span>Não compro
                  </button>
                </div>
              ) : (
                <p className="alibi-wait">{round.pvoted.includes(uid) ? "✅ Voto registrado." : `${cfg.t.People} não votam nesta rodada.`}</p>
              )}
            </>
          )}
        </>
      )}
      {round.phase === "result" && <LiveResult ctx={ctx} round={round} />}
      {error && <Notice>{error}</Notice>}
    </>
  );
}

function LiveResult({ ctx, round }: { ctx: MesaContext; round: FeiraLiveRound }) {
  const cfg = usePitch();
  const { code, name } = ctx;
  const base = `mesas/${code}/rounds/${round.id}`;
  const votesQ = useLiveCollection<PVote>(`${base}/pvotes`);
  const votes = votesQ.value;
  const materials = useLiveCollection<Material>(`${base}/materials`).value;
  const ref = useRef<HTMLDivElement>(null);
  const buys = Object.fromEntries(round.inventors.map((i) => [i, votes.filter((v) => v.inventor === i && v.buy).length]));
  const winners = topOf(buys);
  useEffect(() => {
    if (winners.length) burst(ref.current, 30);
  }, [winners.length]);
  const label = !votesQ.ready
    ? "Apurando…"
    : !round.audience.length
    ? "Apresentações encerradas"
    : !votes.length
      ? "Sem votação"
      : !winners.length
        ? "Ninguém comprou!"
        : winners.length > 1
          ? `Empate: ${winners.map(name).join(" e ")}`
          : `🏆 ${name(winners[0])} vendeu mais!`;
  return (
    <>
      <div ref={ref} className={`alibi-stamp ${winners.length > 1 ? "stamp-empate" : winners.length ? "stamp-colou" : "stamp-furado"} manual-verdict`}>
        {label}
      </div>
      <ul className="planb-results">
        {round.inventors.map((inv) => (
          <li key={inv}>
            <div className="planb-result-head">
              <b>
                {name(inv)} · {cfg.t.secretIcon} {cfg.secretName(materials.find((m) => m.uid === inv)?.materialId)}
              </b>
            </div>
            {round.audience.length > 0 && (
              <p className="planb-line">
                🛒 Compro: <b>{buys[inv]}</b> · 🙅 Não compro: <b>{votes.filter((v) => v.inventor === inv && !v.buy).length}</b>
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------- Placar: 1 ponto por vitória (empate: todos os vencedores pontuam) ---------------- */

function RoundWinners({ code, roundId, onWin }: { code: string; roundId: string; onWin: (id: string, w: string[]) => void }) {
  const base = `mesas/${code}/rounds/${roundId}`;
  const round = useLiveDoc<FeiraRound>(base).value;
  const done = round?.phase === "result";
  const online = round?.mode === "online";
  const votesQ = useLiveCollection<Vote>(done && online ? `${base}/votes` : null);
  const authorsQ = useLiveCollection<Author>(done && online ? `${base}/authors` : null);
  const pvotesQ = useLiveCollection<PVote>(done && !online ? `${base}/pvotes` : null);
  const votes = votesQ.value;
  const authors = authorsQ.value;
  const pvotes = pvotesQ.value;
  const loaded = online ? votesQ.ready && authorsQ.ready : pvotesQ.ready;
  useEffect(() => {
    if (!round || !done || !loaded) return;
    let winners: string[] = [];
    if (round.mode === "online") {
      const counts: Record<string, number> = {};
      for (const v of votes) counts[v.target] = (counts[v.target] ?? 0) + 1;
      winners = topOf(counts).map((anon) => authors.find((a) => a.anon === anon)?.uid ?? "").filter(Boolean);
    } else {
      const buys = Object.fromEntries(round.inventors.map((i) => [i, pvotes.filter((v) => v.inventor === i && v.buy).length]));
      winners = topOf(buys);
    }
    onWin(roundId, winners);
  }, [round, done, loaded, votes, authors, pvotes, roundId, onWin]);
  return null;
}

function FeiraScore({ ctx, final }: { ctx: MesaContext; final: boolean }) {
  const cfg = usePitch();
  const { code, room, name, players } = ctx;
  const [wins, setWins] = useState<Record<string, string[]>>({});
  const onWin = useRef((id: string, w: string[]) => setWins((prev) => (prev[id]?.join() === w.join() ? prev : { ...prev, [id]: w }))).current;
  const ids = Array.from({ length: room.roundNo }, (_, i) => roundIdOf(room.gameNo, i + 1));
  const score: Record<string, number> = Object.fromEntries(players.map((p) => [p.uid, 0]));
  for (const id of ids) for (const w of wins[id] ?? []) score[w] = (score[w] ?? 0) + 1;
  const ranking = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const top = ranking[0]?.[1] ?? 0;
  const champions = ranking.filter(([, s]) => s === top && top > 0).map(([pid]) => name(pid));
  return (
    <div className="planb-board">
      {ids.map((id) => (
        <RoundWinners key={id} code={code} roundId={id} onWin={onWin} />
      ))}
      <h3>{final ? "🏁 Placar final" : cfg.t.board}</h3>
      {final && (
        <div className={`alibi-stamp ${champions.length > 1 ? "stamp-empate" : "stamp-colou"}`}>
          {!champions.length ? "Sem vencedor" : champions.length > 1 ? `Empate: ${champions.join(" e ")}` : `${champions[0]} ${cfg.t.champion}`}
        </div>
      )}
      <ol className="planb-ranking">
        {ranking.map(([pid, s], i) => (
          <li key={pid}>
            <span className="ranking-position">{i + 1}</span>
            <b>{name(pid)}</b>
            <span className="planb-points">
              {s} vitória{s === 1 ? "" : "s"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
