import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, runTransaction, serverTimestamp, type Timestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db, configured } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { errorText, roomCode } from "../utils/game";
import { Notice } from "../components/UI";
import { AlibiRound } from "../components/AlibiRound";
import { leaveAlibi, type AlibiRoundData } from "../services/alibi";

type Player = { uid: string; name: string };
type Room = { code: string; hostId: string; phase: string; mode?: "online" | "presencial"; currentRoundId?: string };

export function Alibi() {
  const { code: routeCode } = useParams();
  const code = (routeCode || "").toUpperCase();
  const nav = useNavigate();
  const { user, error: authError } = useAuth();
  const [name, setName] = useState(() => localStorage.getItem("alibi.name") || "");
  const [inputCode, setInputCode] = useState(code);
  const [mode, setMode] = useState<"online" | "presencial">("online");
  const [member, setMember] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activity, setActivity] = useState<Record<string, number>>({});
  const [activityNow, setActivityNow] = useState(Date.now());
  const [round, setRound] = useState<AlibiRoundData | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!code || !user) return;
    return onSnapshot(doc(db, `alibiRooms/${code}/players/${user.uid}`), s => setMember(s.exists()), e => setError(errorText(e)));
  }, [code, user]);
  useEffect(() => {
    if (!code || !member) return;
    const stopRoom = onSnapshot(doc(db, `alibiRooms/${code}`), s => setRoom(s.exists() ? s.data() as Room : null), e => setError(errorText(e)));
    const stopPlayers = onSnapshot(collection(db, `alibiRooms/${code}/players`), s => setPlayers(s.docs.map(d => d.data() as Player)), e => setError(errorText(e)));
    return () => { stopRoom(); stopPlayers(); };
  }, [code, member]);
  useEffect(() => {
    if (!code || !member) return;
    const stop = onSnapshot(collection(db, `alibiRooms/${code}/clock`), snapshot => {
      setActivity(Object.fromEntries(snapshot.docs.map(d => [d.id, (d.data().at as Timestamp | null)?.toMillis() ?? 0])));
    }, e => setError(errorText(e)));
    const timer = window.setInterval(() => setActivityNow(Date.now()), 30000);
    return () => { stop(); window.clearInterval(timer); };
  }, [code, member]);
  useEffect(() => {
    if (!code || !member || !room?.currentRoundId) return;
    return onSnapshot(doc(db, `alibiRooms/${code}/rounds/${room.currentRoundId}`), { includeMetadataChanges: true }, s => {
      if (!s.metadata.hasPendingWrites) setRound(s.exists() ? s.data() as AlibiRoundData : null);
    }, e => setError(errorText(e)));
  }, [code, member, room?.currentRoundId]);
  const link = `${window.location.href.split("#")[0]}#/alibi-furado/${code}`;
  async function enter(create: boolean) {
    if (!user) { setError("Aguardando conexão com o Firebase."); return; }
    if (!name.trim()) { setError("Informe seu apelido."); return; }
    setBusy(true); setError("");
    try {
      let joined = "";
      for (let i = 0; i < (create ? 10 : 1); i++) {
        const candidate = create ? roomCode() : (code || inputCode).trim().toUpperCase();
        if (!/^[A-HJ-NP-Z2-9]{5}$/.test(candidate)) throw new Error("Confira o código da sala.");
        const invite = doc(db, "alibiInvites", candidate);
        const player = doc(db, `alibiRooms/${candidate}/players/${user.uid}`);
        const ok = await runTransaction(db, async tx => {
          const inviteSnap = await tx.get(invite);
          if (create) {
            if (inviteSnap.exists()) return false;
            tx.set(doc(db, "alibiRooms", candidate), { code: candidate, hostId: user.uid, phase: "lobby", mode });
            tx.set(invite, { count: 1, open: true });
            tx.set(player, { uid: user.uid, name: name.trim(), joinedAt: serverTimestamp() });
          } else {
            if (!inviteSnap.exists()) throw new Error("Sala não encontrada. Confira o código.");
            const existing = await tx.get(player);
            if (existing.exists()) return true;
            if (!inviteSnap.data().open) throw new Error("Rodada em andamento. Aguarde o intervalo.");
            if (inviteSnap.data().count >= 8) throw new Error("Sala cheia: o limite é de 8 jogadores.");
            tx.update(invite, { count: inviteSnap.data().count + 1 });
            tx.set(player, { uid: user.uid, name: name.trim(), joinedAt: serverTimestamp() });
          }
          return true;
        });
        if (ok) { joined = candidate; break; }
      }
      if (!joined) throw new Error("Não foi possível gerar um código. Tente novamente.");
      localStorage.setItem("alibi.name", name.trim());
      localStorage.setItem("alibi.room", joined);
      nav(`/alibi-furado/${joined}`);
    } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  const copy = () => {
    if (!navigator.clipboard) { setError("Não foi possível copiar. Selecione o link acima e copie manualmente."); return; }
    void navigator.clipboard.writeText(link).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2500); }).catch(() => setError("Não foi possível copiar. Selecione o link acima e copie manualmente."));
  };
  const inRoom = member && room;
  return <section className={`entry-card alibi-page${inRoom ? " in-room" : ""}`}>
    <div className="alibi-head">
      <span className="alibi-badge" aria-hidden="true">🕵️</span>
      <div>
        <span className="eyebrow">{inRoom ? (room.mode === "presencial" ? "PRESENCIAL" : "ONLINE") : "ONLINE OU PRESENCIAL"} · 2 A 8 JOGADORES</span>
        <h1>Álibi Furado</h1>
      </div>
    </div>
    {!inRoom && <>
      <p className="alibi-pitch">Dois suspeitos têm 30 segundos para combinar uma história. Depois, respondem separadamente às mesmas perguntas. Será que as versões vão bater?</p>
      <ol className="alibi-how">
        <li><span aria-hidden="true">⏱️</span>30 segundos para combinar</li>
        <li><span aria-hidden="true">🤫</span>Cada um responde sozinho</li>
        <li><span aria-hidden="true">⚖️</span>A turma decide se colou</li>
      </ol>
      <p className="muted-line">A conversa acontece ao vivo ou em uma chamada externa.</p>
    </>}
    {inRoom ? <>
      <div className="alibi-ticket">
        <div>
          <span className="eyebrow">CÓDIGO DA SALA</span>
          <strong className="alibi-code">{code}</strong>
        </div>
        <div className="alibi-capacity">
          <span>{players.length} de 8 jogadores</span>
          <span className="capacity-bar" aria-hidden="true"><i style={{ width: `${(players.length / 8) * 100}%` }} /></span>
        </div>
      </div>
      <ul className="alibi-players">{players.map((p, i) => <li key={p.uid} className={`alibi-player${p.uid === user?.uid ? " is-me" : ""}`}>
        <span className={`avatar avatar-${i % 4}`} aria-hidden="true">{p.name.trim().charAt(0).toUpperCase()}</span>
        <strong>{p.name}</strong>
        {p.uid === room.hostId && <span className="player-tag host-tag">👑 anfitrião</span>}
        {p.uid === user?.uid && <span className="player-tag me-tag">você</span>}
        {p.uid !== user?.uid && activity[p.uid] > 0 && activityNow - activity[p.uid] > 240000 && <span className="player-tag">Sem atualização recente</span>}
      </li>)}</ul>
      <div className="alibi-invite">
        <label htmlFor="alibi-link">Link de convite</label>
        <div className="invite-row">
          <input id="alibi-link" value={link} readOnly onFocus={e => e.currentTarget.select()} />
          <button className={`button secondary${copied ? " copied" : ""}`} onClick={copy}>{copied ? "✅ Link copiado!" : "Copiar convite"}</button>
        </div>
      </div>
      <button className="text-button" disabled={busy} onClick={() => {
        if (!user) return;
        setBusy(true); setError("");
        void leaveAlibi(code, user.uid, players.map(p => p.uid)).then(() => {
          localStorage.removeItem("alibi.room");
          nav("/alibi-furado");
        }).catch(e => setError(errorText(e))).finally(() => setBusy(false));
      }}>Sair da sala</button>
      {room.phase === "playing" && <p className="muted-line">Se alguém sair, a rodada atual será cancelada.</p>}
      {user && (!room.currentRoundId || round?.id === room.currentRoundId
        ? <AlibiRound key={room.currentRoundId || "lobby"} code={code} uid={user.uid} hostId={room.hostId} round={round} players={players} />
        : <p className="alibi-wait">Carregando rodada…</p>)}
    </> : <div className="alibi-entry">
      <label htmlFor="alibi-name">Seu apelido</label><input id="alibi-name" value={name} maxLength={24} placeholder="Como a turma te chama?" onChange={e => setName(e.target.value)} />
      {!code && <fieldset className="mode-picker"><legend>Como vocês vão jogar?</legend>
        <label><input type="radio" name="alibi-mode" checked={mode === "online"} onChange={() => setMode("online")} /> Online · respostas no celular</label>
        <label><input type="radio" name="alibi-mode" checked={mode === "presencial"} onChange={() => setMode("presencial")} /> Presencial · respostas em voz alta</label>
      </fieldset>}
      {!code && <p className="muted-line">O modo escolhido vale ao criar a sala. Ao entrar, você acompanha o modo do anfitrião.</p>}
      {!code && <button className="button primary" disabled={busy || !configured || !user} onClick={() => void enter(true)}>Criar sala</button>}
      {!code && <div className="divider">ou entre com um código</div>}
      <label htmlFor="alibi-code">Código da sala</label><input id="alibi-code" className="code-field" maxLength={5} value={code || inputCode} placeholder="EX.: XK72A" readOnly={!!code} onChange={e => setInputCode(e.target.value.toUpperCase())} />
      <button className={`button ${code ? "primary" : "secondary"}`} disabled={busy || !configured || !user} onClick={() => void enter(false)}>Entrar na sala</button>
      {!code && localStorage.getItem("alibi.room") && <button className="text-button" onClick={() => nav(`/alibi-furado/${localStorage.getItem("alibi.room")}`)}>Voltar à última sala →</button>}
    </div>}
    {(error || authError) && <Notice>{error || authError}</Notice>}
    {!configured && <Notice>Configure o Firebase no arquivo .env para abrir salas.</Notice>}
  </section>;
}
