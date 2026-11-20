import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db, configured } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { errorText, roomCode } from "../utils/game";
import { Notice } from "../components/UI";
import { AlibiRound, type AlibiPublicRound } from "../components/AlibiRound";

type Player = { uid: string; name: string };
type Room = { code: string; hostId: string; phase: string; round?: AlibiPublicRound };

export function Alibi() {
  const { code: routeCode } = useParams();
  const code = (routeCode || "").toUpperCase();
  const nav = useNavigate();
  const { user, error: authError } = useAuth();
  const [name, setName] = useState(() => localStorage.getItem("alibi.name") || "");
  const [inputCode, setInputCode] = useState(code);
  const [member, setMember] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
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
            tx.set(doc(db, "alibiRooms", candidate), { code: candidate, hostId: user.uid, phase: "lobby" });
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
  return <section className="entry-card alibi-page">
    <span className="eyebrow">ONLINE · 2 A 8 JOGADORES</span>
    <h1>Álibi Furado</h1>
    <p>Dois suspeitos têm 30 segundos para combinar uma história. Depois, respondem separadamente às mesmas perguntas. Será que as versões vão bater?</p>
    <p>A conversa acontece ao vivo ou em uma chamada externa.</p>
    {member && room ? <>
      <h2>Sala {code}</h2><p>{players.length} de 8 jogadores</p>
      <ul>{players.map(p => <li key={p.uid}>{p.name}{p.uid === room.hostId ? " · anfitrião" : ""}{p.uid === user?.uid ? " · você" : ""}</li>)}</ul>
      <label htmlFor="alibi-link">Link de convite</label><input id="alibi-link" value={link} readOnly onFocus={e => e.currentTarget.select()} />
      <button className="button secondary" onClick={() => { if (!navigator.clipboard) { setError("Não foi possível copiar. Selecione o link acima e copie manualmente."); return; } void navigator.clipboard.writeText(link).then(() => setCopied(true)).catch(() => setError("Não foi possível copiar. Selecione o link acima e copie manualmente.")); }}>{copied ? "Link copiado!" : "Copiar convite"}</button>
      {user && <AlibiRound code={code} uid={user.uid} hostId={room.hostId} round={room.round} players={players} />}
    </> : <>
      <label htmlFor="alibi-name">Seu apelido</label><input id="alibi-name" value={name} maxLength={24} onChange={e => setName(e.target.value)} />
      {!code && <button className="button primary" disabled={busy || !configured || !user} onClick={() => void enter(true)}>Criar sala</button>}
      <label htmlFor="alibi-code">Código da sala</label><input id="alibi-code" maxLength={5} value={code || inputCode} readOnly={!!code} onChange={e => setInputCode(e.target.value.toUpperCase())} />
      <button className="button secondary" disabled={busy || !configured || !user} onClick={() => void enter(false)}>Entrar na sala</button>
      {!code && localStorage.getItem("alibi.room") && <button className="text-button" onClick={() => nav(`/alibi-furado/${localStorage.getItem("alibi.room")}`)}>Voltar à última sala →</button>}
    </>}
    {(error || authError) && <Notice>{error || authError}</Notice>}
    {!configured && <Notice>Configure o Firebase no arquivo .env para abrir salas.</Notice>}
  </section>;
}
