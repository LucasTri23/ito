import { describe, expect, it } from "vitest";
import { chooseAlibiRoles, emptyAlibiHistory, recordAlibiRoles, tallyAlibiVotes } from "../src/utils/alibi";

describe("Álibi Furado: regras puras", () => {
  it.each([2, 3, 4, 5, 6, 7, 8])("distribui papéis para %i pessoas", (n) => {
    const ids = Array.from({ length: n }, (_, i) => String(i));
    const roles = chooseAlibiRoles(ids, emptyAlibiHistory());
    expect(roles.suspects).toHaveLength(2);
    expect(roles.investigator === null).toBe(n === 2);
    expect(roles.jurors).toHaveLength(Math.max(0, n - 3));
    expect(new Set([...roles.suspects, ...(roles.investigator ? [roles.investigator] : []), ...roles.jurors])).toEqual(new Set(ids));
  });
  it("equilibra suspeitos e alterna duplas equivalentes", () => {
    let history = emptyAlibiHistory();
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      const roles = chooseAlibiRoles(["a", "b", "c", "d"], history);
      seen.add(roles.pairKey);
      history = recordAlibiRoles(history, roles);
    }
    expect(seen.size).toBe(6);
    expect(Object.values(history.suspects)).toEqual([3, 3, 3, 3]);
  });
  it("rejeita participantes repetidos", () => expect(() => chooseAlibiRoles(["a", "a"], emptyAlibiHistory())).toThrow());
  it("apura maioria, empate e ausência de votos", () => {
    expect(tallyAlibiVotes(["colou", "colou", "furado"]).result).toBe("colou");
    expect(tallyAlibiVotes(["colou", "furado"]).result).toBe("empate");
    expect(tallyAlibiVotes([]).result).toBe("sem-veredito");
  });
});
