import { useState } from "react";
import { AudioLines } from "lucide-react";

export function FlipCard({ number }: { number?: number }) {
  const [hidden, setHidden] = useState(false);
  const ready = number !== undefined;
  return (
    <button
      type="button"
      className={`big-card ${ready ? "dealt" : "waiting-card"} ${hidden ? "card-hidden" : ""}`}
      disabled={!ready}
      aria-label={
        !ready
          ? "Recebendo carta"
          : hidden
            ? "Mostrar meu número"
            : `Seu número é ${number}. Toque para esconder.`
      }
      onClick={() => setHidden(!hidden)}
    >
      <span className="big-card-rotator">
        <span className="big-card-back" aria-hidden="true">
          <span>ENTRELINHAS</span>
          <AudioLines size={100} strokeWidth={1} />
          <span>UM NÚMERO. MIL POSSIBILIDADES.</span>
        </span>
        <span className="big-card-front" aria-hidden="true">
          <span className="card-corner">
            {number}
            <span>✳</span>
          </span>
          <span className="card-center">
            <span>SEU NÚMERO</span>
            <strong>{number}</strong>
            <span>SÓ VOCÊ SABE</span>
          </span>
          <span className="card-corner bottom">
            {number}
            <span>✳</span>
          </span>
        </span>
      </span>
    </button>
  );
}
