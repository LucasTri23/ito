const catalog = require("../src/data/biblicalAds.json");
const failures = [];
if (catalog.length < 60) failures.push(`São necessários 60 objetos verificados; existem ${catalog.length}.`);
const ids = new Set(), names = new Set();
for (const item of catalog) {
  for (const field of ["id", "name", "category", "context", "summary", "reference", "url"]) {
    if (typeof item[field] !== "string" || !item[field].trim()) failures.push(`Campo ${field} ausente: ${item.id || "sem ID"}.`);
  }
  if (ids.has(item.id)) failures.push(`ID duplicado: ${item.id}.`);
  ids.add(item.id);
  const name = String(item.name || "").trim().toLocaleLowerCase("pt-BR");
  if (names.has(name)) failures.push(`Objeto duplicado: ${item.name}.`);
  names.add(name);
  try {
    const url = new URL(item.url);
    if (url.protocol !== "https:" || url.hostname !== "www.jw.org") failures.push(`URL não oficial: ${item.id}.`);
  } catch { failures.push(`URL inválida: ${item.id}.`); }
}
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log(`Catálogo validado: ${catalog.length} objetos. A leitura das fontes exige revisão editorial.`);
