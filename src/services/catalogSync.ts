// Busca no Firestore versões mais novas dos catálogos de temas.
// Estrutura: catalogs/meta { version, parts: { [nome]: quantidade de partes } }
// e catalogs/{nome}-{n} { items: [...] }. Uma cópia fica no aparelho (localStorage).
import { doc, getDoc } from "firebase/firestore";
import { configured, db } from "../lib/firebase";
import { catalogs, mergeById } from "../data/catalogs";

const CACHE_KEY = "jogatina.catalogs";
interface Cache {
  version: string;
  data: Record<string, unknown[]>;
}

function readCache(): Cache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Cache) : null;
  } catch {
    return null;
  }
}

function apply(data: Record<string, unknown[]>) {
  let changed = 0;
  for (const c of catalogs) if (Array.isArray(data[c.name])) changed += mergeById(c.items, data[c.name]);
  return changed;
}

/** Aplica na hora a última versão baixada (funciona sem internet). */
export function applyCachedCatalogs() {
  const cache = readCache();
  return cache ? apply(cache.data) : 0;
}

/** Confere a versão publicada (1 leitura) e só baixa as partes quando ela mudou. */
export async function refreshCatalogs() {
  if (!configured) return 0;
  try {
    const meta = await getDoc(doc(db, "catalogs", "meta"));
    if (!meta.exists()) return 0;
    const { version, parts } = meta.data() as { version: string; parts: Record<string, number> };
    if (readCache()?.version === version) return 0;
    const data: Record<string, unknown[]> = {};
    await Promise.all(
      Object.entries(parts).map(async ([name, count]) => {
        const chunks = await Promise.all(
          Array.from({ length: count }, (_, i) => getDoc(doc(db, "catalogs", `${name}-${i}`))),
        );
        data[name] = chunks.flatMap((s) => (s.data()?.items as unknown[]) ?? []);
      }),
    );
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ version, data }));
    } catch {
      /* sem espaço: usa só nesta visita */
    }
    return apply(data);
  } catch {
    return 0; // sem conexão ou regras não publicadas: segue com o catálogo empacotado
  }
}
