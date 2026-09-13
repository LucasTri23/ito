export type IdentityCategory = "characters" | "screen" | "bible";
export interface Identity {
  id: string;
  category: IdentityCategory;
  name: string;
  description: string;
  source?: string;
}
export const identityCategories: {
  id: IdentityCategory;
  label: string;
  detail: string;
  icon: string;
}[] = [
  {
    id: "characters",
    label: "Personagens",
    detail: "Animações e super-heróis",
    icon: "✳",
  },
  {
    id: "screen",
    label: "Filmes e séries",
    detail: "Histórias que todo mundo conhece",
    icon: "▶",
  },
  {
    id: "bible",
    label: "Personagens bíblicos",
    detail: "Descrições com fonte no jw.org",
    icon: "✦",
  },
];
const characters = [
  [
    "Homem-Aranha",
    "Peter Parker é um herói que escala paredes e usa teias para se mover pela cidade e combater o crime.",
  ],
  [
    "Batman",
    "Bruce Wayne protege Gotham usando investigação, treinamento e equipamentos. Seu símbolo é um morcego.",
  ],
  [
    "Superman",
    "Herói vindo de Krypton, conhecido por voar e ter grande força. Vive na Terra como o jornalista Clark Kent.",
  ],
  [
    "Mulher-Maravilha",
    "Diana é uma guerreira amazona que luta pela justiça e usa o laço da verdade.",
  ],
  [
    "Homem de Ferro",
    "Tony Stark é um inventor que combate ameaças usando uma armadura tecnológica criada por ele.",
  ],
  [
    "Hulk",
    "Quando se transforma, o cientista Bruce Banner se torna um gigante verde de força extraordinária.",
  ],
  [
    "Bob Esponja",
    "Esponja amarela que vive na Fenda do Biquíni, trabalha no Siri Cascudo e é amiga de Patrick.",
  ],
  [
    "Shrek",
    "Ogro verde que gosta de viver em seu pântano. Suas aventuras envolvem Fiona e seu amigo Burro.",
  ],
  [
    "Elsa",
    "Personagem de Frozen com poderes de criar gelo e neve. É irmã de Anna.",
  ],
  [
    "Simba",
    "Leão de O Rei Leão, filho de Mufasa, que precisa enfrentar seu passado e assumir seu lugar no reino.",
  ],
  [
    "Woody",
    "Boneco de caubói de Toy Story. É um dos brinquedos de Andy e amigo de Buzz Lightyear.",
  ],
  [
    "Pikachu",
    "Pokémon amarelo do tipo elétrico, conhecido por suas bochechas vermelhas e pela parceria com Ash.",
  ],
];
const screen = [
  [
    "Titanic",
    "Filme sobre o romance de Jack e Rose durante a viagem de um transatlântico que termina em naufrágio.",
  ],
  [
    "Jurassic Park",
    "Filme em que dinossauros recriados pela ciência vivem em um parque, até que a segurança sai do controle.",
  ],
  [
    "De Volta para o Futuro",
    "Marty McFly viaja no tempo em um carro DeLorean transformado em máquina do tempo pelo doutor Brown.",
  ],
  [
    "Procurando Nemo",
    "Animação em que o peixe Marlin atravessa o oceano com Dory para encontrar seu filho Nemo.",
  ],
  [
    "Divertida Mente",
    "Animação que acompanha emoções como Alegria e Tristeza dentro da mente de uma menina chamada Riley.",
  ],
  [
    "Os Incríveis",
    "Animação sobre uma família de super-heróis que tenta conciliar a vida cotidiana com seus poderes.",
  ],
  [
    "Friends",
    "Série de comédia sobre seis amigos em Nova York, com encontros frequentes no café Central Perk.",
  ],
  [
    "Stranger Things",
    "Série ambientada em Hawkins, onde um grupo de amigos enfrenta acontecimentos ligados ao Mundo Invertido.",
  ],
  [
    "Chaves",
    "Série de comédia sobre um menino e seus vizinhos em uma vila, com personagens como Seu Madruga e Quico.",
  ],
  [
    "The Big Bang Theory",
    "Comédia sobre um grupo de amigos ligados à ciência, incluindo Sheldon e Leonard, e sua vizinha Penny.",
  ],
];
// Descriptions are original short summaries, checked against the linked pages on 2026-09-13.
const bible = [
  [
    "Noé",
    "Obedeceu a Jeová e construiu uma arca para abrigar sua família e os animais antes do Dilúvio.",
    "1/arca-de-noe/",
  ],
  [
    "Moisés",
    "Liderou os israelitas na saída do Egito. Por orientação de Jeová, estendeu a vara sobre o mar Vermelho, que foi aberto para a travessia.",
    "2/moises-mar-vermelho/",
  ],
  [
    "Davi",
    "Jovem pastor que enfrentou Golias confiando na ajuda de Jeová. Usou uma funda e uma pedra para derrotar o guerreiro filisteu.",
    "4/davi-e-golias/",
  ],
  [
    "Daniel",
    "Continuou orando a Jeová apesar de uma proibição do rei. Foi lançado na cova dos leões e protegido por um anjo de Deus.",
    "5/daniel-na-cova-dos-leoes/",
  ],
  [
    "Rute",
    "Moabita que decidiu acompanhar sua sogra Noemi e servir a Jeová. Deixou sua terra para permanecer ao lado dela.",
    "3/rute-e-noemi/",
  ],
  [
    "Jonas",
    "Profeta enviado a Nínive que inicialmente tentou fugir de sua missão. Foi engolido por um grande peixe e depois obedeceu a Jeová.",
    "4/jonas-grande-peixe/",
  ],
  [
    "Ester",
    "Rainha judia da Pérsia, criada por Mordecai. Arriscou a vida ao se apresentar ao rei e pedir proteção para seu povo.",
    "5/rainha-ester/",
  ],
  [
    "Miriã",
    "Irmã de Moisés que, após a travessia do mar Vermelho, tocou pandeiro e conduziu as mulheres em celebração pela salvação dada por Jeová.",
    "2/moises-mar-vermelho/",
  ],
];
export const identities: Identity[] = [
  ...characters.map(([name, description], i) => ({
    id: `character-${i}`,
    category: "characters" as const,
    name,
    description,
  })),
  ...screen.map(([name, description], i) => ({
    id: `screen-${i}`,
    category: "screen" as const,
    name,
    description,
  })),
  ...bible.map(([name, description, source], i) => ({
    id: `bible-${i}`,
    category: "bible" as const,
    name,
    description,
    source: `https://www.jw.org/pt/biblioteca/livros/historias-biblicas/${source}`,
  })),
];
