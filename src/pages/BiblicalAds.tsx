import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db, configured } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { errorText, roomCode } from "../utils/game";
import { Notice } from "../components/UI";

type Room = { code: string; hostId: string; phase: string; mode: "online" | "presencial"; sellerCount: number };
type Player = { uid: string; name: string };

export function BiblicalAds() {
  const code = (useParams().code || "").toUpperCase();
  const navigate = useNavigate();
  const { user, error: authError } = useAuth();
  const [name, setName] = useState(() => localStorage.getItem("anuncios.name") || "");
  const [inputCode, setInputCode] = useState(code);
  const [mode, setMode] = useState<"online" | "presencial">("online");
  const [member, setMember] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!user || !code) return;
    return onSnapshot(doc(db, `adsRooms/${code}/players/${user.uid}`), snapshot => setMember(snapshot.exists()), e => setError(errorText(e)));
  }, [code, user]);
  useEffect(() => {
    if (!code || !member) return;
    const stopRoom = onSnapshot(doc(db, `adsRooms/${code}`), snapshot => setRoom(snapshot.exists() ? snapshot.data() as Room : null), e => setError(errorText(e)));
    const stopPlayers = onSnapshot(collection(db, `adsRooms/${code}/players`), snapshot => setPlayers(snapshot.docs.map(d => d.data() as Player)), e => setError(errorText(e)));
    return () => { stopRoom(); stopPlayers(); };
  }, [code, member]);
  async function enter(create: boolean) {
    if (!user) { setError("Aguarde a conexão com o Firebase."); return; }
    if (!name.trim()) { setError("Informe seu apelido."); return; }
    setBusy(true); setError("");
    try {
      let joined = "";
      for (let i = 0; i < (create ? 10 : 1); i++) {
        const candidate = create ? roomCode() : (code || inputCode).trim().toUpperCase();
        if (!/^[A-HJ-NP-Z2-9]{5}$/.test(candidate)) throw new Error("Confira o código da sala.");
        const invite = doc(db, "adsInvites", candidate);
        const player = doc(db, `adsRooms/${candidate}/players/${user.uid}`);
        const ok = await runTransaction(db, async tx => {
          const entry = await tx.get(invite);
          if (create) {
            if (entry.exists()) return false;
            tx.set(doc(db, "adsRooms", candidate), { code: candidate, hostId: user.uid, phase: "lobby", mode, sellerCount: 2 });
            tx.set(invite, { count: 1, open: true });
            tx.set(player, { uid: user.uid, name: name.trim(), joinedAt: serverTimestamp() });
          } else {
            if (!entry.exists()) throw new Error("Sala não encontrada. Confira o código.");
            const existing = await tx.get(player);
            if (existing.exists()) return true;
            if (!entry.data().open) throw new Error("A sala não está aceitando entradas agora.");
            if (entry.data().count >= 8) throw new Error("Sala cheia: o limite é de 8 pessoas.");
            tx.update(invite, { count: entry.data().count + 1 });
            tx.set(player, { uid: user.uid, name: name.trim(), joinedAt: serverTimestamp() });
          }
          return true;
        });
        if (ok) { joined = candidate; break; }
      }
      if (!joined) throw new Error("Não foi possível gerar um código. Tente novamente.");
      localStorage.setItem("anuncios.name", name.trim());
      navigate(`/anuncios-biblicos/${joined}`);
    } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  const link = `${window.location.href.split("#")[0]}#/anuncios-biblicos/${code}`;
  return <section className="entry-card alibi-page">
    <span className="eyebrow">ONLINE OU PRESENCIAL · 2 A 8 PESSOAS</span>
    <h1>Anúncios dos Tempos Bíblicos</h1>
    <p>Um objeto bíblico, um estilo secreto e 40 segundos pra inventar o anúncio mais criativo.</p>
    <Notice>A sala está em construção: ainda não é possível iniciar uma partida.</Notice>
    {member && room ? <>
      <h2>Sala {code}</h2>
      <p>{room.mode === "presencial" ? "Presencial · apresentação ao vivo" : "Online · anúncios escritos"} · {players.length} de 8 pessoas</p>
      <ul>{players.map(player => <li key={player.uid}>{player.name}{player.uid === room.hostId ? " · anfitrião" : ""}{player.uid === user?.uid ? " · você" : ""}</li>)}</ul>
      {room.mode === "presencial" && players.length >= 5 && <fieldset className="mode-picker"><legend>Vendedores por rodada</legend>{[2, 3].map(count => <label key={count}><input type="radio" name="ads-sellers" checked={room.sellerCount === count} disabled={busy || room.hostId !== user?.uid} onChange={() => { setBusy(true); setError(""); void updateDoc(doc(db, "adsRooms", code), { sellerCount: count }).catch(e => setError(errorText(e))).finally(() => setBusy(false)); }} /> {count} vendedores</label>)}</fieldset>}
      {players.length === 2 && <p>{room.mode === "presencial" ? "Em dupla, os dois apresentam" : "Em dupla, os dois escrevem anúncios"} sem votação da plateia. A votação começa com três pessoas.</p>}
      <label htmlFor="ads-link">Link de convite</label><input id="ads-link" value={link} readOnly onFocus={e => e.currentTarget.select()} />
      <button className="button secondary" onClick={() => {
        if (!navigator.clipboard) { setError("Não foi possível copiar. Selecione o link e copie manualmente."); return; }
        void navigator.clipboard.writeText(link).then(() => setCopied(true)).catch(() => setError("Não foi possível copiar. Selecione o link e copie manualmente."));
      }}>{copied ? "Link copiado!" : "Copiar convite"}</button>
    </> : <>
      <label htmlFor="ads-name">Seu apelido</label><input id="ads-name" maxLength={24} value={name} onChange={e => setName(e.target.value)} />
      {!code && <fieldset className="mode-picker"><legend>Formato da sala</legend><label><input type="radio" name="ads-mode" checked={mode === "online"} onChange={() => setMode("online")} /> Online · anúncios escritos</label><label><input type="radio" name="ads-mode" checked={mode === "presencial"} onChange={() => setMode("presencial")} /> Presencial · apresentação ao vivo</label></fieldset>}
      {!code && <button className="button primary" disabled={busy || !user || !configured} onClick={() => void enter(true)}>Criar sala</button>}
      <label htmlFor="ads-code">Código da sala</label><input id="ads-code" maxLength={5} readOnly={!!code} value={code || inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())} />
      <button className="button secondary" disabled={busy || !user || !configured} onClick={() => void enter(false)}>Entrar na sala</button>
    </>}
    {(error || authError) && <Notice>{error || authError}</Notice>}
    {!configured && <Notice>Configure o Firebase no arquivo .env para abrir salas.</Notice>}
  </section>;
}
