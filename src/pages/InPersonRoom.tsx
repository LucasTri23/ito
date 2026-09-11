import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import type { Room } from "../types/game";
import { useInPersonCard } from "../hooks/useFirestore";
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
  const card = useInPersonCard(joined ? code : null, uid);
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
    if (!joined) return;
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
  const number = card.value && card.value.deal === room.deal ? card.value.number : undefined;
  return (
    <section className="in-person-room">
      <div className="in-person-heading">
        <span className="eyebrow">MODO PRESENCIAL · SALA {code}</span>
        <h1>Sua carta. Seu segredo.</h1>
        <p>Distribuição {room.deal} · A conversa fica por conta de vocês.</p>
      </div>
      {(error || card.error) && (
        <Notice>
          {error || card.error} Atualize a página para tentar receber sua carta
          novamente.
        </Notice>
      )}
      <FlipCard key={`${room.deal}-${number ?? "waiting"}`} number={number} />
      <p className="card-hint">
        {number
          ? "Toque na carta para esconder ou mostrar."
          : "Preparando sua carta…"}
      </p>
      {room.hostId === uid && (
        <button
          className="button primary redeal-button"
          disabled={busy || !joined || number === undefined}
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
          {busy ? "Reenviando…" : "Reenviar cartas"}
        </button>
      )}
    </section>
  );
}
