import { useEffect, useState } from "react";
import { Shuffle, Sparkles, ExternalLink, Lightbulb } from "lucide-react";
import {
  identities,
  identityCategories,
  type IdentityCategory,
  type Identity,
} from "../data/whoAmI";
import { drawIdentity } from "../utils/whoAmI";

function IdentityHints({ identity }: { identity: Identity }) {
  const [revealed, setRevealed] = useState(0);
  const levels = ["Difícil", "Média", "Fácil"];
  return (
    <div className="identity-hints">
      <p className="hint-intro">
        Dê uma ajuda de cada vez. As dicas ficam mais fáceis.
      </p>
      <ol id="identity-hint-list" aria-live="polite" aria-relevant="additions">
        {identity.hints.slice(0, revealed).map((hint, index) => (
          <li key={index} className={`hint-level-${index}`}>
            <span>
              Dica {index + 1} · {levels[index]}
            </span>
            <p>{hint}</p>
          </li>
        ))}
      </ol>
      <button
        className="button hint-button"
        aria-controls="identity-hint-list"
        disabled={revealed === 3}
        onClick={() => setRevealed((count) => Math.min(3, count + 1))}
      >
        <Lightbulb size={18} aria-hidden="true" />
        {revealed === 3
          ? "Todas as dicas reveladas"
          : `Mostrar dica ${revealed + 1} · ${levels[revealed]}`}
      </button>
      <span className="hint-count">{revealed} de 3 dicas reveladas</span>
    </div>
  );
}

interface Session {
  category: IdentityCategory;
  current?: string;
  seen: string[];
}
function restore(): Session {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem("entrelinhas.who") || "null",
    );
    if (
      saved &&
      typeof saved === "object" &&
      "category" in saved &&
      "seen" in saved
    ) {
      const category = identityCategories.find(
        (c) => c.id === saved.category,
      )?.id;
      if (category && Array.isArray(saved.seen))
        return {
          category,
          seen: saved.seen.filter(
            (id): id is string =>
              typeof id === "string" &&
              identities.some((i) => i.id === id && i.category === category),
          ),
          current:
            "current" in saved &&
            identities.some(
              (i) => i.id === saved.current && i.category === category,
            )
              ? String(saved.current)
              : undefined,
        };
    }
  } catch {
    /* Start a new local game if saved data is unavailable. */
  }
  return { category: "characters", seen: [] };
}
export function WhoAmI() {
  const [session, setSession] = useState<Session>(restore);
  useEffect(() => {
    try {
      localStorage.setItem("entrelinhas.who", JSON.stringify(session));
    } catch {
      /* Playing does not require storage. */
    }
  }, [session]);
  const current = identities.find((item) => item.id === session.current);
  const category = identityCategories.find((c) => c.id === session.category)!;
  return (
    <section className="who-page">
      <span className="pill">PRESENCIAL · 1 JOGADOR · SEM SALA</span>
      <h1>
        Quem <span>sou eu?</span>
      </h1>
      <p className="who-intro">
        Escolha uma categoria e sorteie. O nome e a explicação aparecem aqui no
        seu aparelho.
      </p>
      <fieldset className="identity-categories">
        <legend>O que vamos sortear?</legend>
        {identityCategories.map((c) => (
          <label
            key={c.id}
            className={session.category === c.id ? "selected" : ""}
          >
            <input
              type="radio"
              name="identity-category"
              value={c.id}
              checked={session.category === c.id}
              onChange={() => setSession({ category: c.id, seen: [] })}
            />
            <span className="category-symbol" aria-hidden="true">
              {c.icon}
            </span>
            <b>{c.label}</b>
            <small>{c.detail}</small>
          </label>
        ))}
      </fieldset>
      <article
        className={`identity-card identity-${session.category}`}
        key={session.current ?? session.category}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="eyebrow">{category.label}</span>
        {current ? (
          <>
            <h2>{current.name}</h2>
            <details className="identity-about">
              <summary>Sobre este nome</summary>
              <p>{current.description}</p>
            </details>
            {current.source && (
              <a
                className="identity-source"
                href={current.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ler sobre {current.name} no jw.org <ExternalLink size={14} />
              </a>
            )}
            <IdentityHints key={current.id} identity={current} />
          </>
        ) : (
          <>
            <Sparkles size={54} strokeWidth={1.2} />
            <h2>Quem vem por aí?</h2>
            <p>Seu próximo nome está a um sorteio de distância.</p>
          </>
        )}
      </article>
      <button
        className="button primary identity-draw"
        onClick={() =>
          setSession((previous) => {
            const next = drawIdentity(
              previous.category,
              previous.seen,
              previous.current,
            );
            return {
              category: previous.category,
              current: next.entry.id,
              seen: next.seen,
            };
          })
        }
      >
        <Shuffle size={19} />
        {current ? "Sortear outro nome" : "Sortear nome"}
      </button>
      <p className="who-footnote">
        {identities.filter((i) => i.category === session.category).length}{" "}
        opções nesta categoria · Sem repetir até completar a lista.
      </p>
      {session.category === "bible" && (
        <p className="who-footnote bible-bibliography">
          Para conhecer as histórias:{" "}
          <a
            href="https://www.jw.org/pt/biblioteca/livros/historias-biblicas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meu Livro de Histórias Bíblicas
          </a>
          {" · "}
          <a
            href="https://www.jw.org/pt/biblioteca/livros/ande-corajosamente-com-deus/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ande Corajosamente com Deus
          </a>
          .
        </p>
      )}
    </section>
  );
}
