// Plano B: escolha 2 de 6 itens antes de descobrir o imprevisto.

export interface PlanBTwist {
  text: string;
  scores: number[]; // 6 notas de 0 a 3, na ordem dos itens
  reasons: string[]; // 6 justificativas curtas, na ordem dos itens
}
export interface PlanBMission {
  id: string;
  category: string;
  mission: string;
  hint: string;
  items: string[]; // 6 itens
  twists: PlanBTwist[]; // 3 imprevistos
}

export const PLANB_ROUNDS = 5;
export const PLANB_SECONDS = 25;
export const PLANB_PICKS = 2;

export function pairScore(twist: PlanBTwist, picks: number[]) {
  return picks.reduce((sum, i) => sum + (twist.scores[i] ?? 0), 0);
}

/** Pares (índices) com a maior soma para um imprevisto. */
export function bestPairs(twist: PlanBTwist): string[] {
  let best = -1;
  let pairs: string[] = [];
  for (let i = 0; i < 6; i++)
    for (let j = i + 1; j < 6; j++) {
      const s = twist.scores[i] + twist.scores[j];
      if (s > best) {
        best = s;
        pairs = [`${i}-${j}`];
      } else if (s === best) pairs.push(`${i}-${j}`);
    }
  return pairs;
}

export function missionProblems(m: PlanBMission): string[] {
  const p: string[] = [];
  if (!m.id || !m.category || !m.mission?.trim() || !m.hint?.trim()) p.push("campos vazios");
  if (!Array.isArray(m.items) || m.items.length !== 6 || new Set(m.items.map((x) => x.trim().toLowerCase())).size !== 6)
    p.push("precisa de 6 itens diferentes");
  if (!Array.isArray(m.twists) || m.twists.length !== 3) p.push("precisa de 3 imprevistos");
  else {
    if (new Set(m.twists.map((t) => t.text.trim().toLowerCase())).size !== 3) p.push("imprevistos repetidos");
    m.twists.forEach((t, k) => {
      if (!t.text?.trim()) p.push(`imprevisto ${k + 1} sem texto`);
      if (t.scores?.length !== 6 || t.scores.some((s) => !Number.isInteger(s) || s < 0 || s > 3))
        p.push(`imprevisto ${k + 1}: precisa de 6 notas inteiras de 0 a 3`);
      if (t.reasons?.length !== 6 || t.reasons.some((r) => !r?.trim())) p.push(`imprevisto ${k + 1}: precisa de 6 justificativas`);
    });
    if (!p.length) {
      // Nenhum par pode ser o melhor nos três imprevistos: tem que existir decisão.
      const [a, b, c] = m.twists.map(bestPairs);
      if (a.some((pair) => b.includes(pair) && c.includes(pair))) p.push("um mesmo par é o melhor nos três imprevistos");
    }
  }
  return p;
}
