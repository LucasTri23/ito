import * as game from "../services/game";
import type { Round, Player, Answer } from "../types/game";
import { SecretCard } from "./UI";
import { Ordering } from "./Ordering";
import { Result } from "./Result";
import { ThemeForm } from "./ThemeForm";
import { Presentation } from "./Presentation";
export interface StageProps {
  path: string;
  r: Round;
  host: boolean;
  uid: string;
  players: Player[];
  answers: Answer[];
  busy: boolean;
  run: (action: () => Promise<unknown>) => Promise<void>;
}
export function RoundContent({
  code,
  path,
  r,
  host,
  uid,
  players,
  answers,
  number,
  readyCount,
  busy,
  run,
}: StageProps & { code: string; number?: number; readyCount: number }) {
  return (
    <>
      {r.state === "WAITING_FOR_THEME" ? (
        host ? (
          <ThemeForm path={path} busy={busy} run={run} />
        ) : (
          <div className="center-state">
            <h2>O anfitrião está escolhendo o tema…</h2>
            <p>Prepare sua criatividade.</p>
          </div>
        )
      ) : (
        <>
          <div className="theme-heading">
            <span className="eyebrow">TEMA DA RODADA</span>
            <h2>{r.theme}</h2>
            <div className="scale">
              <span>1 · {r.lowLabel}</span>
              <span className="scale-line" />
              <span>{r.highLabel} · 100</span>
            </div>
          </div>
          {r.state !== "RESULT" && <SecretCard key={path} number={number} />}
          {r.state === "DISTRIBUTING_NUMBERS" && (
            <div className="center-state">
              <h3>Distribuindo um pouquinho de mistério…</h3>
              <p>
                {readyCount} de {r.playerIds.length} números prontos.
              </p>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => void run(() => game.drawSecret(path!, uid))}
              >
                Tentar receber meu número novamente
              </button>
            </div>
          )}
          {r.state === "PRESENTING" && (
            <Presentation
              path={path}
              r={r}
              host={host}
              uid={uid}
              players={players}
              answers={answers}
              busy={busy}
              run={run}
            />
          )}
          {(r.state === "ORDERING" || r.state === "READY_FOR_RESULT") && (
            <>
              <h3>
                {r.state === "ORDERING"
                  ? "Qual vocês acham que é a ordem?"
                  : "Ordem confirmada. Prontos para descobrir?"}
              </h3>
              <p>
                {host
                  ? "Organize do menor para o maior. Arraste ou use as setas."
                  : "Conversem com o anfitrião. A ordem é atualizada para todos."}
              </p>
              <Ordering
                order={r.groupOrder}
                answers={answers}
                editable={host && r.state === "ORDERING"}
                busy={busy}
                onChange={(ids) => void run(() => game.setOrder(path!, ids))}
              />
              {host && (
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={() =>
                    void run(() =>
                      game.setPhase(
                        path!,
                        r.state === "ORDERING" ? "READY_FOR_RESULT" : "RESULT",
                      ),
                    )
                  }
                >
                  {r.state === "ORDERING"
                    ? "Confirmar ordem"
                    : "Mostrar resultado 👀"}
                </button>
              )}
            </>
          )}
          {r.state === "RESULT" && (
            <>
              <Result key={path} path={path!} round={r} answers={answers} />
              {host ? (
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await game.newRound(code, players);
                    })
                  }
                >
                  Próxima rodada →
                </button>
              ) : (
                <p className="waiting">Aguardando a próxima rodada…</p>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
