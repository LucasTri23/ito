import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Round, Secret } from "../src/types/game";
const snapshot = vi.hoisted(() => ({ value: [] as Secret[], error: "" }));
vi.mock("../src/hooks/useFirestore", () => ({ useSecrets: () => snapshot }));
import { Result } from "../src/components/Result";

const round: Round = {
  state: "RESULT",
  theme: "Times",
  lowLabel: "Pouco",
  highLabel: "Muito",
  playerIds: ["karen", "lucas"],
  presentationOrder: ["karen", "lucas"],
  groupOrder: ["karen", "lucas"],
  currentPresentationIndex: 1,
  createdAt: null,
};
const answers = [
  {
    playerId: "karen",
    playerName: "Karen",
    answer: "Cruzeiro",
    skipped: false,
  },
  {
    playerId: "lucas",
    playerName: "Lucas",
    answer: "Internacional",
    skipped: false,
  },
];
function render() {
  return renderToStaticMarkup(
    <Result path="rooms/ABCDE/rounds/1" round={round} answers={answers} />,
  );
}
describe("resultado geral", () => {
  it("não apresenta um número local como classificação completa", () => {
    snapshot.value = [{ playerId: "lucas", number: 80 }];
    snapshot.error = "";
    const html = render();
    expect(html).toContain("Aguardando os números de todos");
    expect(html).not.toContain("Ordem real");
    expect(html).not.toContain("posições em sintonia");
  });
  it("inclui todos na ordem real crescente quando os números chegam", () => {
    snapshot.value = [
      { playerId: "lucas", number: 80 },
      { playerId: "karen", number: 30 },
    ];
    snapshot.error = "";
    const html = render().split("Ordem real")[1];
    expect(html).toContain("Karen");
    expect(html).toContain("Lucas");
    expect(html.indexOf("Karen")).toBeLessThan(html.indexOf("Lucas"));
  });
  it("oferece recuperação sem mostrar ranking quando há erro de permissão", () => {
    snapshot.error = "permission-denied";
    const html = render();
    expect(html).toContain("Carregar resultado novamente");
    expect(html).not.toContain("Ordem real");
    snapshot.error = "";
  });
});
