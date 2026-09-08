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
  const [retry, setRetry] = useState(0);
  const { value: secrets, error } = useSecrets(path, retry);
  const complete = round.playerIds.every((id) =>
    secrets.some((s) => s.playerId === id),
  );
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!complete || shown >= secrets.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), 650);
    return () => clearTimeout(t);
  }, [shown, secrets.length, complete]);
  const sorted = secrets
    .filter((s) => round.playerIds.includes(s.playerId))
    .sort(
      (a, b) => a.number - b.number || a.playerId.localeCompare(b.playerId),
    );
  const correct = (id: string, i: number) =>
    complete &&
    secrets.find((s) => s.playerId === id)?.number === sorted[i]?.number;
  if (error || !complete)
    return (
      <>
        <div className="section-heading">
          <span className="eyebrow">RESULTADO DA RODADA</span>
          <h2>Aguardando os números de todos os jogadores</h2>
        </div>
        {error ? (
          <Notice>
            Não foi possível carregar a ordem geral. Tente novamente. Se
            persistir, confira se as regras publicadas no banco usado pelo jogo
            permitem ler todos os números quando a rodada está em RESULT.
          </Notice>
        ) : (
          <p role="status">
            Carregando o resultado completo de {round.playerIds.length}{" "}
            jogadores…
          </p>
        )}
        <button
          className="button secondary"
          onClick={() => {
            setShown(0);
            setRetry((n) => n + 1);
          }}
        >
          Carregar resultado novamente
        </button>
      </>
    );
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
                  const index = sorted.findIndex((x) => x.playerId === id);
                  const visible = index >= 0 && index < shown;
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
