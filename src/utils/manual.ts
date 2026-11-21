// Manual Desmontado: pistas estruturadas, texto em português, distribuição e verificação.

export type Clue =
  | { type: "first"; a: string }
  | { type: "last"; a: string }
  | { type: "at"; a: string; pos: number } // posição 1-based
  | { type: "notAt"; a: string; pos: number }
  | { type: "before"; a: string; b: string } // a fica em algum lugar antes de b
  | { type: "right"; a: string; b: string } // a fica imediatamente antes de b
  | { type: "adjacent"; a: string; b: string }
  | { type: "notAdjacent"; a: string; b: string };

export interface Piece {
  id: string;
  name: string;
}
export interface Challenge {
  id: string;
  theme: string;
  intro: string;
  pieces: Piece[];
  clues: Clue[];
  solution: string[];
  explanation: string;
}

export const TEAM_SIZES = [2, 3, 4] as const;
export const MANUAL_SECONDS = 180;
export const MANUAL_ATTEMPTS = 2;

export function clueHolds(clue: Clue, order: string[]): boolean {
  const p = (id: string) => order.indexOf(id);
  switch (clue.type) {
    case "first":
      return p(clue.a) === 0;
    case "last":
      return p(clue.a) === order.length - 1;
    case "at":
      return p(clue.a) === clue.pos - 1;
    case "notAt":
      return p(clue.a) !== clue.pos - 1;
    case "before":
      return p(clue.a) < p(clue.b);
    case "right":
      return p(clue.a) + 1 === p(clue.b);
    case "adjacent":
      return Math.abs(p(clue.a) - p(clue.b)) === 1;
    case "notAdjacent":
      return Math.abs(p(clue.a) - p(clue.b)) !== 1;
  }
}

export function clueText(clue: Clue, pieces: Piece[]): string {
  const n = (id: string) => pieces.find((x) => x.id === id)?.name ?? id;
  const ordinal = (pos: number) => `${pos}ª`;
  switch (clue.type) {
    case "first":
      return `${n(clue.a)} fica na primeira posição.`;
    case "last":
      return `${n(clue.a)} fica na última posição.`;
    case "at":
      return `${n(clue.a)} fica na ${ordinal(clue.pos)} posição.`;
    case "notAt":
      return `${n(clue.a)} não fica na ${ordinal(clue.pos)} posição.`;
    case "before":
      return `${n(clue.a)} vem em algum momento antes de ${n(clue.b)}.`;
    case "right":
      return `${n(clue.a)} vem imediatamente antes de ${n(clue.b)}.`;
    case "adjacent":
      return `${n(clue.a)} fica ao lado de ${n(clue.b)}.`;
    case "notAdjacent":
      return `${n(clue.a)} não fica ao lado de ${n(clue.b)}.`;
  }
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, i) =>
    permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest]),
  );
}

/** Todas as ordens das peças que satisfazem as pistas dadas. */
export function solutions(pieceIds: string[], clues: Clue[]): string[][] {
  return permutations(pieceIds).filter((order) => clues.every((c) => clueHolds(c, order)));
}

/** Distribui as pistas em rodízio: a pista i vai para o integrante i % tamanho. */
export function distributeClues<T>(clues: T[], teamSize: number): T[][] {
  const hands: T[][] = Array.from({ length: teamSize }, () => []);
  clues.forEach((clue, i) => hands[i % teamSize].push(clue));
  return hands;
}

/** Problemas de um desafio; lista vazia quando está tudo certo. */
export function challengeProblems(ch: Challenge): string[] {
  const problems: string[] = [];
  const ids = ch.pieces.map((p) => p.id);
  if (ids.length < 4 || ids.length > 6) problems.push("precisa de 4 a 6 peças");
  if (new Set(ids).size !== ids.length) problems.push("ids de peça repetidos");
  if (ch.solution.length !== ids.length || new Set(ch.solution).size !== ids.length || !ch.solution.every((id) => ids.includes(id)))
    problems.push("solução não usa cada peça exatamente uma vez");
  for (const c of ch.clues) {
    const refs = "b" in c ? [c.a, c.b] : [c.a];
    if (!refs.every((r) => ids.includes(r))) problems.push(`pista cita peça inexistente: ${JSON.stringify(c)}`);
    if ("pos" in c && (c.pos < 1 || c.pos > ids.length)) problems.push(`posição fora da faixa: ${JSON.stringify(c)}`);
  }
  if (problems.length) return problems;
  const all = solutions(ids, ch.clues);
  if (all.length !== 1) problems.push(`as pistas geram ${all.length} soluções (precisa de exatamente 1)`);
  else if (all[0].join() !== ch.solution.join()) problems.push("a solução única não é a solução declarada");
  if (ch.clues.length < 4) problems.push("precisa de pelo menos 4 pistas para equipes de até 4 pessoas");
  for (const size of TEAM_SIZES) {
    distributeClues(ch.clues, size).forEach((hand, member) => {
      if (!hand.length) problems.push(`equipe de ${size}: integrante ${member + 1} ficou sem pista`);
      else if (solutions(ids, hand).length <= 1)
        problems.push(`equipe de ${size}: integrante ${member + 1} resolve sozinho`);
    });
  }
  return problems;
}

/** Quantas peças estão na posição certa. */
export function correctCount(slots: string[], solution: string[]) {
  return solution.reduce((n, id, i) => n + (slots[i] === id ? 1 : 0), 0);
}
