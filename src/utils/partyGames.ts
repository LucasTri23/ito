import { randomInt } from "./game";
import type { PartyMode, PartyTopic } from "../data/partyGames";
export interface PartyState {
  mode: PartyMode;
  category: string;
  currentId?: string;
  seen: string[];
  revealed: boolean;
}
export const initialPartyState: PartyState = {
  mode: "everyone",
  category: "Todas",
  seen: [],
  revealed: false,
};
export type PartyAction =
  | { type: "mode"; mode: PartyMode }
  | { type: "category"; category: string }
  | { type: "draw"; id: string; seen: string[] }
  | { type: "reveal" };
export function partyReducer(
  state: PartyState,
  action: PartyAction,
): PartyState {
  switch (action.type) {
    case "mode":
      return { ...state, mode: action.mode, revealed: action.mode === "admin" };
    case "category":
      return {
        ...state,
        category: action.category,
        currentId: undefined,
        seen: [],
        revealed: state.mode === "admin",
      };
    case "draw":
      return {
        ...state,
        currentId: action.id,
        seen: action.seen,
        revealed: state.mode === "admin",
      };
    case "reveal":
      return state.currentId ? { ...state, revealed: true } : state;
  }
}
export function drawPartyTopic(topics: PartyTopic[], state: PartyState) {
  const pool = topics.filter(
    (topic) => state.category === "Todas" || topic.category === state.category,
  );
  if (!pool.length) throw new Error("Não há temas nesta categoria.");
  let seen = state.seen.filter((id) => pool.some((topic) => topic.id === id));
  let available = pool.filter((topic) => !seen.includes(topic.id));
  if (!available.length) {
    seen = [];
    available =
      pool.length > 1
        ? pool.filter((topic) => topic.id !== state.currentId)
        : pool;
  }
  const next = available[randomInt(available.length)];
  return { id: next.id, seen: [...seen, next.id] };
}
