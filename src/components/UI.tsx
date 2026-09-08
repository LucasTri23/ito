import { useState, type ReactNode } from "react";
import { ArrowUpRight, AudioLines, Eye, EyeOff } from "lucide-react";
export function Brand() {
  return (
    <a href="#/" className="brand">
      <span className="brand-icon">
        <AudioLines size={25} />
      </span>
      entrelinhas
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
        <span className="header-note">
          Um jogo de sintonia coletiva <span className="green-dot" />
        </span>
      </header>
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
