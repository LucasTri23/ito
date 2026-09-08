import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Room, Player, Round, Answer, Secret } from "../types/game";
import { errorText } from "../utils/game";
function useDocument<T>(path: string | null, committedOnly = false) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setValue(null);
    setError("");
    setLoading(Boolean(path));
    if (!path) return;
    return onSnapshot(
      doc(db, path),
      { includeMetadataChanges: true },
      (s) => {
        if (
          committedOnly &&
          (s.metadata.hasPendingWrites || s.metadata.fromCache)
        )
          return;
        setValue(s.exists() ? (s.data() as T) : null);
        setLoading(false);
      },
      (e) => {
        setError(errorText(e));
        setLoading(false);
      },
    );
  }, [path, committedOnly]);
  return { value, loading, error };
}
function useCollection<T>(path: string | null, serverOnly = false, retry = 0) {
  const [value, setValue] = useState<T[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    setValue([]);
    setError("");
    if (!path) return;
    return onSnapshot(
      collection(db, path),
      { includeMetadataChanges: true },
      (s) => {
        if (serverOnly && (s.metadata.fromCache || s.metadata.hasPendingWrites))
          return;
        setError("");
        setValue(s.docs.map((d) => d.data() as T));
      },
      (e) => {
        setValue([]);
        setError(errorText(e));
      },
    );
  }, [path, serverOnly, retry]);
  return { value, error };
}
export const useRoom = (code: string) => useDocument<Room>(`rooms/${code}`);
export const usePlayers = (code: string | null) =>
  useCollection<Player>(code ? `rooms/${code}/players` : null);
export const useRound = (code: string, id: string) =>
  useDocument<Round>(id ? `rooms/${code}/rounds/${id}` : null, true);
export const useAnswers = (path: string | null) =>
  useCollection<Answer>(path ? `${path}/answers` : null);
export const useSecret = (path: string | null, uid: string) =>
  useDocument<Secret>(path ? `${path}/secrets/${uid}` : null);
export const useSecrets = (path: string | null, retry = 0) =>
  useCollection<Secret>(path ? `${path}/secrets` : null, true, retry);
export const useReady = (path: string | null) =>
  useCollection<{ uid: string }>(path ? `${path}/ready` : null);
