import { describe, it, expect } from "vitest";
import {
  HOST_TAKEOVER_MINUTES,
  hostAway,
  pickSuccessor,
  randomInt,
  roomCode,
  shuffle,
} from "../src/utils/game";
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
const at = (ms: number) => ({ toMillis: () => ms });
describe("saída e transferência de anfitrião", () => {
  const players = [
    { uid: "host", connected: true, joinedAt: at(1) },
    { uid: "c", connected: true, joinedAt: at(30) },
    { uid: "b", connected: true, joinedAt: at(20) },
    { uid: "a", connected: false, joinedAt: at(10) },
  ];
  it("escolhe o conectado que entrou primeiro, sem incluir quem sai", () => {
    expect(pickSuccessor(players, "host")?.uid).toBe("b");
    expect(players.map((p) => p.uid)).toEqual(["host", "c", "b", "a"]);
  });
  it("usa o desconectado mais antigo se ninguém estiver conectado", () => {
    const off = players.map((p) => ({ ...p, connected: false }));
    expect(pickSuccessor(off, "host")?.uid).toBe("a");
  });
  it("desempata por uid e não devolve ninguém quando só resta quem sai", () => {
    const tie = [
      { uid: "z", connected: true, joinedAt: at(5) },
      { uid: "y", connected: true, joinedAt: at(5) },
    ];
    expect(pickSuccessor(tie, "x")?.uid).toBe("y");
    expect(pickSuccessor([players[0]], "host")).toBeUndefined();
  });
  it("só considera o anfitrião ausente após o prazo de desconexão", () => {
    const limit = HOST_TAKEOVER_MINUTES * 60_000;
    const host = { uid: "h", connected: false, presenceAt: at(1_000) };
    expect(hostAway(host, 1_000 + limit - 1)).toBe(false);
    expect(hostAway(host, 1_000 + limit + 1)).toBe(true);
    expect(hostAway({ ...host, connected: true }, 1e12)).toBe(false);
    expect(hostAway({ uid: "h", connected: false }, 1e12)).toBe(false);
    expect(hostAway(undefined, 0)).toBe(true);
  });
});
