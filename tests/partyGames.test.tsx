import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { numberTopics, rankingTopics } from "../src/data/partyGames";
import {
  initialPartyState,
  partyReducer,
  drawPartyTopic,
} from "../src/utils/partyGames";
import { PartyAnswer, PartyGame } from "../src/pages/PartyGame";

describe("Novos jogos presenciais", () => {
  it("tem perguntas completas e rankings com exatamente dez posições distintas", () => {
    expect(numberTopics.length).toBeGreaterThanOrEqual(20);
    expect(rankingTopics.length).toBeGreaterThanOrEqual(10);
    const topics = [...numberTopics, ...rankingTopics];
    expect(new Set(topics.map((topic) => topic.id)).size).toBe(topics.length);
    for (const topic of topics) {
      expect(topic.question.length).toBeGreaterThan(20);
      expect(topic.scope.length).toBeGreaterThan(10);
      expect(topic.checkedAt).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(topic.sources.length).toBeGreaterThan(0);
      for (const source of topic.sources)
        expect(new URL(source.url).protocol).toBe("https:");
      if (topic.kind === "number") expect(topic.answer).toMatch(/\d/);
      else {
        expect(topic.items).toHaveLength(10);
        expect(new Set(topic.items.map((item) => item.name)).size).toBe(10);
        expect(topic.items.every((item) => item.name && item.value)).toBe(true);
      }
    }
  });
  it("esconde a resposta em Geral joga, revela ao clicar e esconde na próxima rodada", () => {
    let state = partyReducer(initialPartyState, {
      type: "draw",
      id: numberTopics[0].id,
      seen: [],
    });
    expect(state.revealed).toBe(false);
    state = partyReducer(state, { type: "reveal" });
    expect(state.revealed).toBe(true);
    state = partyReducer(state, {
      type: "draw",
      id: numberTopics[1].id,
      seen: [],
    });
    expect(state.revealed).toBe(false);
  });
  it("ADM já vê as respostas e voltar a Geral joga volta a escondê-las", () => {
    let state = partyReducer(initialPartyState, {
      type: "mode",
      mode: "admin",
    });
    for (const topic of [numberTopics[0], rankingTopics[0]]) {
      state = partyReducer(state, { type: "draw", id: topic.id, seen: [] });
      expect(state.revealed).toBe(true);
    }
    const id = state.currentId;
    state = partyReducer(state, { type: "mode", mode: "everyone" });
    expect(state.currentId).toBe(id);
    expect(state.revealed).toBe(false);
  });
  it("não inclui respostas, notas ou fontes na marcação antes de revelar", () => {
    for (const topic of [numberTopics[0], rankingTopics[0]]) {
      const hidden = renderToStaticMarkup(
        <PartyAnswer topic={topic} visible={false} />,
      );
      const visible = renderToStaticMarkup(
        <PartyAnswer topic={topic} visible />,
      );
      expect(hidden).not.toContain(topic.note);
      expect(hidden).not.toContain("<a ");
      if (topic.kind === "number") {
        expect(hidden).not.toContain(topic.answer);
        expect(visible).toContain(topic.answer);
      } else {
        expect(hidden).not.toContain(topic.items[0].name);
        expect(visible.match(/<li>/g)).toHaveLength(10);
        expect(visible.indexOf(topic.items[0].name)).toBeLessThan(
          visible.indexOf(topic.items[9].name),
        );
      }
    }
  });
  it("filtra categorias, não repete durante o ciclo e não trava com apenas um tema", () => {
    for (const topics of [numberTopics, rankingTopics]) {
      let state = { ...initialPartyState, category: topics[0].category };
      const size = topics.filter(
        (topic) => topic.category === state.category,
      ).length;
      for (let i = 0; i < size; i++) {
        const next = drawPartyTopic(topics, state);
        expect(state.seen).not.toContain(next.id);
        expect(topics.find((topic) => topic.id === next.id)?.category).toBe(
          state.category,
        );
        state = partyReducer(state, { type: "draw", ...next });
      }
      const next = drawPartyTopic(topics, state);
      if (size > 1) expect(next.id).not.toBe(state.currentId);
      expect(next.seen).toHaveLength(1);
    }
    const only = numberTopics[0];
    expect(
      drawPartyTopic([only], {
        ...initialPartyState,
        seen: [only.id],
        currentId: only.id,
      }).id,
    ).toBe(only.id);
  });
  it("trocar categoria limpa a rodada e as duas páginas começam sem resposta", () => {
    const state = partyReducer(
      { ...initialPartyState, currentId: "old", seen: ["old"], revealed: true },
      { type: "category", category: "Games" },
    );
    expect(state.currentId).toBeUndefined();
    expect(state.seen).toEqual([]);
    expect(state.revealed).toBe(false);
    for (const game of ["number", "ranking"] as const) {
      const html = renderToStaticMarkup(<PartyGame game={game} />);
      expect(html).toContain("Geral joga");
      expect(html).toContain("Temos ADM");
      expect(html).toContain("Sortear tema");
      expect(html).not.toContain("party-answer");
    }
  });
});
