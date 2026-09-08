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
  if (code === "unavailable")
    return "Sem conexão com o Firebase. Tente novamente.";
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir. Tente novamente.";
}
