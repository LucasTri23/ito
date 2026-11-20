import { useEffect, useReducer, useRef, useState } from "react";
import {
  Eye,
  Shuffle,
  Users,
  Crown,
  Hash,
  ListOrdered,
  ExternalLink,
} from "lucide-react";
import {
  numberTopics,
  rankingTopics,
  type PartyTopic,
} from "../data/partyGames";
import {
  drawPartyTopic,
  initialPartyState,
  partyReducer,
} from "../utils/partyGames";
import { burst, prefersReducedMotion } from "../utils/fx";
import "../motion.css";

export function PartyAnswer({
  topic,
  visible,
}: {
  topic: PartyTopic;
  visible: boolean;
}) {
  if (!visible)
    return (
      <p className="party-locked">Façam seus palpites antes de revelar.</p>
    );
  return (
    <div className="party-answer" aria-live="polite">
      {topic.kind === "number" ? (
        <>
          <span className="eyebrow">A RESPOSTA É</span>
          <strong className="party-answer-number">{topic.answer}</strong>
        </>
      ) : (
        <ol className="party-ranking" aria-label="Top 10 revelado">
          {topic.items.map((item, index) => (
            <li key={item.name}>
              <span className="ranking-position" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.value}</small>
              </div>
            </li>
          ))}
        </ol>
      )}
      <p className="party-note">{topic.note}</p>
      <div className="party-sources">
        {topic.sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.label} <ExternalLink size={13} />
          </a>
        ))}
        <small>Conferido em {topic.checkedAt}</small>
      </div>
    </div>
  );
}
export function PartyGame({ game }: { game: "number" | "ranking" }) {
  const [state, dispatch] = useReducer(partyReducer, initialPartyState);
  const topics = game === "number" ? numberTopics : rankingTopics;
  const current = topics.find((topic) => topic.id === state.currentId);
  const categories = [
    "Todas",
    ...new Set(topics.map((topic) => topic.category)),
  ];
  const count = topics.filter(
    (topic) => state.category === "Todas" || topic.category === state.category,
  ).length;
  const isRanking = game === "ranking";
  // Roleta: perguntas passam rápido no card antes do sorteio de verdade.
  const [rolling, setRolling] = useState<string | null>(null);
  const rollTimer = useRef<number | undefined>(undefined);
  const cardRef = useRef<HTMLElement>(null);
  useEffect(() => () => window.clearInterval(rollTimer.current), []);
  const draw = () => {
    const pick = () => dispatch({ type: "draw", ...drawPartyTopic(topics, state) });
    if (prefersReducedMotion()) return pick();
    const pool = topics.filter(
      (topic) => state.category === "Todas" || topic.category === state.category,
    );
    let ticks = 0;
    window.clearInterval(rollTimer.current);
    rollTimer.current = window.setInterval(() => {
      ticks += 1;
      setRolling(pool[Math.floor(Math.random() * pool.length)]?.question ?? "…");
      if (ticks >= 9) {
        window.clearInterval(rollTimer.current);
        setRolling(null);
        pick();
      }
    }, 75);
  };
  const reveal = () => {
    dispatch({ type: "reveal" });
    burst(cardRef.current, isRanking ? 36 : 28);
  };
  return (
    <section className={`who-page party-page party-${game}`}>
      <span className="pill">PRESENCIAL · A TURMA TODA NA MESA</span>
      <h1>
        {isRanking ? (
          <>
            Top <span>10</span>
          </>
        ) : (
          <>
            Nem a <span>pato!</span>
          </>
        )}
      </h1>
      <p className="who-intro">
        {isRanking
          ? "Um tema, dez respostas. Quantas vocês conseguem lembrar?"
          : "Números surpreendentes e palpites sem medo. Quem chega mais perto?"}
      </p>
      <fieldset className="party-modes">
        <legend>Como vocês vão jogar?</legend>
        <label className={state.mode === "everyone" ? "selected" : ""}>
          <input
            type="radio"
            name="party-mode"
            checked={state.mode === "everyone"}
            onChange={() => dispatch({ type: "mode", mode: "everyone" })}
          />
          <Users size={22} aria-hidden="true" />
          <strong>Geral joga</strong>
          <small>A resposta aparece só quando vocês clicarem.</small>
        </label>
        <label className={state.mode === "admin" ? "selected" : ""}>
          <input
            type="radio"
            name="party-mode"
            checked={state.mode === "admin"}
            onChange={() => dispatch({ type: "mode", mode: "admin" })}
          />
          <Crown size={22} aria-hidden="true" />
          <strong>Temos ADM</strong>
          <small>Quem comanda já vê o tema e a resposta.</small>
        </label>
      </fieldset>
      <div className="party-filter">
        <label htmlFor="party-category">Assunto</label>
        <select
          id="party-category"
          value={state.category}
          onChange={(event) =>
            dispatch({ type: "category", category: event.target.value })
          }
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <span>{count} temas</span>
      </div>
      {state.mode === "admin" && (
        <p className="party-admin-note">
          Tela de quem comanda: leia o tema para a turma e confira os palpites
          aqui.
        </p>
      )}
      <article
        ref={cardRef}
        className={`identity-card party-card${rolling ? " party-rolling" : ""}`}
        key={rolling ? "rolling" : (current?.id ?? state.category)}
      >
        {rolling ? (
          <>
            <span className="eyebrow party-roll-label">
              <Shuffle size={14} /> SORTEANDO…
            </span>
            <h2>{rolling}</h2>
          </>
        ) : current ? (
          <>
            <span className="eyebrow">{current.category}</span>
            <h2>{current.question}</h2>
            <p className="party-scope">{current.scope}</p>
            <PartyAnswer topic={current} visible={state.revealed} />
            {!state.revealed && (
              <button
                className="button secondary party-reveal"
                onClick={reveal}
              >
                <Eye size={18} />
                {isRanking ? "Revelar top 10" : "Revelar resposta"}
              </button>
            )}
          </>
        ) : (
          <>
            {isRanking ? <ListOrdered size={54} /> : <Hash size={54} />}
            <h2>Valendo um palpite?</h2>
            <p>
              Sorteie um tema para começar.{" "}
              {state.mode === "admin"
                ? "A resposta já virá aberta."
                : "A resposta fica escondida até vocês revelarem."}
            </p>
          </>
        )}
      </article>
      <button
        className="button primary identity-draw"
        onClick={draw}
        disabled={rolling !== null}
      >
        <Shuffle size={19} />
        {current ? "Sortear outro tema" : "Sortear tema"}
      </button>
      <p className="who-footnote">
        Sem repetir até completar a categoria. Os palpites são dados em voz
        alta.
      </p>
      {isRanking && (
        <p className="who-footnote">
          Vale o período e o critério escritos na carta. Os rankings são
          retratos salvos, não listas ao vivo.
        </p>
      )}
    </section>
  );
}
