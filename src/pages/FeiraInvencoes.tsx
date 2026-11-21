import { PitchGame, type PitchConfig } from "./PitchGame";
import { feira } from "../services/feira";

const config: PitchConfig = {
  game: "feira",
  route: "feira-de-invencoes",
  title: "Feira de Invenções",
  badge: "💡",
  tone: "tone-mint",
  eyebrow: "ONLINE OU PRESENCIAL · 2 A 8 JOGADORES",
  pitch:
    "A sala recebe um problema engraçado. Cada inventor recebe um material diferente em segredo e tem 45 segundos para inventar um produto que use esse material. Vale função absurda!",
  steps: [
    ["🤔", "Um problema para resolver"],
    ["🧰", "Um material secreto para cada inventor"],
    ["🛒", "A turma escolhe o que compraria"],
  ],
  note: "No modo online, as invenções são escritas e votadas no site. No presencial, cada inventor apresenta em voz alta e a plateia vota “Compro” ou “Não compro” pelo celular.",
  seconds: 45,
  topicText: (id) => feira.problems.find((p) => p.id === id)?.text ?? "",
  secretName: (id) => feira.materials.find((m) => m.id === id)?.name ?? "…",
  t: {
    person: "inventor",
    people: "inventores",
    People: "Inventores",
    thing: "invenção",
    things: "invenções",
    Thing: "Invenção",
    Things: "Invenções",
    thingGender: "a",
    topicEyebrow: "PROBLEMA DA FEIRA",
    secretEyebrow: "SEU MATERIAL SECRETO",
    secretHint: "Ele precisa fazer parte da invenção.",
    secretIcon: "🧰",
    fields: ["Nome do produto", "Como funciona", "Slogan"],
    creating: "estão inventando…",
    onlineMode: "Cada inventor escreve nome, funcionamento e slogan. A turma vota no site.",
    liveMode: "Os inventores apresentam em voz alta; a plateia vota “Compro” ou “Não compro”.",
    board: "Placar da feira",
    champion: "é o inventor do ano!",
  },
};

export function FeiraInvencoes() {
  return <PitchGame config={config} />;
}
