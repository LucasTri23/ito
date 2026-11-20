import { Link } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUpRight,
  AudioLines,
  Dices,
  Drama,
  Fingerprint,
  Hash,
  ListOrdered,
  Sparkles,
  Spade,
  Heart,
  CircleHelp,
} from "lucide-react";
import { resetPointer, trackPointer } from "../utils/fx";
import "../motion.css";

interface Choice {
  to: string;
  tone: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  badge?: string;
  setup: string;
}

const choices: Choice[] = [
  {
    to: "/entrelinhas",
    tone: "grape",
    icon: <AudioLines size={36} />,
    eyebrow: "ONLINE OU PRESENCIAL",
    title: "Entrelinhas",
    text: "Números secretos, pistas e muita sintonia. Crie uma sala e reúna os amigos.",
    cta: "Entrar no jogo",
    setup: "2 a 8 pessoas online · um aparelho por pessoa",
  },
  {
    to: "/alibi-furado",
    tone: "coral",
    icon: <Fingerprint size={36} />,
    eyebrow: "ONLINE · 2 A 8 JOGADORES",
    title: "Álibi Furado",
    text: "Dois suspeitos, uma história e perguntas que colocam a memória à prova.",
    cta: "Abrir o jogo",
    badge: "Novo",
    setup: "2 a 8 pessoas · um aparelho por pessoa",
  },
  {
    to: "/quem-sou-eu",
    tone: "mint",
    icon: <Drama size={36} />,
    eyebrow: "PRESENCIAL · 1 JOGADOR",
    title: "Quem sou eu?",
    text: "Um nome, uma breve explicação e a diversão na mesa. É só escolher a categoria e sortear.",
    cta: "Sortear um nome",
    setup: "Em grupo · um aparelho para conduzir",
  },
  {
    to: "/eu-duvido",
    tone: "peach",
    icon: <Hash size={36} />,
    eyebrow: "PRESENCIAL · COM OU SEM ADM",
    title: "Eu duvido!",
    text: "Quanto mede? Quantos tem? Aposte no seu palpite e descubra números que surpreendem.",
    cta: "Arriscar um palpite",
    setup: "Em grupo · um aparelho para todos",
  },
  {
    to: "/top-10",
    tone: "sky",
    icon: <ListOrdered size={36} />,
    eyebrow: "PRESENCIAL · COM OU SEM ADM",
    title: "Top 10",
    text: "Séries, bilheterias, games e nomes. Um tema para tentar lembrar os dez primeiros.",
    cta: "Descobrir o ranking",
    setup: "Em grupo · um aparelho para todos",
  },
];

// Peças decorativas que flutuam atrás do título, cada uma num ritmo.
const floaters = [
  { icon: <Dices size={30} />, className: "f1" },
  { icon: <Spade size={24} />, className: "f2" },
  { icon: <CircleHelp size={26} />, className: "f3" },
  { icon: <Sparkles size={22} />, className: "f4" },
  { icon: <Heart size={22} />, className: "f5" },
  { icon: <Hash size={24} />, className: "f6" },
];

export function GameHub() {
  return (
    <section className="game-hub">
      <div className="hub-floaters" aria-hidden="true">
        {floaters.map((f) => (
          <span key={f.className} className={`floater ${f.className}`}>
            {f.icon}
          </span>
        ))}
      </div>
      <span className="pill hub-pill">
        <span className="live-dot" aria-hidden="true" /> A TURMA JÁ CHEGOU?
      </span>
      <h1>
        Hoje a gente joga <span className="shine">o quê?</span>
      </h1>
      <p>Escolha a brincadeira. As boas histórias vêm depois.</p>
      <p className="press-start" aria-hidden="true">▶ Escolha um jogo para começar</p>
      <div className="game-choices">
        {choices.map((choice, index) => (
          <Link
            key={choice.to}
            to={choice.to}
            className={`game-choice tone-${choice.tone}`}
            style={{ "--i": index } as CSSProperties}
            onPointerMove={trackPointer}
            onPointerLeave={resetPointer}
          >
            {choice.badge && <span className="choice-badge">{choice.badge}</span>}
            <span className="choice-icon">{choice.icon}</span>
            <span className="eyebrow">{choice.eyebrow}</span>
            <h2>{choice.title}</h2>
            <p>{choice.text}</p>
            <small>{choice.setup}</small>
            <strong>
              {choice.cta} <ArrowUpRight size={20} />
            </strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
