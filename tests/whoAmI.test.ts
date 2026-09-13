import { describe, expect, it } from "vitest";
import { identities, identityCategories } from "../src/data/whoAmI";
import { drawIdentity } from "../src/utils/whoAmI";

describe("Quem sou eu", () => {
  it("tem pelo menos 200 nomes únicos por categoria e três dicas distintas em cada carta", () => {
    for (const category of identityCategories) {
      const entries = identities.filter(
        (entry) => entry.category === category.id,
      );
      expect(entries.length).toBeGreaterThanOrEqual(200);
      expect(
        new Set(entries.map((entry) => entry.name.toLocaleLowerCase("pt-BR")))
          .size,
      ).toBe(entries.length);
      for (const entry of entries) {
        expect(entry.hints).toHaveLength(3);
        expect(new Set(entry.hints).size).toBe(3);
        expect(entry.hints.every((hint) => hint.trim().length > 10)).toBe(true);
        expect(entry.id).not.toMatch(/^(characters|screen|bible)-\d+$/);
      }
    }
  });
  it("inclui os pedidos e os protagonistas dos 54 capítulos de Ande Corajosamente", () => {
    const names = new Set(
      identities
        .filter((entry) => entry.category === "bible")
        .map((entry) => entry.name),
    );
    const required = [
      "Zaqueu",
      "Matias",
      "Nabucodonosor",
      "Satanás",
      "Judas Iscariotes",
      "Jezabel",
      "Enoque",
      "Noé",
      "Sara",
      "Abraão",
      "Rebeca",
      "Jacó",
      "José (filho de Jacó)",
      "Sifrá",
      "Puá",
      "Anrão",
      "Joquebede",
      "Miriã",
      "Moisés",
      "Calebe",
      "Josué",
      "Raabe",
      "Noemi",
      "Rute",
      "Baraque",
      "Débora",
      "Jael",
      "Gideão",
      "Jefté",
      "Filha de Jefté",
      "Sansão",
      "Samuel",
      "Jonatã",
      "Davi",
      "Abigail",
      "Natã",
      "Mefibosete",
      "Asa",
      "Elias",
      "Viúva de Sarefá",
      "Menina israelita",
      "Eliseu",
      "Jeoiada",
      "Ezequias",
      "Manassés (rei de Judá)",
      "Josias",
      "Daniel",
      "Sadraque (Hananias)",
      "Mesaque (Misael)",
      "Abede-Nego (Azarias)",
      "Ester",
      "Neemias",
      "Zacarias (pai de João Batista)",
      "Elisabete",
      "Maria (mãe de Jesus)",
      "José (marido de Maria)",
      "João Batista",
      "Pedro",
      "Maria Madalena",
      "Maria (irmã de Lázaro)",
      "Estêvão",
      "Paulo (Saulo)",
      "Barnabé",
      "Marcos",
      "João (apóstolo)",
    ];
    for (const name of required) expect(names.has(name), name).toBe(true);
    expect(
      [...names].filter((name) => /^(Paulo|Saulo)/.test(name)),
    ).toHaveLength(1);
  });
  it("sorteia apenas a categoria selecionada, sem repetir até esgotar", () => {
    for (const category of identityCategories) {
      const size = identities.filter((i) => i.category === category.id).length;
      let seen: string[] = [];
      for (let i = 0; i < size; i++) {
        const next = drawIdentity(category.id, seen);
        expect(next.entry.category).toBe(category.id);
        expect(seen).not.toContain(next.entry.id);
        seen = next.seen;
      }
      const next = drawIdentity(category.id, seen, seen.at(-1));
      expect(next.entry.id).not.toBe(seen.at(-1));
      expect(next.seen).toHaveLength(1);
    }
  });
  it("todas as cartas bíblicas têm fonte direta no jw.org e descrição", () => {
    const bible = identities.filter((i) => i.category === "bible");
    expect(bible.length).toBeGreaterThan(0);
    for (const entry of bible) {
      expect(new URL(entry.source!).hostname).toBe("www.jw.org");
      expect(entry.description.length).toBeGreaterThan(30);
    }
    expect(new Set(identities.map((i) => i.id)).size).toBe(identities.length);
  });
});
