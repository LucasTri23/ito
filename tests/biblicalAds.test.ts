import { describe, expect, it } from "vitest";
import { biblicalAdStyles, selectOnlineRoles, selectSellers, tallyPhysicalVotes, tallyWrittenVotes } from "../src/utils/biblicalAds";

describe("Anúncios bíblicos: regras do presencial", () => {
  it.each([2, 3, 4, 5, 6, 7, 8])("seleciona vendedores para %i pessoas", n => {
    const ids = Array.from({ length: n }, (_, i) => `p${i}`);
    const count = n >= 5 ? 3 : 2;
    const sellers = selectSellers(ids, {}, count, 0);
    expect(sellers).toHaveLength(count);
    expect(new Set(sellers).size).toBe(count);
    expect(sellers.every(id => ids.includes(id))).toBe(true);
  });
  it("prioriza quem vendeu menos e alterna a ordem", () => {
    expect(selectSellers(["a", "b", "c"], { a: 2, b: 0, c: 0 }, 2, 0)).toEqual(["b", "c"]);
    expect(selectSellers(["a", "b"], {}, 2, 0)).not.toEqual(selectSellers(["a", "b"], {}, 2, 1));
  });
  it("distingue ausência de votos, ninguém comprou, vitória e empate", () => {
    const sellers = ["a", "b"];
    expect(tallyPhysicalVotes(sellers, {}).status).toBe("sem-votacao");
    expect(tallyPhysicalVotes(sellers, { a: ["nao-compro"] }).status).toBe("ninguem-comprou");
    expect(tallyPhysicalVotes(sellers, { a: ["compro", "compro"], b: ["compro"] }).winners).toEqual(["a"]);
    expect(tallyPhysicalVotes(sellers, { a: ["compro"], b: ["compro"] }).status).toBe("empate");
  });
  it("alterna o comprador no trio e mantém todos como autores em outros tamanhos", () => {
    expect(selectOnlineRoles(["a", "b", "c"], { a: 1 }, 0)).toEqual({ buyer: "b", authors: ["a", "c"] });
    expect(selectOnlineRoles(["a", "b", "c", "d"], {}, 0)).toEqual({ buyer: null, authors: ["a", "b", "c", "d"] });
  });
  it("oferece pelo menos oito estilos distintos", () => expect(new Set(biblicalAdStyles).size).toBeGreaterThanOrEqual(8));
  it("bloqueia voto próprio, duplicado ou inválido e apura empate", () => {
    const ads = { x: "a", y: "b" }, voters = ["a", "b"];
    expect(() => tallyWrittenVotes(ads, voters, [{ voterId: "a", adId: "x" }])).toThrow();
    expect(() => tallyWrittenVotes(ads, voters, [{ voterId: "a", adId: "y" }, { voterId: "a", adId: "y" }])).toThrow();
    expect(tallyWrittenVotes(ads, voters, [{ voterId: "a", adId: "y" }, { voterId: "b", adId: "x" }]).status).toBe("empate");
    expect(tallyWrittenVotes(ads, voters, []).status).toBe("sem-vencedor");
    expect(tallyWrittenVotes({ x: "a" }, voters, []).status).toBe("sem-escolha");
  });
});
