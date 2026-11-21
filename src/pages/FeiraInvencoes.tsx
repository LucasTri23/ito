import { useEffect, useRef, useState } from "react";
import { MesaShell, type MesaContext } from "../components/MesaShell";
import { Notice } from "../components/UI";
import { useCountdown, useLiveCollection, useLiveDoc } from "../hooks/useMesa";
import { byJoin, newMatch, roundIdOf, setMesaOption } from "../services/mesa";
import {
  advanceFeira,
  feira,
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
import { FEIRA_LIVE_VOTE_SECONDS, FEIRA_SECONDS, FEIRA_VOTE_SECONDS } from "../utils/feira";

type Material = { uid: string; materialId: string };
type Author = { anon: string; uid: string };
type Vote = { uid: string; target: string };
type PVote = { id: string; inventor: string; voter: string; buy: boolean };
const materialName = (id?: string) => feira.materials.find((m) => m.id === id)?.name ?? "…";
const problemText = (id: string) => feira.problems.find((p) => p.id === id)?.text ?? "";
const letter = (i: number) => String.fromCharCode(65 + i);
const deadline = (t: { toMillis(): number } | null | undefined, s: number) => (t ? ({ toMillis: () => t.toMillis() + s * 1000 } as never) : null);

export function FeiraInvencoes() {
  return (
    <MesaShell
      game="feira"
      route="feira-de-invencoes"
      title="Feira de Invenções"
      badge="💡"
      tone="tone-mint"
      eyebrow="ONLINE OU PRESENCIAL · 2 A 8 JOGADORES"
      pitch="A sala recebe um problema engraçado. Cada inventor recebe um material diferente em segredo e tem 45 segundos para inventar um produto que use esse material. Vale função absurda!"
      steps={[
        ["🤔", "Um problema para resolver"],
        ["🧰", "Um material secreto para cada inventor"],
        ["🛒", "A turma escolhe o que compraria"],
      ]}
      note="No modo online, as invenções são escritas e votadas no site. No presencial, cada inventor apresenta em voz alta e a plateia vota “Compro” ou “Não compro” pelo celular."
    >
      {(ctx) => <FeiraTable ctx={ctx} />}
    </MesaShell>
  );
}

function FeiraTable({ ctx }: { ctx: MesaContext }) {
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
                ["online", "✍️ Online · Invenções escritas", "Cada inventor escreve nome, funcionamento e slogan. A turma vota no site."],
                ["presencial", "🎤 Presencial · Apresentações ao vivo", "Os inventores apresentam em voz alta; a plateia vota “Compro” ou “Não compro”."],
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
              <span>Inventores por rodada:</span>
              {[2, 3].map((n) => (
                <button key={n} type="button" className={`manual-piece${(room.inventors ?? 2) === n ? " selected" : ""}`} disabled={!host || busy || room.roundNo > 0} onClick={() => void run(() => setMesaOption(code, { inventors: n }))}>
                  {n}
                </button>
              ))}
            </div>
          )}
          <p className="muted-line">
            {players.length >= 2 ? `${count} inventor${count > 1 ? "es" : ""} por rodada · ${FEIRA_ROUNDS} rodadas.` : ""} {!host && "O anfitrião escolhe o modo."}
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
  return (
    <>
      <span className="eyebrow">
        RODADA {round.no} DE {FEIRA_ROUNDS} · PROBLEMA DA FEIRA
      </span>
      <h2 className="alibi-situation">{problemText(round.problemId)}</h2>
    </>
  );
}

function MyMaterial({ code, round, uid }: { code: string; round: FeiraRound; uid: string }) {
  const mine = useLiveDoc<Material>(round.inventors.includes(uid) ? `mesas/${code}/rounds/${round.id}/materials/${uid}` : null).value;
  if (!round.inventors.includes(uid)) return null;
  return (
    <div className="feira-material">
      <span className="eyebrow">🧰 SEU MATERIAL SECRETO</span>
      <strong>{materialName(mine?.materialId)}</strong>
      <small>Ele precisa fazer parte da invenção.</small>
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
  const { remaining, expired } = useCountdown(deadline(round.startedAt, FEIRA_SECONDS), offset);
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
        <Clock remaining={remaining} total={FEIRA_SECONDS} />
        <p className="muted-line">
          {round.submitted.length} de {round.inventors.length} inventores enviaram
        </p>
      </div>
      {inventor ? (
        <>
          <MyMaterial code={code} round={round} uid={uid} />
          {!sent ? (
            <div className="alibi-panel">
              {field("name", "Nome do produto", 40)}
              {field("how", "Como funciona", 200, true)}
              {field("slogan", "Slogan", 80)}
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
                  Enviar invenção
                </button>
              )}
              {expired && <p className="manual-feedback">⏱️ Tempo esgotado.</p>}
            </div>
          ) : (
            <p className="alibi-sent">✅ Invenção enviada! Aguardando os outros inventores…</p>
          )}
        </>
      ) : (
        <p className="alibi-wait">
          🛒 Nesta rodada você é {round.voters.includes(uid) ? "quem compra" : "plateia"}. {round.inventors.map(name).join(" e ")} estão inventando…
        </p>
      )}
      {error && <Notice>{error}</Notice>}
    </>
  );
}

function VotePanel({ ctx, round }: { ctx: MesaContext; round: FeiraOnlineRound }) {
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
      <p className="stage-call soft">{round.voters.length === 1 ? "Qual invenção você compraria?" : "Vote na sua invenção favorita (não vale votar na sua)."}</p>
      <div className="feira-entries">
        {ordered.map((e, i) => {
          const own = mineAuthor?.anon === e.anon;
          const chosen = myVote?.target === e.anon;
          return (
            <article key={e.anon} className={`feira-entry${own ? " own" : ""}${chosen ? " chosen" : ""}`}>
              <span className="eyebrow">INVENÇÃO {letter(i)}{own ? " · A SUA" : ""}</span>
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
    ? "Ninguém enviou invenção"
    : !voting
      ? entries.length < 2 && round.voters.length
        ? "Menos de duas invenções: sem votação"
        : "Invenções lado a lado"
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
                  {name(author)} · 🧰 {materialName(materials.find((m) => m.uid === author)?.materialId)}
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
  const { code, uid, offset, name, host } = ctx;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const prep = useCountdown(deadline(round.startedAt, FEIRA_SECONDS), offset);
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
            <Clock remaining={prep.remaining} total={FEIRA_SECONDS} />
            <p className="muted-line">
              Inventores: <b>{round.inventors.map(name).join(", ")}</b>
            </p>
          </div>
          <MyMaterial code={code} round={round} uid={uid} />
          {!round.inventors.includes(uid) && <p className="alibi-wait">Os inventores estão se preparando. Você é da plateia!</p>}
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
                {round.current + 1 < round.inventors.length ? "Próximo inventor" : "Encerrar rodada"}
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
                <p className="alibi-wait">{round.pvoted.includes(uid) ? "✅ Voto registrado." : "Inventores não votam nesta rodada."}</p>
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
                {name(inv)} · 🧰 {materialName(materials.find((m) => m.uid === inv)?.materialId)}
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
      <h3>{final ? "🏁 Placar final" : "Placar da feira"}</h3>
      {final && (
        <div className={`alibi-stamp ${champions.length > 1 ? "stamp-empate" : "stamp-colou"}`}>
          {!champions.length ? "Sem vencedor" : champions.length > 1 ? `Empate: ${champions.join(" e ")}` : `${champions[0]} é o inventor do ano!`}
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
