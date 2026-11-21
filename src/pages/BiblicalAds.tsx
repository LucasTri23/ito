import { ExternalLink } from "lucide-react";
import { PitchGame, type PitchConfig } from "./PitchGame";
import { adsObjects, adsStyleName } from "../services/feira";

const objectOf = (id: string) => adsObjects.find((o) => o.id === id);

const config: PitchConfig = {
  game: "ads",
  route: "anuncios-biblicos",
  title: "Anúncios dos Tempos Bíblicos",
  badge: "📜",
  tone: "tone-sky",
  eyebrow: "ONLINE OU PRESENCIAL · 2 A 8 JOGADORES",
  pitch:
    "Todo mundo recebe o mesmo objeto de um relato da Bíblia. Cada vendedor ganha um estilo de anúncio secreto e tem 40 segundos para criar o anúncio mais criativo. Quem convencer a turma a comprar, vence!",
  steps: [
    ["📜", "Um objeto de um relato bíblico"],
    ["🎭", "Um estilo de anúncio secreto para cada vendedor"],
    ["🛒", "A turma escolhe o que compraria"],
  ],
  note: "No modo online, os anúncios são escritos e votados no site. No presencial, cada vendedor anuncia em voz alta e a plateia vota “Compro” ou “Não compro” pelo celular. Cada objeto traz o relato e o link para ler no jw.org.",
  seconds: 40,
  topicText: (id) => objectOf(id)?.name ?? "",
  topicDetail: (id) => {
    const o = objectOf(id);
    if (!o) return null;
    return (
      <div className="ads-context">
        <p>{o.summary}</p>
        <a href={o.url} target="_blank" rel="noopener noreferrer">
          Ler {o.reference} no jw.org <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    );
  },
  secretName: (id) => adsStyleName(id) ?? "…",
  t: {
    person: "vendedor",
    people: "vendedores",
    People: "Vendedores",
    thing: "anúncio",
    things: "anúncios",
    Thing: "Anúncio",
    Things: "Anúncios",
    thingGender: "o",
    topicEyebrow: "OBJETO DO ANÚNCIO",
    secretEyebrow: "SEU ESTILO SECRETO",
    secretHint: "Anuncie o objeto nesse estilo.",
    secretIcon: "🎭",
    fields: ["Título do anúncio", "Texto do anúncio", "Chamada final"],
    creating: "estão criando os anúncios…",
    onlineMode: "Cada vendedor escreve título, texto e chamada do anúncio. A turma vota no site.",
    liveMode: "Os vendedores anunciam em voz alta; a plateia vota “Compro” ou “Não compro”.",
    board: "Placar dos anúncios",
    champion: "é o melhor vendedor!",
  },
};

export function BiblicalAds() {
  return <PitchGame config={config} />;
}
