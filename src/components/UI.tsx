import { useState, type ReactNode } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
export function Brand() {
  return (
    <a href="#/" className="brand">
      <Logo size={44} />
      <span className="brand-name">Jogatina</span>
    </a>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const help = pathname.startsWith("/anuncios-biblicos")
    ? ["Cada pessoa entra pelo próprio aparelho. O anfitrião escolhe no lobby: anúncios escritos (online) ou apresentações ao vivo (presencial).", "Todos recebem o mesmo objeto de um relato bíblico, com o link para ler no jw.org. Cada vendedor recebe um estilo de anúncio secreto e tem 40 segundos.", "No online, a turma vota no anúncio favorito sem saber o autor. No presencial, a plateia vota “Compro” ou “Não compro” depois de cada apresentação."]
    : pathname.startsWith("/alibi-furado")
    ? ["Cada pessoa entra na sala pelo próprio aparelho. Escolha online ou presencial ao criar a sala.", "Dois suspeitos combinam uma história em 30 segundos. No presencial, um se afasta enquanto o outro responde em voz alta; depois trocam.", "No presencial com quatro ou mais pessoas, o investigador pode fazer uma pergunta extra aos dois. Em trio o investigador decide; com mais pessoas, o júri vota no site."]
    : pathname === "/entrelinhas" || pathname.startsWith("/room/")
      ? ["Entre na sala com a turma. No modo online, cada pessoa usa seu aparelho.", "Cada pessoa recebe um número secreto e dá uma pista para o tema.", "A turma organiza as pistas e revela os números. No modo presencial, a sala distribui cartas para usar na mesa."]
      : pathname === "/quem-sou-eu"
        ? ["Escolha uma categoria e sorteie um nome.", "Uma pessoa conduz a brincadeira e mostra as dicas aos poucos para a turma tentar adivinhar."]
        : pathname === "/eu-duvido"
          ? ["Escolha se todos jogam ou se alguém será o ADM.", "Sorteie uma pergunta, deem palpites em voz alta e revelem o número para ver quem chegou mais perto."]
          : pathname === "/top-10"
            ? ["Escolha se todos jogam ou se alguém será o ADM.", "Sorteie um tema e tentem lembrar os dez itens antes de revelar a lista.", "Confira o período e o critério mostrados na carta."]
            : null;
  return (
    <>
      <header>
        <Brand />
        <div className="header-actions">
          <span className="header-note">
            <span className="insert-coin">Insira uma ficha</span>{" "}
            <span className="green-dot" />
          </span>
          <ThemeToggle />
        </div>
      </header>
      <nav className="game-tabs" aria-label="Escolher jogo">
        <NavLink to="/" end>
          Jogos
        </NavLink>
        <NavLink to="/entrelinhas">Entrelinhas</NavLink>
        <NavLink to="/alibi-furado">Álibi Furado</NavLink>
        <NavLink to="/plano-b">Plano B</NavLink>
        <NavLink to="/manual-desmontado">Manual Desmontado</NavLink>
        <NavLink to="/feira-de-invencoes">Feira de Invenções</NavLink>
        <NavLink to="/anuncios-biblicos">Anúncios bíblicos</NavLink>
        <NavLink to="/quem-sou-eu">Quem sou eu</NavLink>
        <NavLink to="/eu-duvido">Eu duvido</NavLink>
        <NavLink to="/top-10">Top 10</NavLink>
      </nav>
      <main>
        {help && <details className="game-help"><summary>Como jogar?</summary><ol>{help.map(step => <li key={step}>{step}</li>)}</ol></details>}
        {children}
      </main>
      <footer>
        <span>Entre amigos, tudo ganha outro sentido.</span>
        <span className="credits">
          Créditos <b>99</b> · feito para jogar junto <ArrowUpRight size={14} />
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
