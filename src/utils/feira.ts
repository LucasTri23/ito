// Feira de Invenções: problema da rodada e um material secreto por inventor.

export interface FeiraMaterial {
  id: string;
  name: string;
  category: string;
}
export interface FeiraProblem {
  id: string;
  category: string;
  text: string;
  materials: string[]; // ids compatíveis, pelo menos 8
}
export interface FeiraCatalog {
  materials: FeiraMaterial[];
  problems: FeiraProblem[];
}

export const FEIRA_ROUNDS = 5;
export const FEIRA_SECONDS = 45;
export const FEIRA_VOTE_SECONDS = 30;
export const FEIRA_LIVE_VOTE_SECONDS = 20;

export function feiraProblems(cat: FeiraCatalog): string[] {
  const p: string[] = [];
  const ids = new Set<string>();
  for (const m of cat.materials) {
    if (!m.id || ids.has(m.id)) p.push(`material com id vazio ou repetido: ${m.id}`);
    ids.add(m.id);
    if (!m.name?.trim() || !m.category?.trim()) p.push(`material incompleto: ${m.id}`);
  }
  if (new Set(cat.materials.map((m) => m.name.trim().toLowerCase())).size !== cat.materials.length) p.push("nomes de material repetidos");
  const pids = new Set<string>();
  const texts = new Set<string>();
  for (const pr of cat.problems) {
    if (!pr.id || pids.has(pr.id)) p.push(`problema com id vazio ou repetido: ${pr.id}`);
    pids.add(pr.id);
    const t = pr.text?.trim().toLowerCase();
    if (!t || texts.has(t)) p.push(`problema vazio ou repetido: ${pr.id}`);
    texts.add(t);
    if (!pr.category?.trim()) p.push(`problema sem categoria: ${pr.id}`);
    if (new Set(pr.materials).size < 8) p.push(`${pr.id}: precisa de pelo menos 8 materiais distintos`);
    for (const mid of pr.materials) if (!ids.has(mid)) p.push(`${pr.id}: material inexistente ${mid}`);
  }
  return p;
}
