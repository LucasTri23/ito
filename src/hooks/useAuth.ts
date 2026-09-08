import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import { auth, configured } from "../lib/firebase";
import { errorText } from "../utils/game";
let login: Promise<unknown> | undefined;
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!configured) return;
    return onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else {
        login ??= signInAnonymously(auth).catch((e) => {
          login = undefined;
          throw e;
        });
        void login.catch((e) => setError(errorText(e)));
      }
    });
  }, []);
  return { user, error };
}
