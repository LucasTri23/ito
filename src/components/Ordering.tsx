import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import type { Answer } from "../types/game";
export function Ordering({
  order,
  answers,
  editable,
  busy,
  onChange,
}: {
  order: string[];
  answers: Answer[];
  editable: boolean;
  busy: boolean;
  onChange: (ids: string[]) => void;
}) {
  const [drag, setDrag] = useState<string | null>(null);
  function move(id: string, target: number) {
    const next = order.filter((x) => x !== id);
    next.splice(target, 0, id);
    onChange(next);
  }
  return (
    <ol className="answer-list">
      {order.map((id, i) => {
        const a = answers.find((x) => x.playerId === id);
        return (
          <li
            key={id}
            draggable={editable && !busy}
            onDragStart={() => setDrag(id)}
            onDragOver={(e) => {
              if (editable) e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (editable && drag && !busy) move(drag, i);
              setDrag(null);
            }}
          >
            <span className="rank">{i + 1}</span>
            <div>
              <b>{a?.playerName || "Jogador"}</b>
              <p>{a?.answer || "Sem resposta"}</p>
            </div>
            {editable && (
              <div className="move-buttons">
                <GripVertical size={18} />
                <button
                  aria-label={`Mover ${a?.playerName} para cima`}
                  disabled={busy || i === 0}
                  onClick={() => move(id, i - 1)}
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  aria-label={`Mover ${a?.playerName} para baixo`}
                  disabled={busy || i === order.length - 1}
                  onClick={() => move(id, i + 1)}
                >
                  <ArrowDown size={17} />
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
