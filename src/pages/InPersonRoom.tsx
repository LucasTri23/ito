import { useEffect, useState } from "react";
import { RotateCw, Users, Crown } from "lucide-react";
import type { Room } from "../types/game";
import { useInPersonCard, usePlayers } from "../hooks/useFirestore";
import { joinRoom } from "../services/game";
import { receiveCard, redeal } from "../services/inPerson";
import { errorText } from "../utils/game";
import { Notice } from "../components/UI";
import { FlipCard } from "../components/FlipCard";

export function InPersonRoom({
  code,
  uid,
  room,
}: {
  code: string;
  uid: string;
  room: Room;
}) {
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lobby = (room.deal ?? 0) === 0;
  const players = usePlayers(joined && lobby ? code : null);
  const card = useInPersonCard(joined && !lobby ? code : null, uid);
  useEffect(() => {
    let active = true;
    void joinRoom(
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
    if (!joined || !room.deal) return;
    let active = true;
    const receive = () => {
      setError("");
      void receiveCard(code, uid).catch((e) => {
        if (active) setError(errorText(e));
      });
    };
    receive();
    window.addEventListener("online", receive);
    return () => {
      active = false;
      window.removeEventListener("online", receive);
    };
  }, [joined, code, uid, room.deal]);
  const number =
    card.value && card.value.deal === room.deal ? card.value.number : undefined;
  return (
    <section className="in-person-room">
      <div className="in-person-heading">
        <span className="eyebrow">MODO PRESENCIAL · SALA {code}</span>
        <h1>{lobby ? "Todo mundo na mesa?" : "Sua carta. Seu segredo."}</h1>
        <p>
          {lobby
            ? "Compartilhe o código e espere a turma entrar."
            : `Distribuição ${room.deal} · A conversa fica por conta de vocês.`}
        </p>
      </div>
      {(error || card.error || players.error) && (
        <Notice>
          {error || card.error || players.error} Atualize a página para tentar
          receber sua carta novamente.
        </Notice>
      )}
      {lobby ? (
        <div className="panel in-person-lobby">
          <span className="eyebrow">CÓDIGO DA SALA</span>
          <strong className="lobby-code">{code}</strong>
          <h3>
            <Users size={18} /> No saguão · {players.value.length}
          </h3>
          <ul className="lobby-players">
            {players.value.map((player, i) => (
              <li key={player.uid}>
                <span className={`avatar avatar-${i % 4}`}>
                  {player.name.slice(0, 1).toUpperCase()}
                </span>
                <span>
                  {player.name}
                  {player.uid === uid ? " (você)" : ""}
                </span>
                {player.uid === room.hostId && (
                  <span className="lobby-host">
                    <Crown size={14} /> Anfitrião
                  </span>
                )}
              </li>
            ))}
          </ul>
          {!players.value.length && (
            <p role="status">Carregando participantes…</p>
          )}
          <p>
            {room.hostId === uid
              ? "Quando todos estiverem aqui, envie as cartas."
              : "Aguardando o anfitrião enviar as cartas…"}
          </p>
        </div>
      ) : (
        <>
          <FlipCard
            key={`${room.deal}-${number ?? "waiting"}`}
            number={number}
          />
          <p className="card-hint">
            {number
              ? "Toque na carta para esconder ou mostrar."
              : "Preparando sua carta…"}
          </p>
        </>
      )}
      {room.hostId === uid && (
        <button
          className="button primary redeal-button"
          disabled={
            busy ||
            !joined ||
            (!lobby && number === undefined) ||
            (lobby && players.value.length < 2)
          }
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              await redeal(code);
            } catch (e) {
              setError(errorText(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          <RotateCw size={18} />
          {busy ? "Enviando…" : lobby ? "Enviar cartas" : "Reenviar cartas"}
        </button>
      )}
      {lobby && room.hostId === uid && players.value.length < 2 && (
        <p className="card-hint">
          Aguardando pelo menos mais uma pessoa entrar.
        </p>
      )}
    </section>
  );
}
