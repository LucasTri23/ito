// Registro de todos os catálogos de temas. Os arquivos do repositório são a fonte
// (validados pelos testes); `npm run catalogs:publish` envia este conteúdo ao Firestore
// e o site aplica as versões mais novas por cima das empacotadas (ver services/catalogSync.ts).
import alibi from "./alibi.json";
import planB from "./planB.json";
import manual from "./manual.json";
import feira from "./feira.json";
import { numberTopics, rankingTopics } from "./partyGames";
import { identities } from "./whoAmI";

export interface CatalogEntry {
  name: string;
  /** Lista viva usada pelos jogos; a sincronização altera esta mesma lista. */
  items: { id: string }[];
}

export const catalogs: CatalogEntry[] = [
  { name: "alibi", items: alibi },
  { name: "planB", items: planB },
  { name: "manual", items: manual },
  { name: "feiraMaterials", items: feira.materials },
  { name: "feiraProblems", items: feira.problems },
  { name: "numbers", items: numberTopics },
  { name: "rankings", items: rankingTopics },
  { name: "identities", items: identities },
];

/**
 * Junta itens novos na lista viva, pelo id: substitui os que mudaram e
 * acrescenta os novos. Nunca remove, para não quebrar rodadas em andamento.
 * Retorna quantos itens mudaram.
 */
export function mergeById<T extends { id: string }>(target: T[], incoming: unknown[]): number {
  const index = new Map(target.map((item, i) => [item.id, i]));
  let changed = 0;
  for (const raw of incoming) {
    if (!raw || typeof raw !== "object" || typeof (raw as { id?: unknown }).id !== "string") continue;
    const item = raw as T;
    const at = index.get(item.id);
    if (at === undefined) {
      index.set(item.id, target.length);
      target.push(item);
      changed++;
    } else if (JSON.stringify(target[at]) !== JSON.stringify(item)) {
      target[at] = item;
      changed++;
    }
  }
  return changed;
}
