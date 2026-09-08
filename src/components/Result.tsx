import { useEffect, useState } from "react";
import { useSecrets } from "../hooks/useFirestore";
import type { Answer, Round } from "../types/game";
import { Notice } from "./UI";
export function Result({
  path,
  round,
  answers,
}: {
  path: string;
  round: Round;
  answers: Answer[];
}) {
  const { value: secrets, error } = useSecrets(path);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= secrets.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), 650);
    return () => clearTimeout(t);
  }, [shown, secrets.length]);
  const sorted = [...secrets].sort(
    (a, b) => a.number - b.number || a.playerId.localeCompare(b.playerId),
  );
  const correct = (id: string, i: number) =>
    secrets.find((s) => s.playerId === id)?.number === sorted[i]?.number;
  return (
    <>
      <div className="section-heading">
        <span className="eyebrow">HORA DA VERDADE 👀</span>
        <h2>
          {shown < secrets.length
            ? "Vamos ligar os pontos…"
            : `${round.groupOrder.filter(correct).length} de ${round.playerIds.length} posições em sintonia!`}
        </h2>
        <button
          className="text-button"
          onClick={() => setShown(secrets.length)}
        >
          Revelar tudo
        </button>
      </div>
      {error && <Notice>{error}</Notice>}
      {!secrets.length && <p>Carregando os números revelados…</p>}
      <div className="result-grid">
        {[round.groupOrder, sorted.map((s) => s.playerId)].map(
          (ids, column) => (
            <section key={column}>
              <h3>{column === 0 ? "O que vocês acharam" : "Ordem real"}</h3>
              <ol className="answer-list">
                {ids.map((id, i) => {
                  const a = answers.find((x) => x.playerId === id);
                  const secret = secrets.find((x) => x.playerId === id);
                  const visible =
                    sorted.findIndex((x) => x.playerId === id) < shown;
                  return (
                    <li key={id} className={visible ? "revealed" : ""}>
                      <span className="rank">{i + 1}</span>
                      <div>
                        <b>{a?.playerName}</b>
                        <p>{a?.answer}</p>
                        {visible && column === 0 && (
                          <small>
                            {correct(id, i)
                              ? "✓ Posição correta"
                              : "↔ Posição diferente"}
                          </small>
                        )}
                      </div>
                      <strong className="result-number">
                        {visible ? secret?.number : "?"}
                      </strong>
                    </li>
                  );
                })}
              </ol>
            </section>
          ),
        )}
      </div>
    </>
  );
}
