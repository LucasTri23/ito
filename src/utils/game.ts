export function randomInt(max: number): number {
  const range = 4294967296;
  const limit = range - (range % max);
  const a = new Uint32Array(1);
  do {
    crypto.getRandomValues(a);
  } while (a[0] >= limit);
  return a[0] % max;
}
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function roomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 5 },
    () => alphabet[randomInt(alphabet.length)],
  ).join("");
}
export function errorText(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === "permission-denied")
    return "Ação não permitida. A sala pode ter mudado; atualize e tente novamente.";
  if (code === "auth/operation-not-allowed")
    return "Ative o login anônimo no Firebase Authentication.";
  if (code === "unavailable" || code === "deadline-exceeded")
    return "Sem conexão com o Firebase. Tente novamente.";
  if (code === "unauthenticated")
    return "Sua sessão precisa ser recuperada. Atualize a página e tente novamente.";
  if (code === "resource-exhausted")
    return "O serviço está temporariamente ocupado. Aguarde um pouco e tente novamente.";
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir. Tente novamente.";
}

/**
 * Minutes the host must stay disconnected (`connected == false`, counted from
 * the server-stamped `presenceAt`) before another member may take over.
 * Mirrors `hostAway()` in firestore.rules — keep both in sync.
 */
export const HOST_TAKEOVER_MINUTES = 3;

type Seen = { toMillis(): number } | null | undefined;
export interface Candidate {
  uid: string;
  connected: boolean;
  joinedAt?: unknown;
  presenceAt?: unknown;
}
const millis = (v: unknown) =>
  v && typeof (v as { toMillis?: unknown }).toMillis === "function"
    ? (v as NonNullable<Seen>).toMillis()
    : Number.POSITIVE_INFINITY;

/**
 * Predictable successor: among the remaining players (everyone except
 * `excluded`), connected people first, then earliest `joinedAt`, then uid.
 */
export function pickSuccessor<T extends Candidate>(
  players: T[],
  excluded: string,
): T | undefined {
  return players
    .filter((p) => p.uid !== excluded)
    .sort(
      (a, b) =>
        Number(b.connected) - Number(a.connected) ||
        millis(a.joinedAt) - millis(b.joinedAt) ||
        (a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0),
    )[0];
}

/** True when the host may be replaced: missing, or offline for long enough. */
export function hostAway(
  host: Candidate | undefined,
  now: number,
  minutes = HOST_TAKEOVER_MINUTES,
) {
  if (!host) return true;
  if (host.connected) return false;
  const seen = millis(host.presenceAt);
  return Number.isFinite(seen) && now - seen > minutes * 60_000;
}
