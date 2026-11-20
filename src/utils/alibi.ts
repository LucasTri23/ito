/** Pure round rules. The authoritative service must persist the returned history atomically. */
export type AlibiHistory = {
  suspects: Record<string, number>;
  investigators: Record<string, number>;
  pairs: Record<string, number>;
};

export const emptyAlibiHistory = (): AlibiHistory => ({
  suspects: {}, investigators: {}, pairs: {},
});

export function chooseAlibiRoles(ids: string[], history: AlibiHistory) {
  if (ids.length < 2 || ids.length > 8 || new Set(ids).size !== ids.length)
    throw new Error("A rodada precisa de 2 a 8 participantes distintos.");
  const sorted = [...ids].sort();
  const pairs = sorted.flatMap((a, i) => sorted.slice(i + 1).map((b) => {
    const counts = [history.suspects[a] ?? 0, history.suspects[b] ?? 0].sort((x, y) => x - y);
    const key = JSON.stringify([a, b]);
    return { a, b, key, counts, used: history.pairs[key] ?? 0 };
  }));
  pairs.sort((a, b) => a.counts[1] - b.counts[1] || a.counts[0] - b.counts[0] || a.used - b.used || a.key.localeCompare(b.key));
  const pair = pairs[0];
  const remaining = sorted.filter((id) => id !== pair.a && id !== pair.b);
  remaining.sort((a, b) => (history.investigators[a] ?? 0) - (history.investigators[b] ?? 0) || a.localeCompare(b));
  const investigator = remaining.shift() ?? null;
  return { suspects: [pair.a, pair.b], investigator, jurors: remaining, pairKey: pair.key };
}

export function recordAlibiRoles(history: AlibiHistory, roles: ReturnType<typeof chooseAlibiRoles>): AlibiHistory {
  const next = { suspects: { ...history.suspects }, investigators: { ...history.investigators }, pairs: { ...history.pairs } };
  for (const id of roles.suspects) next.suspects[id] = (next.suspects[id] ?? 0) + 1;
  if (roles.investigator) next.investigators[roles.investigator] = (next.investigators[roles.investigator] ?? 0) + 1;
  next.pairs[roles.pairKey] = (next.pairs[roles.pairKey] ?? 0) + 1;
  return next;
}

export function tallyAlibiVotes(votes: Array<"colou" | "furado">) {
  const colou = votes.filter((v) => v === "colou").length;
  const furado = votes.length - colou;
  return { colou, furado, result: votes.length === 0 ? "sem-veredito" : colou === furado ? "empate" : colou > furado ? "colou" : "furado" } as const;
}

/** Compares written text only; it does not infer the meaning of a story. */
export function compareAlibiAnswers(first?: string, second?: string): "igual" | "diferente" | "aguardando" {
  if (first === undefined || second === undefined) return "aguardando";
  const normalize = (value: string) => value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
  const a = normalize(first), b = normalize(second);
  return a && b && a === b ? "igual" : "diferente";
}
