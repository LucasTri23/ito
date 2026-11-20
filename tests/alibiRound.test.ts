import { describe, expect, it } from "vitest";
import { alibiView, applyAlibiAction, type AlibiRound } from "../src/utils/alibiRound";

function round(count: number): AlibiRound {
  return { id: "1", host: "a", suspects: ["a", "b"], investigator: count >= 3 ? "c" : null, jurors: ["d", "e", "f", "g", "h"].slice(0, Math.max(0, count - 3)), phase: "presentation", deadline: null, questions: ["Quem?", "Onde?", "Como?"], answers: {}, votes: {}, result: null };
}
const act = (r: AlibiRound, actor: string, now: number, action: Parameters<typeof applyAlibiAction>[4]) => applyAlibiAction(r, "1", actor, now, action);

describe("Álibi: transições de rodada", () => {
  it.each([2, 3, 5, 8])("conclui rodada para %i pessoas", (count) => {
    let r = act(round(count), "a", 100, { type: "start" });
    expect(r.deadline).toBe(30100);
    expect(() => act(r, "b", 30099, { type: "tick" })).toThrow();
    r = act(r, "b", 30100, { type: "tick" });
    if (count > 2) r = act(r, "c", 30101, { type: "question", question: "Qual era a cor?" });
    expect(r.phase).toBe("answers");
    r = act(r, "a", 30102, { type: "answer", answers: ["um", "dois", "três"] });
    expect(() => act(r, "a", 30103, { type: "answer", answers: ["x", "y", "z"] })).toThrow();
    r = act(r, "b", 30103, { type: "answer", answers: ["um", "dois", "três"] });
    expect(r.phase).toBe("reveal");
    r = act(r, "a", 30104, { type: "beginVote" });
    const voters = count === 2 ? ["a"] : count === 3 ? ["c"] : r.jurors;
    for (const voter of voters) r = act(r, voter, 30105, { type: "vote", choice: "colou" });
    expect(r.result?.result).toBe("colou");
    expect(r.phase).toBe("result");
  });
  it("usa fallback quando a pergunta expira, inclusive após retorno atrasado", () => {
    let r = act(round(3), "a", 0, { type: "start" });
    r = act(r, "b", 50000, { type: "tick" });
    expect(r.phase).toBe("answers");
    expect(r.questions[2]).toBe("Como?");
  });
  it("bloqueia ações antigas e de papéis inelegíveis", () => {
    const r = act(round(3), "a", 0, { type: "start" });
    expect(() => applyAlibiAction(r, "0", "a", 0, { type: "cancel" })).toThrow();
    expect(() => act(r, "b", 0, { type: "cancel" })).toThrow();
    const surprise = act(r, "b", 30000, { type: "tick" });
    expect(() => act(surprise, "a", 30001, { type: "question", question: "Teste?" })).toThrow();
    expect(() => act(surprise, "c", 45000, { type: "question", question: "Teste?" })).toThrow();
  });
  it("apura empate ou ausência de votos ao expirar", () => {
    let r = { ...round(5), phase: "vote" as const, deadline: 100 };
    r = act(r, "d", 1, { type: "vote", choice: "colou" }) as typeof r;
    r = act(r, "e", 2, { type: "vote", choice: "furado" }) as typeof r;
    expect(r.result?.result).toBe("empate");
    const empty = act({ ...round(3), phase: "vote", deadline: 100 }, "a", 100, { type: "tick" });
    expect(empty.result?.result).toBe("sem-veredito");
  });
  it("não projeta perguntas cedo nem respostas ou votos alheios antes da revelação", () => {
    const initial = round(5);
    expect(alibiView(initial, "a").questions).toEqual([]);
    const surprise = { ...initial, phase: "surprise" as const };
    expect(alibiView(surprise, "c").questions).toEqual(["Quem?", "Onde?"]);
    expect(alibiView(surprise, "a").questions).toEqual([]);
    const answering: AlibiRound = { ...initial, phase: "answers", answers: { a: ["segredo", "x", "y"] }, votes: { d: "furado" } };
    expect(alibiView(answering, "b").answers).toEqual({});
    expect(alibiView(answering, "a").answers.a[0]).toBe("segredo");
    expect(alibiView(answering, "c")).not.toHaveProperty("votes");
    expect(() => alibiView(answering, "intruso")).toThrow();
    expect(alibiView({ ...answering, phase: "reveal" }, "c").answers.a[0]).toBe("segredo");
  });
});
