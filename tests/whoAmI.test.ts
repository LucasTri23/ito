import { describe, expect, it } from "vitest";
import { identities, identityCategories } from "../src/data/whoAmI";
import { drawIdentity } from "../src/utils/whoAmI";

describe("Quem sou eu", () => {
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
