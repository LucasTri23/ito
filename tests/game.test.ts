import { describe, it, expect } from "vitest";
import { randomInt, roomCode, shuffle } from "../src/utils/game";
describe("sorteios", () => {
  it("gera códigos sem caracteres ambíguos", () => {
    for (let i = 0; i < 100; i++)
      expect(roomCode()).toMatch(/^[A-HJ-NP-Z2-9]{5}$/);
  });
  it("preserva participantes sem alterar a entrada", () => {
    const ids = ["a", "b", "c", "d"];
    expect(shuffle(ids).sort()).toEqual(ids);
    expect(ids).toEqual(["a", "b", "c", "d"]);
  });
  it("mantém números entre 1 e 100", () => {
    for (let i = 0; i < 1000; i++) {
      const n = randomInt(100) + 1;
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(100);
    }
  });
});
