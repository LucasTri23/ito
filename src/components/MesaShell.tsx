import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { configured } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { useMesa } from "../hooks/useMesa";
import { errorText } from "../utils/game";
import { Notice } from "./UI";
import {
  byJoin,
  enterMesa,
  leaveMesa,
  MESA_MAX,
  MESA_MIN,
  type MesaGame,
  type MesaPlayer,
  type MesaRoom,
} from "../services/mesa";
import "../mesa.css";

export interface MesaContext {
  code: string;
  uid: string;
  room: MesaRoom;
  players: MesaPlayer[];
  host: boolean;
  offset: number;
  name: (uid: string) => string;
}

interface Props {
  game: MesaGame;
  route: string; // ex.: "plano-b"
  title: string;
  badge: string; // emoji
  tone: string; // classe de cor: tone-coral etc.
  eyebrow: string;
  pitch: string;
  steps: [string, string][]; // [emoji, texto]
  note?: string;
  createOptions?: Partial<Pick<MesaRoom, "mode" | "inventors">>;
  children: (ctx: MesaContext) => ReactNode;
}

export function MesaShell(props: Props) {
  const { code: routeCode } = useParams();
  const code = (routeCode || "").toUpperCase();
  const nav = useNavigate();
  const { user, error: authError } = useAuth();
  const storeKey = `mesa.${props.game}`;
  const [name, setName] = useState(() => localStorage.getItem("mesa.name") || "");
  const [inputCode, setInputCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const mesa = useMesa(code, user?.uid);
  const room = mesa.room;
  const link = `${window.location.href.split("#")[0]}#/${props.route}/${code}`;
  const nameOf = (uid: string) => mesa.players.find((p) => p.uid === uid)?.name || "Jogador que saiu";

  async function enter(create: boolean) {
    if (!user) return setError("Aguardando conexão com o Firebase.");
    setBusy(true);
    setError("");
    try {
      const joined = await enterMesa(props.game, user.uid, name, create ? null : code || inputCode, props.createOptions);
      localStorage.setItem("mesa.name", name.trim());
      localStorage.setItem(storeKey, joined);
      nav(`/${props.route}/${joined}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function leave() {
    if (!user || !room) return;
    const others = mesa.players.filter((p) => p.uid !== user.uid);
    const heir = room.hostId === user.uid && others.length ? byJoin(others)[0]?.name : "";
    const msg = others.length === 0 ? "Tem certeza? Você é a última pessoa e a sala vai ficar vazia." : heir ? `Tem certeza? ${heir} vai virar o anfitrião.` : "Tem certeza que deseja sair da sala?";
    if (!window.confirm(msg)) return;
    setBusy(true);
    try {
      await leaveMesa(code, user.uid, mesa.players);
      localStorage.removeItem(storeKey);
      nav(`/${props.route}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const copy = () => {
    if (!navigator.clipboard) return setError("Não foi possível copiar. Selecione o link e copie manualmente.");
    void navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => setError("Não foi possível copiar. Selecione o link e copie manualmente."));
  };

  const inRoom = Boolean(code && mesa.member && room && user);
  const previous = localStorage.getItem(storeKey);
  return (
    <section className={`entry-card alibi-page mesa-page ${props.tone}${inRoom ? " in-room" : ""}`}>
      <div className="alibi-head">
        <span className="alibi-badge mesa-badge" aria-hidden="true">{props.badge}</span>
        <div>
          <span className="eyebrow">{props.eyebrow}</span>
          <h1>{props.title}</h1>
        </div>
      </div>
      {!inRoom && (
        <>
          <p className="alibi-pitch">{props.pitch}</p>
          <ol className="alibi-how">
            {props.steps.map(([icon, text]) => (
              <li key={text}>
                <span aria-hidden="true">{icon}</span>
                {text}
              </li>
            ))}
          </ol>
          {props.note && <p className="muted-line">{props.note}</p>}
          {code && mesa.member === false && <p className="muted-line">Você recebeu um convite para a sala <b>{code}</b>.</p>}
          <div className="alibi-entry">
            <label htmlFor={`${props.game}-name`}>Seu apelido</label>
            <input id={`${props.game}-name`} value={name} maxLength={24} placeholder="Como a turma te chama?" onChange={(e) => setName(e.target.value)} />
            {!code && (
              <button className="button primary" disabled={busy || !configured || !user} onClick={() => void enter(true)}>
                Criar sala
              </button>
            )}
            {!code && <div className="divider">ou entre com um código</div>}
            {!code && (
              <>
                <label htmlFor={`${props.game}-code`}>Código da sala</label>
                <input id={`${props.game}-code`} className="code-field" maxLength={5} value={inputCode} placeholder="EX.: XK72A" onChange={(e) => setInputCode(e.target.value.toUpperCase())} />
              </>
            )}
            <button className={`button ${code ? "primary" : "secondary"}`} disabled={busy || !configured || !user || (!code && !inputCode)} onClick={() => void enter(false)}>
              {code ? `Entrar na sala ${code}` : "Entrar na sala"}
            </button>
            {!code && previous && (
              <button className="text-button" onClick={() => nav(`/${props.route}/${previous}`)}>
                Voltar à última sala ({previous}) →
              </button>
            )}
          </div>
        </>
      )}
      {inRoom && room && user && (
        <>
          <div className="alibi-ticket">
            <div>
              <span className="eyebrow">CÓDIGO DA SALA</span>
              <strong className="alibi-code">{code}</strong>
            </div>
            <div className="alibi-capacity">
              <span>
                {mesa.players.length} de {MESA_MAX} jogadores
              </span>
              <span className="capacity-bar" aria-hidden="true">
                <i style={{ width: `${(mesa.players.length / MESA_MAX) * 100}%` }} />
              </span>
            </div>
          </div>
          <ul className="alibi-players">
            {byJoin(mesa.players).map((p, i) => (
              <li key={p.uid} className={`alibi-player${p.uid === user.uid ? " is-me" : ""}${p.connected ? "" : " is-away"}`}>
                <span className={`avatar avatar-${i % 4}`} aria-hidden="true">{p.name.trim().charAt(0).toUpperCase()}</span>
                <strong>{p.name}</strong>
                {p.uid === room.hostId && <span className="player-tag host-tag">👑 anfitrião</span>}
                {p.uid === user.uid && <span className="player-tag me-tag">você</span>}
                {!p.connected && <span className="player-tag away-tag">sem conexão</span>}
              </li>
            ))}
          </ul>
          {room.phase === "lobby" && (
            <div className="alibi-invite">
              <label htmlFor={`${props.game}-link`}>Link de convite</label>
              <div className="invite-row">
                <input id={`${props.game}-link`} value={link} readOnly onFocus={(e) => e.currentTarget.select()} />
                <button className={`button secondary${copied ? " copied" : ""}`} onClick={copy}>
                  {copied ? "✅ Link copiado!" : "Copiar convite"}
                </button>
              </div>
            </div>
          )}
          {room.phase === "lobby" && mesa.players.length < MESA_MIN && (
            <p className="alibi-wait">
              {MESA_MIN - mesa.players.length === 1 ? "Falta 1 pessoa" : `Faltam ${MESA_MIN - mesa.players.length} pessoas`} para começar.
            </p>
          )}
          {props.children({
            code,
            uid: user.uid,
            room,
            players: mesa.players,
            host: room.hostId === user.uid,
            offset: mesa.offset,
            name: nameOf,
          })}
          <button className="text-button danger mesa-leave" disabled={busy} onClick={() => void leave()}>
            Sair da sala
          </button>
        </>
      )}
      {code && user && mesa.member === null && <p className="alibi-wait">Recuperando a sala…</p>}
      {(error || authError || mesa.error) && <Notice>{error || authError || mesa.error}</Notice>}
      {!configured && <Notice>Configure o Firebase no arquivo .env para abrir salas.</Notice>}
    </section>
  );
}
