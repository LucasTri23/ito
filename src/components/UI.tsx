import { useState, type ReactNode } from "react";
import { ArrowUpRight, Dices, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NavLink } from "react-router-dom";
export function Brand() {
  return (
    <a href="#/" className="brand">
      <span className="brand-icon">
        <Dices size={25} />
      </span>
      Jogatina
      <span className="brand-dot" aria-hidden="true">
        ✳
      </span>
    </a>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <Brand />
        <div className="header-actions">
          <span className="header-note">
            Jogos pra jogar com a turma <span className="green-dot" />
          </span>
          <ThemeToggle />
        </div>
      </header>
      <nav className="game-tabs" aria-label="Escolher jogo">
        <NavLink to="/" end>
          Jogos
        </NavLink>
        <NavLink to="/entrelinhas">Entrelinhas</NavLink>
        <NavLink to="/quem-sou-eu">Quem sou eu</NavLink>
        <NavLink to="/nem-a-pato">Nem a pato</NavLink>
        <NavLink to="/top-10">Top 10</NavLink>
      </nav>
      <main>{children}</main>
      <footer>
        <span>Entre amigos, tudo ganha outro sentido.</span>
        <span>
          FEITO PARA JOGAR JUNTO <ArrowUpRight size={14} />
        </span>
      </footer>
    </>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="notice">
      {children}
    </div>
  );
}
export function SecretCard({ number }: { number?: number }) {
  const [visible, setVisible] = useState(true);
  return (
    <div className="secret-card">
      <div>
        <span className="eyebrow">SEU NÚMERO · SÓ VOCÊ VÊ</span>
        <strong>{visible ? (number ?? "…") : "••"}</strong>
        <span>Não conte para ninguém 👀</span>
      </div>
      <button className="button secondary" onClick={() => setVisible(!visible)}>
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}{" "}
        {visible ? "Esconder número" : "Ver meu número"}
      </button>
    </div>
  );
}
