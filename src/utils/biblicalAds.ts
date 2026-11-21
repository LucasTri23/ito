export type AdChoice = "compro" | "nao-compro";
export const biblicalAdStyles = [
  "Vendedor de feira", "Classificado de jornal", "Comercial de luxo", "Locutor de rádio",
  "Propaganda de TV", "Catálogo de loja", "Comercial em três frases", "Anúncio de liquidação",
] as const;
export type PhysicalOutcome = { status: "sem-votacao" | "ninguem-comprou" | "vencedor" | "empate"; winners: string[]; totals: Record<string, { compro: number; naoCompro: number }> };

export function selectSellers(players: string[], counts: Record<string, number>, count: number, round: number): string[] {
  if (players.length < 2 || players.length > 8 || new Set(players).size !== players.length || count < 2 || count > 3 || count > players.length || (players.length <= 4 && count !== 2) || !Number.isInteger(round) || round < 0)
    throw new Error("Participantes ou quantidade de vendedores inválidos.");
  const ordered = [...players].sort();
  const positions = new Map(ordered.map((id, i) => [id, (i - round % ordered.length + ordered.length) % ordered.length]));
  ordered.sort((a, b) => (counts[a] ?? 0) - (counts[b] ?? 0) || positions.get(a)! - positions.get(b)!);
  const selected = ordered.slice(0, count).sort();
  const shift = round % selected.length;
  return [...selected.slice(shift), ...selected.slice(0, shift)];
}

export function selectOnlineRoles(players: string[], buyerCounts: Record<string, number>, round: number) {
  if (players.length < 2 || players.length > 8 || new Set(players).size !== players.length || !Number.isInteger(round) || round < 0)
    throw new Error("Participantes ou rodada inválidos.");
  const ids = [...players].sort();
  if (ids.length !== 3) return { buyer: null, authors: ids };
  const priority = new Map(ids.map((id, i) => [id, (i - round % ids.length + ids.length) % ids.length]));
  const buyer = [...ids].sort((a, b) => (buyerCounts[a] ?? 0) - (buyerCounts[b] ?? 0) || priority.get(a)! - priority.get(b)!)[0];
  return { buyer, authors: ids.filter(id => id !== buyer) };
}

export type WrittenBallot = { voterId: string; adId: string };
export function tallyWrittenVotes(authorsByAd: Record<string, string>, voters: string[], ballots: WrittenBallot[]) {
  const totals = Object.fromEntries(Object.keys(authorsByAd).map(id => [id, 0])) as Record<string, number>;
  if (Object.keys(authorsByAd).length < 2) {
    if (ballots.length) throw new Error("São necessários dois anúncios para votar.");
    return { totals, winners: [] as string[], status: "sem-escolha" } as const;
  }
  const seen = new Set<string>();
  for (const ballot of ballots) {
    if (!voters.includes(ballot.voterId) || seen.has(ballot.voterId) || !Object.hasOwn(authorsByAd, ballot.adId) || authorsByAd[ballot.adId] === ballot.voterId)
      throw new Error("Voto inválido ou repetido.");
    seen.add(ballot.voterId);
    totals[ballot.adId]++;
  }
  const best = Math.max(0, ...Object.values(totals));
  const winners = best ? Object.keys(totals).filter(id => totals[id] === best) : [];
  return { totals, winners, status: winners.length === 0 ? "sem-vencedor" : winners.length === 1 ? "vencedor" : "empate" } as const;
}

export function tallyPhysicalVotes(sellers: string[], ballots: Record<string, AdChoice[]>): PhysicalOutcome {
  if (!sellers.length || new Set(sellers).size !== sellers.length) throw new Error("Lista de vendedores inválida.");
  const totals: PhysicalOutcome["totals"] = {};
  for (const seller of sellers) {
    const votes = ballots[seller] ?? [];
    if (votes.some(vote => vote !== "compro" && vote !== "nao-compro")) throw new Error("Voto inválido.");
    totals[seller] = { compro: votes.filter(vote => vote === "compro").length, naoCompro: votes.filter(vote => vote === "nao-compro").length };
  }
  const validCount = sellers.reduce((sum, seller) => sum + totals[seller].compro + totals[seller].naoCompro, 0);
  if (!validCount) return { status: "sem-votacao", winners: [], totals };
  const best = Math.max(...sellers.map(seller => totals[seller].compro));
  if (!best) return { status: "ninguem-comprou", winners: [], totals };
  const winners = sellers.filter(seller => totals[seller].compro === best);
  return { status: winners.length === 1 ? "vencedor" : "empate", winners, totals };
}
