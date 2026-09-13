import { Link } from "react-router-dom";
import { ArrowUpRight, AudioLines, Drama } from "lucide-react";

export function GameHub() {
  const previous = localStorage.getItem("entrelinhas.room");
  return (
    <section className="game-hub">
      <span className="pill">A TURMA JÁ CHEGOU?</span>
      <h1>
        Hoje a gente joga <span>o quê?</span>
      </h1>
      <p>Escolha a brincadeira. As boas histórias vêm depois.</p>
      <div className="game-choices">
        <Link to="/entrelinhas" className="game-choice">
          <span className="choice-icon">
            <AudioLines size={36} />
          </span>
          <span className="eyebrow">ONLINE OU PRESENCIAL</span>
          <h2>Entrelinhas</h2>
          <p>
            Números secretos, pistas e muita sintonia. Crie uma sala e reúna os
            amigos.
          </p>
          <strong>
            Entrar no jogo <ArrowUpRight size={20} />
          </strong>
        </Link>
        <Link to="/quem-sou-eu" className="game-choice who-choice">
          <span className="choice-icon">
            <Drama size={36} />
          </span>
          <span className="eyebrow">PRESENCIAL · 1 JOGADOR</span>
          <h2>Quem sou eu?</h2>
          <p>
            Um nome, uma breve explicação e a diversão na mesa. É só escolher a
            categoria e sortear.
          </p>
          <strong>
            Sortear um nome <ArrowUpRight size={20} />
          </strong>
        </Link>
      </div>
      {previous && /^[A-HJ-NP-Z2-9]{5}$/.test(previous) && (
        <Link className="text-button" to={`/room/${previous}`}>
          Voltar à sala {previous} →
        </Link>
      )}
    </section>
  );
}
