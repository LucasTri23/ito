import { describe, expect, it } from "vitest";
import { catalogs, mergeById } from "../src/data/catalogs";

describe("Catálogos sincronizados", () => {
  it("junta pelo id: atualiza, acrescenta e nunca remove", () => {
    const list = [
      { id: "a", v: 1 },
      { id: "b", v: 1 },
    ];
    const changed = mergeById(list, [{ id: "b", v: 2 }, { id: "c", v: 1 }, { nope: true }, null]);
    expect(changed).toBe(2);
    expect(list).toEqual([
      { id: "a", v: 1 },
      { id: "b", v: 2 },
      { id: "c", v: 1 },
    ]);
    expect(mergeById(list, [{ id: "a", v: 1 }])).toBe(0);
  });
  it("todos os catálogos têm ids únicos e cabem no envio", () => {
    for (const c of catalogs) {
      expect(c.items.length, c.name).toBeGreaterThan(0);
      expect(new Set(c.items.map((i) => i.id)).size, c.name).toBe(c.items.length);
      for (const item of c.items) expect(Buffer.byteLength(JSON.stringify(item)), `${c.name}/${item.id}`).toBeLessThan(700_000);
    }
  });
});
