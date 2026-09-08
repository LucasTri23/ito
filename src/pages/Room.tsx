import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, Crown, LogOut, Users } from "lucide-react";
import {
  useRoom,
  usePlayers,
  useRound,
  useAnswers,
  useSecret,
  useReady,
} from "../hooks/useFirestore";
import * as game from "../services/game";
import { errorText } from "../utils/game";
import { Notice } from "../components/UI";
import { RoundContent } from "../components/RoundContent";
export function RoomPage({ uid }: { uid: string }) {
  const { code: raw = "" } = useParams();
  const code = raw.toUpperCase();
  const nav = useNavigate();
  const room = useRoom(code);
  const [joined, setJoined] = useState(false);
  const players = usePlayers(joined ? code : null);
  const round = useRound(code, joined ? room.value?.currentRoundId || "" : "");
  const path = round.value
    ? game.roundPath(code, room.value!.currentRoundId)
    : null;
  const answers = useAnswers(path);
  const secret = useSecret(path, uid);
  const ready = useReady(path);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const automatic = useRef(false);
  const r = round.value;
  const host = room.value?.hostId === uid;
  const current = r?.presentationOrder[r.currentPresentationIndex];
  const run = useCallback(async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    setJoined(false);
    void game
      .joinRoom(
        code,
        uid,
        localStorage.getItem("entrelinhas.name") || "Visitante",
      )
      .then(() => {
        if (active) {
          setJoined(true);
          localStorage.setItem("entrelinhas.room", code);
        }
      })
      .catch((e) => {
        if (active) setError(errorText(e));
      });
    return () => {
      active = false;
    };
  }, [code, uid]);
  useEffect(() => {
    if (!joined) return;
    const online = () => void game.presence(code, uid, true).catch(() => {});
    const offline = () => void game.presence(code, uid, false).catch(() => {});
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    window.addEventListener("pagehide", offline);
    online();
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      window.removeEventListener("pagehide", offline);
    };
  }, [joined, code, uid]);
  useEffect(() => {
    if (
      r?.state === "DISTRIBUTING_NUMBERS" &&
      path &&
      r.playerIds.includes(uid)
    )
      void game.drawSecret(path, uid).catch((e) => setError(errorText(e)));
  }, [r?.state, r?.playerIds, path, uid]);
  useEffect(() => {
    if (!host || !path || !r || automatic.current) return;
    const action =
      r.state === "DISTRIBUTING_NUMBERS" &&
      r.playerIds.every((id) => ready.value.some((p) => p.uid === id))
        ? () => game.startPresenting(path, r.playerIds)
        : r.state === "PRESENTING" &&
            answers.value.some((a) => a.playerId === current)
          ? () => game.advance(path)
          : null;
    if (action) {
      automatic.current = true;
      void action()
        .catch((e) => setError(errorText(e)))
        .finally(() => {
          automatic.current = false;
        });
    }
  }, [host, path, r, ready.value, answers.value, current]);
  const issue =
    error ||
    room.error ||
    players.error ||
    round.error ||
    answers.error ||
    secret.error ||
    ready.error;
  if (room.loading)
    return <div className="center-state">Conectando à sala…</div>;
  if (!room.value || room.value.status === "CLOSED")
    return (
      <div className="center-state">
        <h1>
          {room.value ? "A sala foi encerrada." : "Não encontramos essa sala."}
        </h1>
        <p>{issue || "Confira o código com seus amigos."}</p>
        <button className="button primary" onClick={() => nav("/")}>
          Voltar ao início
        </button>
      </div>
    );
  return (
    <div className="room-page">
      <div className="room-top">
        <div>
          <span className="eyebrow">
            {r ? `RODADA ${room.value.roundNo}` : "PREPARE A TURMA"}
          </span>
          <h1>{r ? "Cada pista conta." : "Todo mundo por aqui?"}</h1>
        </div>
        <button
          className="room-code"
          onClick={() =>
            void run(async () => {
              await navigator.clipboard.writeText(code);
              setCopied(true);
            })
          }
        >
          <span>SALA PRIVADA</span>
          <b>{code}</b>
          <Copy size={18} />
          <small>{copied ? "Copiado!" : "Copiar código"}</small>
        </button>
      </div>
      {issue && <Notice>{issue}</Notice>}
      <div className="game-grid">
        <aside className="panel participants">
          <h3>
            <Users size={19} /> Na sala <span>{players.value.length}/8</span>
          </h3>
          {players.value.map((p, i) => (
            <div className="player" key={p.uid}>
              <span className={`avatar avatar-${i % 4}`}>
                {p.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <b>
                  {p.name}
                  {p.uid === uid ? " (você)" : ""}
                </b>
                <small>
                  {p.uid === room.value?.hostId
                    ? "Anfitrião"
                    : p.connected
                      ? "Na sala"
                      : "Possivelmente ausente"}
                </small>
              </div>
              {p.uid === room.value?.hostId ? (
                <Crown size={17} />
              ) : host && !r ? (
                <button
                  className="text-button"
                  disabled={busy}
                  onClick={() => void run(() => game.removePlayer(code, p.uid))}
                  aria-label={`Remover ${p.name}`}
                >
                  ×
                </button>
              ) : null}
            </div>
          ))}
          <div className="aside-note">
            Conversem por voz, chamada ou pessoalmente. As pistas aparecem aqui.
          </div>
          <button
            className="text-button"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await game.presence(code, uid, false);
                localStorage.removeItem("entrelinhas.room");
                nav("/");
              })
            }
          >
            <LogOut size={15} /> Sair da sala
          </button>
          {host && (
            <button
              className="text-button danger"
              disabled={busy}
              onClick={() => void run(() => game.closeRoom(code))}
            >
              Encerrar sala
            </button>
          )}
        </aside>
        <section className="panel game-panel">
          {!joined ? (
            <p>Recuperando sua sessão…</p>
          ) : !r ? (
            <div className="lobby-content">
              <span className="large-spark">✳</span>
              <span className="pill">A MELHOR PARTE É JOGAR JUNTO</span>
              <h2>
                Uma turma.
                <br />
                Muitos pontos de vista.
              </h2>
              <p>
                Compartilhe o código da sala e espere seus amigos.
                <br />
                Precisamos de 2 a 8 pessoas para começar.
              </p>
              {host ? (
                <button
                  className="button primary"
                  disabled={
                    busy || players.value.length < 2 || players.value.length > 8
                  }
                  onClick={() =>
                    void run(() => game.newRound(code, players.value))
                  }
                >
                  Iniciar rodada →
                </button>
              ) : (
                <p className="waiting">
                  Aguardando o anfitrião iniciar a rodada…
                </p>
              )}
            </div>
          ) : (
            <RoundContent
              key={path}
              code={code}
              path={path!}
              r={r}
              host={host}
              uid={uid}
              players={players.value}
              answers={answers.value}
              number={secret.value?.number}
              readyCount={ready.value.length}
              busy={busy}
              run={run}
            />
          )}
          {busy && (
            <p role="status" className="saving">
              Salvando…
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
