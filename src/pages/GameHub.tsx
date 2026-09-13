import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  AudioLines,
  Drama,
  Hash,
  ListOrdered,
} from "lucide-react";

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
      <div className="game-choices party-choices">
        <Link to="/nem-a-pato" className="game-choice number-choice">
          <span className="choice-icon">
            <Hash size={36} />
          </span>
          <span className="eyebrow">PRESENCIAL · COM OU SEM ADM</span>
          <h2>Nem a pato!</h2>
          <p>
            Quanto mede? Quantos tem? Aposte no seu palpite e descubra números
            que surpreendem.
          </p>
          <strong>
            Arriscar um palpite <ArrowUpRight size={20} />
          </strong>
        </Link>
        <Link to="/top-10" className="game-choice ranking-choice">
          <span className="choice-icon">
            <ListOrdered size={36} />
          </span>
          <span className="eyebrow">PRESENCIAL · COM OU SEM ADM</span>
          <h2>Top 10</h2>
          <p>
            Séries, bilheterias, games e nomes. Um tema para tentar lembrar os
            dez primeiros.
          </p>
          <strong>
            Descobrir o ranking <ArrowUpRight size={20} />
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
