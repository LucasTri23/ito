import { useEffect, useRef, useState } from "react";
import { collection, doc, getDocFromServer, onSnapshot, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { errorText, hostAway } from "../utils/game";
import { claimMesaHost, setPresence, type MesaPlayer, type MesaRoom } from "../services/mesa";

/** Documento em tempo real; ignora escritas locais ainda não confirmadas. */
export function useLiveDoc<T>(path: string | null) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setValue(null);
    setError("");
    if (!path) return;
    return onSnapshot(
      doc(db, path),
      { includeMetadataChanges: true },
      (s) => {
        if (s.metadata.hasPendingWrites) return;
        setValue(s.exists() ? (s.data() as T) : null);
      },
      (e) => setError(errorText(e)),
    );
  }, [path]);
  return { value, error };
}

/** Coleção em tempo real; `null` desliga a escuta (ex.: antes da revelação). */
export function useLiveCollection<T>(path: string | null) {
  const [value, setValue] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false); // true depois da primeira resposta do servidor
  useEffect(() => {
    setValue([]);
    setError("");
    setReady(false);
    if (!path) return;
    return onSnapshot(
      collection(db, path),
      { includeMetadataChanges: true },
      (s) => {
        setValue(s.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
        if (!s.metadata.fromCache) setReady(true);
      },
      (e) => setError(errorText(e)),
    );
  }, [path]);
  return { value, error, ready };
}

/** Sala, jogadores, presença e troca automática de anfitrião. */
export function useMesa(code: string, uid: string | undefined) {
  const [member, setMember] = useState<boolean | null>(null);
  const [offset, setOffset] = useState(0);
  const room = useLiveDoc<MesaRoom>(member ? `mesas/${code}` : null);
  const players = useLiveCollection<MesaPlayer>(member ? `mesas/${code}/players` : null);
  useEffect(() => {
    setMember(null);
    if (!code || !uid) return;
    return onSnapshot(
      doc(db, `mesas/${code}/players/${uid}`),
      (s) => setMember(s.exists()),
      () => setMember(false),
    );
  }, [code, uid]);
  // Presença: aba visível = conectado; aba escondida/fechada = ausente.
  // Também mede a diferença entre o relógio local e o do servidor.
  useEffect(() => {
    if (!member || !uid) return;
    const sync = async (connected: boolean) => {
      const start = Date.now();
      try {
        await setPresence(code, uid, connected);
        if (!connected) return;
        const snap = await getDocFromServer(doc(db, `mesas/${code}/players/${uid}`));
        const at = snap.data()?.presenceAt as Timestamp | undefined;
        const end = Date.now();
        // Descarta amostras lentas (> 3 s de ida e volta) ou absurdas (> 10 min de diferença).
        const sample = at ? at.toMillis() - (start + end) / 2 : NaN;
        if (Number.isFinite(sample) && end - start < 3000 && Math.abs(sample) < 600_000) setOffset(sample);
      } catch {
        /* presença é melhor-esforço */
      }
    };
    void sync(true);
    const onVisibility = () => void sync(document.visibilityState === "visible");
    const onHide = () => void setPresence(code, uid, false).catch(() => {});
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
    };
  }, [member, code, uid]);
  // Se o anfitrião sumiu por tempo demais, alguém conectado assume.
  const hostId = room.value?.hostId;
  const list = players.value;
  const listRef = useRef(list);
  listRef.current = list;
  useEffect(() => {
    if (!member || !uid || !hostId || hostId === uid) return;
    const check = () => {
      const host = listRef.current.find((p) => p.uid === hostId);
      if (hostAway(host, Date.now() + offset)) void claimMesaHost(code, uid).catch(() => {});
    };
    const t = window.setInterval(check, 15000);
    return () => window.clearInterval(t);
  }, [member, uid, hostId, code, offset]);
  return { member, room: room.value, players: list, offset, error: room.error || players.error };
}

/** Segundos restantes até `endsAt`, usando o relógio do servidor. */
export function useCountdown(endsAt: Timestamp | null | undefined, offset: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, []);
  if (!endsAt) return { remaining: 0, expired: false };
  const ms = endsAt.toMillis() - (now + offset);
  return { remaining: Math.max(0, Math.ceil(ms / 1000)), expired: ms <= 0 };
}
