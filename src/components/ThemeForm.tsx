import { useState } from "react";
import * as game from "../services/game";
import type { StageProps } from "./RoundContent";
export function ThemeForm({
  path,
  busy,
  run,
}: Pick<StageProps, "path" | "busy" | "run">) {
  const [theme, setTheme] = useState("");
  const [low, setLow] = useState("");
  const [high, setHigh] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() =>
          game.startTheme(
            path!,
            theme.trim(),
            low.trim() || "Pouco",
            high.trim() || "Muito",
          ),
        );
      }}
    >
      <span className="eyebrow">VOCÊ DÁ O TOM</span>
      <h2>Qual é o tema da rodada?</h2>
      <p>Escolha algo que possa ir de um extremo ao outro.</p>
      <label htmlFor="theme">Tema</label>
      <input
        id="theme"
        required
        maxLength={120}
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Ex.: coisas que melhoram uma segunda-feira"
      />
      <div className="two-fields">
        <div>
          <label htmlFor="low">1 significa</label>
          <input
            id="low"
            maxLength={40}
            value={low}
            onChange={(e) => setLow(e.target.value)}
            placeholder="Quase nada"
          />
        </div>
        <div>
          <label htmlFor="high">100 significa</label>
          <input
            id="high"
            maxLength={40}
            value={high}
            onChange={(e) => setHigh(e.target.value)}
            placeholder="Salvou meu dia"
          />
        </div>
      </div>
      <button className="button primary" disabled={busy || !theme.trim()}>
        Começar rodada →
      </button>
    </form>
  );
}
