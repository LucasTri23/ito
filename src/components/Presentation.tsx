import { useState } from "react";
import * as game from "../services/game";
import { Ordering } from "./Ordering";
import type { StageProps } from "./RoundContent";
export function Presentation({
  path,
  r,
  host,
  uid,
  players,
  answers,
  busy,
  run,
}: StageProps) {
  const [answer, setAnswer] = useState("");
  const current = r.presentationOrder[r.currentPresentationIndex];
  const me = players.find((p) => p.uid === uid);
  return (
    <>
      <span className="eyebrow">ORDEM DE APRESENTAÇÃO</span>
      <div className="presentation-order">
        {r.presentationOrder.map((id, i) => (
          <span key={id} className={current === id ? "active" : ""}>
            {i + 1}. {players.find((p) => p.uid === id)?.name}
          </span>
        ))}
      </div>
      <h3>É a vez de {players.find((p) => p.uid === current)?.name}</h3>
      <p>
        {r.currentPresentationIndex + 1} de {r.playerIds.length} jogadores
      </p>
      {current === uid && !answers.some((a) => a.playerId === uid) && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await game.submitAnswer(path!, me!, answer.trim());
              setAnswer("");
            });
          }}
        >
          <label htmlFor="answer">Sua resposta</label>
          <input
            id="answer"
            required
            maxLength={100}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Dê uma pista, sem contar seu número"
          />
          <button className="button primary" disabled={busy || !answer.trim()}>
            Confirmar resposta
          </button>
        </form>
      )}
      {host && (
        <button
          className="text-button"
          disabled={busy}
          onClick={() =>
            void run(async () => {
              if (!answers.some((a) => a.playerId === current)) {
                const p = players.find((p) => p.uid === current)!;
                await game.submitAnswer(
                  path!,
                  p,
                  "Sem pista — jogador pulado",
                  true,
                );
              }
              await game.advance(path!);
            })
          }
        >
          Pular jogador / avançar →
        </button>
      )}
      <h3>Pistas na mesa</h3>
      {answers.length ? (
        <Ordering
          order={r.presentationOrder.filter((id) =>
            answers.some((a) => a.playerId === id),
          )}
          answers={answers}
          editable={false}
          busy={busy}
          onChange={() => {}}
        />
      ) : (
        <p>A primeira pista já vem aí.</p>
      )}
    </>
  );
}
