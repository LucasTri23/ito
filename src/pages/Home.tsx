import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Users,
  Hash,
  Sparkles,
  MoveRight,
} from "lucide-react";
import { configured } from "../lib/firebase";
import { createRoom, joinRoom } from "../services/game";
import { errorText } from "../utils/game";
import { Notice } from "../components/UI";
export function Home({ uid, authError }: { uid?: string; authError: string }) {
  const nav = useNavigate();
  const [name, setName] = useState(
    localStorage.getItem("entrelinhas.name") || "",
  );
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "IN_PERSON">("ONLINE");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function enter(create: boolean) {
    setError("");
    if (!name.trim()) {
      setError("Como seus amigos devem chamar você?");
      return;
    }
    if (!uid) {
      setError(
        "A conexão ainda não está pronta. Confira a configuração do Firebase.",
      );
      return;
    }
    setBusy(create ? "create" : "join");
    try {
      const id = create
        ? await createRoom(uid, name.trim(), mode)
        : code.trim().toUpperCase();
      if (!create) await joinRoom(id, uid, name.trim());
      localStorage.setItem("entrelinhas.name", name.trim());
      localStorage.setItem("entrelinhas.room", id);
      nav(`/room/${id}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <section className="home-grid">
        <div className="hero">
          <span className="pill">
            <span className="green-dot" /> POUCAS REGRAS. MUITAS INTERPRETAÇÕES.
          </span>
          <h1>
            Vocês estão na
            <br />
            mesma <span className="serif">sintonia?</span>
            <span className="asterisk">✳</span>
          </h1>
          <p className="hero-copy">
            Um número secreto. Uma pista criativa.
            <br />E seus amigos tentando ligar os pontos.
          </p>
          <div
            className="hero-art"
            aria-label="Exemplo: pistas ordenadas do menor ao maior"
          >
            <div className="orbit" />
            <div className="playing-card card-one">
              <span>UMA PISTA</span>
              <b>
                Acampar
                <br />
                na chuva
              </b>
              <i>14</i>
            </div>
            <div className="playing-card card-two">
              <span>UMA PISTA</span>
              <b>
                Uma casinha
                <br />
                na serra
              </b>
              <i>58</i>
            </div>
            <div className="playing-card card-three">
              <span>UMA PISTA</span>
              <b>
                Férias nas
                <br />
                Maldivas
              </b>
              <i>92</i>
            </div>
            <span className="art-note">cada um tem seu ponto de vista ↗</span>
            <span className="art-spark">✧</span>
          </div>
          <div className="hero-meta">
            <span>
              <Users size={17} /> 2–8 jogadores
            </span>
            <span>◷ 10–20 min</span>
            <span>♡ 100% entre amigos</span>
          </div>
        </div>
        <div className="entry-card">
          <fieldset className="mode-picker">
            <legend>Como vocês vão jogar?</legend>
            <label>
              <input
                type="radio"
                name="mode"
                checked={mode === "ONLINE"}
                onChange={() => setMode("ONLINE")}
              />{" "}
              Online
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                checked={mode === "IN_PERSON"}
                onChange={() => setMode("IN_PERSON")}
              />{" "}
              Presencial
            </label>
          </fieldset>
          {mode === "IN_PERSON" && (
            <p>
              Todo mundo junto? Entre na sala e receba sua carta. A conversa
              acontece na mesa.
            </p>
          )}
          <span className="eyebrow">BORA JOGAR?</span>
          <h2>
            A próxima boa história
            <br />
            começa aqui.
          </h2>
          <p>Chame a turma. O resto é conexão.</p>
          <label htmlFor="name">Seu nome</label>
          <input
            id="name"
            maxLength={24}
            autoComplete="nickname"
            placeholder="Como a turma te chama?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            disabled={!!busy || !configured || !uid}
            className="button primary"
            onClick={() => void enter(true)}
          >
            <Plus size={19} />
            {busy === "create" ? "Criando sala…" : "Criar uma sala"}
            <ArrowRight size={19} />
          </button>
          <div className="divider">
            <span>já tem um convite?</span>
          </div>
          <label htmlFor="code">Código da sala</label>
          <div className="code-input">
            <Hash size={19} />
            <input
              id="code"
              maxLength={5}
              placeholder="EX.: XK72A"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <button
            disabled={!!busy || !code.trim() || !configured || !uid}
            className="button secondary"
            onClick={() => void enter(false)}
          >
            {busy === "join" ? "Entrando…" : "Entrar na sala"}
            <ArrowRight size={19} />
          </button>
          <small>
            <span className="green-dot" /> Sem cadastro. Sem complicação.
          </small>
          {(error || authError) && <Notice>{error || authError}</Notice>}
          {!configured && (
            <Notice>
              Para abrir salas, configure o Firebase no arquivo .env. O passo a
              passo está no README.
            </Notice>
          )}
          {localStorage.getItem("entrelinhas.room") && (
            <button
              className="text-button"
              onClick={() =>
                nav(`/room/${localStorage.getItem("entrelinhas.room")}`)
              }
            >
              Voltar à última sala →
            </button>
          )}
        </div>
      </section>
      <section className="how">
        <div className="section-heading">
          <span className="eyebrow">A GRAÇA ESTÁ NAS ENTRELINHAS</span>
          <h2>Fácil de aprender. Difícil de concordar.</h2>
        </div>
        <div className="steps">
          <article>
            <span className="step-icon peach">
              01 <Hash />
            </span>
            <h3>Receba seu número</h3>
            <p>
              De 1 a 100, só você sabe qual é.
              <br />
              Guarde esse segredo.
            </p>
          </article>
          <article>
            <span className="step-icon lilac">
              02 <Sparkles />
            </span>
            <h3>Transforme em uma pista</h3>
            <p>
              Use o tema da rodada para dar uma
              <br />
              resposta à altura do seu número.
            </p>
          </article>
          <article>
            <span className="step-icon mint">
              03 <MoveRight />
            </span>
            <h3>Encontrem a ordem</h3>
            <p>
              Conversem, organizem as pistas e<br />
              descubram se a intuição bateu.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
