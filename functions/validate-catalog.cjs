const catalog = require("../src/data/alibi.json");
const errors = [];
if (catalog.length < 300) errors.push(`São necessárias 300 situações; existem ${catalog.length}.`);
const ids = new Set(), situations = new Set();
for (const item of catalog) {
  if (!item.id || ids.has(item.id)) errors.push(`ID ausente ou repetido: ${item.id}`);
  ids.add(item.id);
  const normalized = String(item.situation || "").trim().toLocaleLowerCase("pt-BR");
  if (!normalized || situations.has(normalized)) errors.push(`Situação vazia ou repetida: ${item.id}`);
  situations.add(normalized);
  if (!item.category || !Array.isArray(item.questions) || item.questions.length !== 3 || item.questions.some(q => typeof q !== "string" || !q.trim()) || new Set(item.questions.map(q => q.trim().toLocaleLowerCase("pt-BR"))).size !== 3) errors.push(`Categoria ou perguntas inválidas: ${item.id}`);
}
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`Catálogo validado: ${catalog.length} situações.`);
