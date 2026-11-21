import { describe, expect, it } from "vitest";
import planB from "../src/data/planB.json";
import manual from "../src/data/manual.json";
import feira from "../src/data/feira.json";
import { missionProblems, type PlanBMission } from "../src/utils/planB";
import { challengeProblems, distributeClues, solutions, clueText, type Challenge } from "../src/utils/manual";
import { feiraProblems, type FeiraCatalog } from "../src/utils/feira";

describe("Catálogo do Plano B", () => {
  const missions = planB as PlanBMission[];
  it("tem pelo menos 20 missões com ids e textos únicos", () => {
    expect(missions.length).toBeGreaterThanOrEqual(20);
    expect(new Set(missions.map((m) => m.id)).size).toBe(missions.length);
    expect(new Set(missions.map((m) => m.mission.trim().toLowerCase())).size).toBe(missions.length);
  });
  it.each(missions.map((m) => [m.id, m] as const))("%s é válida", (_, m) => {
    expect(missionProblems(m)).toEqual([]);
  });
});

describe("Catálogo do Manual Desmontado", () => {
  const challenges = manual as Challenge[];
  it("tem pelo menos 15 desafios com ids únicos", () => {
    expect(challenges.length).toBeGreaterThanOrEqual(15);
    expect(new Set(challenges.map((c) => c.id)).size).toBe(challenges.length);
  });
  it.each(challenges.map((c) => [c.id, c] as const))("%s tem solução única e pistas que dependem da equipe", (_, c) => {
    expect(challengeProblems(c)).toEqual([]);
  });
  it("o exemplo das regras funciona", () => {
    const pieces = ["botao", "ventilador", "resistencia", "sensor"];
    const clues = [
      { type: "first", a: "botao" },
      { type: "right", a: "ventilador", b: "resistencia" },
      { type: "last", a: "sensor" },
    ] as const;
    expect(solutions(pieces, [...clues])).toEqual([["botao", "ventilador", "resistencia", "sensor"]]);
    expect(distributeClues([...clues], 2)[0]).toHaveLength(2);
    expect(clueText(clues[1], pieces.map((id) => ({ id, name: id })))).toContain("imediatamente antes");
  });
});

describe("Catálogo da Feira de Invenções", () => {
  const cat = feira as FeiraCatalog;
  it("tem pelo menos 30 problemas e 30 materiais válidos", () => {
    expect(cat.materials.length).toBeGreaterThanOrEqual(30);
    expect(cat.problems.length).toBeGreaterThanOrEqual(30);
    expect(feiraProblems(cat)).toEqual([]);
  });
  it("tem categorias variadas", () => {
    expect(new Set(cat.materials.map((m) => m.category)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(cat.problems.map((p) => p.category)).size).toBeGreaterThanOrEqual(5);
  });
});
