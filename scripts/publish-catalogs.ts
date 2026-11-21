// Publica os catálogos do repositório no Firestore.
//   npm run catalogs:publish -- --dry-run      mostra o que seria enviado
//   npm run catalogs:publish                   envia (precisa de credencial de administrador)
// Credencial: GOOGLE_APPLICATION_CREDENTIALS=caminho/da/chave.json (conta de serviço do projeto)
// ou `gcloud auth application-default login`. Projeto: FIREBASE_PROJECT_ID ou VITE_FIREBASE_PROJECT_ID do .env.
// Com FIRESTORE_EMULATOR_HOST definido, publica no emulador.
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { catalogs } from "../src/data/catalogs";

const MAX_BYTES = 700_000; // folga abaixo do limite de 1 MiB por documento
const dryRun = process.argv.includes("--dry-run");

function envProject() {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  if (existsSync(".env")) {
    const m = readFileSync(".env", "utf8").match(/^VITE_FIREBASE_PROJECT_ID=(.*)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
}

function chunk(items: unknown[]) {
  const parts: unknown[][] = [[]];
  let size = 0;
  for (const item of items) {
    const bytes = Buffer.byteLength(JSON.stringify(item));
    if (size + bytes > MAX_BYTES && parts[parts.length - 1].length) {
      parts.push([]);
      size = 0;
    }
    parts[parts.length - 1].push(item);
    size += bytes;
  }
  return parts;
}

async function main() {
  const plan = catalogs.map((c) => {
    // Cópia "limpa" (só dados JSON), igual ao que o site recebe.
    const items = JSON.parse(JSON.stringify(c.items)) as unknown[];
    return { name: c.name, parts: chunk(items), count: items.length };
  });
  const version = createHash("sha256").update(JSON.stringify(plan.map((p) => [p.name, p.parts]))).digest("hex").slice(0, 16);
  for (const p of plan) console.log(`${p.name.padEnd(16)} ${String(p.count).padStart(5)} itens em ${p.parts.length} documento(s)`);
  console.log(`versão ${version}`);
  if (dryRun) return;
  const projectId = envProject();
  if (!projectId) throw new Error("Defina FIREBASE_PROJECT_ID (ou VITE_FIREBASE_PROJECT_ID no .env).");
  const app = process.env.FIRESTORE_EMULATOR_HOST ? initializeApp({ projectId }) : initializeApp({ projectId, credential: applicationDefault() });
  const databaseId = process.env.VITE_FIREBASE_DATABASE_ID?.trim() || "(default)";
  const db = databaseId === "(default)" ? getFirestore(app) : getFirestore(app, databaseId);
  const batch = db.batch();
  const parts: Record<string, number> = {};
  for (const p of plan) {
    parts[p.name] = p.parts.length;
    p.parts.forEach((items, i) => batch.set(db.doc(`catalogs/${p.name}-${i}`), { items }));
  }
  // A meta vai por último no mesmo lote: o site só vê a versão nova quando todas as partes existem.
  batch.set(db.doc("catalogs/meta"), { version, parts, updatedAt: new Date() });
  await batch.commit();
  console.log(`Publicado em ${projectId}${process.env.FIRESTORE_EMULATOR_HOST ? " (emulador)" : ""}.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
