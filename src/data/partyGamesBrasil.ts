import type { NumberTopic, PartySource, RankingTopic } from "./partyGames";

// Temas brasileiros pesquisados em 19/11/2026.
const checkedAt = "19/11/2026";
const category = "Brasil";

const wiki = (title: string, path: string): PartySource => ({
  label: `Wikipédia · ${title}`,
  url: `https://pt.wikipedia.org/wiki/${path}`,
});

function number(
  id: string,
  question: string,
  answer: string,
  scope: string,
  note: string,
  source: PartySource,
): NumberTopic {
  return {
    id,
    kind: "number",
    category,
    question,
    answer,
    scope,
    note,
    sources: [source],
    checkedAt,
  };
}

function ranking(
  id: string,
  question: string,
  scope: string,
  note: string,
  source: PartySource,
  rows: string,
): RankingTopic {
  return {
    id,
    kind: "ranking",
    category,
    question,
    scope,
    note,
    sources: [source],
    checkedAt,
    items: rows.split("\n").map((row) => {
      const [name, value] = row.split("|");
      return { name, value };
    }),
  };
}

// Curiosidades inúteis de TV, internet e cultura pop ganham assunto próprio.
function trivia<T extends NumberTopic | RankingTopic>(topics: T[]): T[] {
  return topics.map((topic) => ({ ...topic, category: "Brasil inútil" }));
}

const censoMunicipios = wiki(
  "Municípios do Brasil por população (2022)",
  "Lista_de_munic%C3%ADpios_do_Brasil_por_popula%C3%A7%C3%A3o_(2022)",
);
const ufsArea = wiki(
  "Unidades federativas por área",
  "Lista_de_unidades_federativas_do_Brasil_por_%C3%A1rea",
);
const ufsMunicipios = wiki(
  "Unidades federativas por número de municípios",
  "Lista_de_unidades_federativas_do_Brasil_por_n%C3%BAmero_de_munic%C3%ADpios",
);
const municipiosArea = wiki(
  "Municípios brasileiros por área",
  "Lista_de_munic%C3%ADpios_brasileiros_por_%C3%A1rea_decrescente",
);
const brasil = wiki("Brasil", "Brasil");
const senna = wiki("Ayrton Senna", "Ayrton_Senna");
const olimpiadas = wiki(
  "Brasil nos Jogos Olímpicos",
  "Brasil_nos_Jogos_Ol%C3%ADmpicos",
);
const carnaval = wiki(
  "Campeãs do carnaval do Rio",
  "Lista_de_campe%C3%A3s_do_carnaval_do_Rio_de_Janeiro",
);
const sobrenomes = {
  label: "Wikipedia · Sobrenomes mais comuns (Censo 2022)",
  url: "https://en.wikipedia.org/wiki/List_of_most_common_surnames_in_South_American_countries",
};

export const brazilNumberTopics: NumberTopic[] = [
  number(
    "br-cristo-altura",
    "Qual é a altura total do Cristo Redentor, contando o pedestal?",
    "38 metros",
    "Estátua mais pedestal, em metros.",
    "A estátua sozinha tem 30 metros; o pedestal acrescenta mais 8.",
    wiki("Cristo Redentor", "Cristo_Redentor"),
  ),
  number(
    "br-pao-de-acucar",
    "Quantos metros de altitude tem o morro do Pão de Açúcar, no Rio de Janeiro?",
    "396 metros",
    "Altitude do topo do morro, em metros.",
    "O bondinho que sobe até lá foi inaugurado em 1912.",
    wiki(
      "Pão de Açúcar",
      "Monumento_Natural_dos_Morros_do_P%C3%A3o_de_A%C3%A7%C3%BAcar_e_da_Urca",
    ),
  ),
  number(
    "br-ponte-rio-niteroi",
    "Quantos quilômetros de extensão total tem a Ponte Rio–Niterói?",
    "13,29 km",
    "Comprimento total da ponte, em quilômetros.",
    "Inclui os acessos; o trecho sobre a Baía de Guanabara é menor.",
    wiki("Ponte Rio–Niterói", "Ponte_Rio%E2%80%93Niter%C3%B3i"),
  ),
  number(
    "br-pico-neblina",
    "Qual é a altitude oficial do Pico da Neblina, o ponto mais alto do Brasil?",
    "2.995,30 metros",
    "Altitude oficial do IBGE, em metros.",
    "Medições antigas chegaram a indicar mais de 3.000 metros, mas foram corrigidas por GPS.",
    wiki("Pico da Neblina", "Pico_da_Neblina"),
  ),
  number(
    "br-selaron-degraus",
    "Quantos degraus tem a Escadaria Selarón, no bairro da Lapa, no Rio?",
    "215 degraus",
    "Total de degraus da escadaria.",
    "O artista chileno Jorge Selarón cobriu os degraus com azulejos de dezenas de países.",
    wiki("Escadaria Selarón", "Escadaria_Selar%C3%B3n"),
  ),
  number(
    "br-angra-ilhas",
    "Quantas ilhas existem no litoral de Angra dos Reis (RJ)?",
    "365 ilhas",
    "Ilhas do município de Angra dos Reis.",
    "A conta costuma ser lembrada como 'uma ilha para cada dia do ano'.",
    wiki("Angra dos Reis", "Angra_dos_Reis"),
  ),
  number(
    "br-iguacu-quedas",
    "Aproximadamente quantas quedas d'água formam as Cataratas do Iguaçu?",
    "Cerca de 275 quedas",
    "Conjunto das cataratas, nos lados brasileiro e argentino.",
    "O número varia com a vazão do rio ao longo do ano.",
    wiki("Cataratas do Iguaçu", "Cataratas_do_Igua%C3%A7u"),
  ),
  number(
    "br-senna-vitorias",
    "Quantas corridas de Fórmula 1 Ayrton Senna venceu na carreira?",
    "41 vitórias",
    "Vitórias em Grandes Prêmios de F1.",
    "Senna foi tricampeão mundial: 1988, 1990 e 1991.",
    senna,
  ),
  number(
    "br-senna-poles",
    "Quantas pole positions Ayrton Senna conquistou na Fórmula 1?",
    "65 poles",
    "Largadas na primeira posição em GPs de F1.",
    "Foi recorde da categoria por muitos anos.",
    senna,
  ),
  number(
    "br-plano-real",
    "Quando o real foi lançado, em 1994, 1 real valia quantos cruzeiros reais?",
    "2.750 cruzeiros reais",
    "Taxa de conversão oficial na criação da moeda.",
    "A conversão passou pela URV, a Unidade Real de Valor.",
    wiki("Plano Real", "Plano_Real"),
  ),
  number(
    "br-bbb20-votos",
    "Quantos votos teve o paredão recordista do BBB 20 (Manu, Prior e Felipe)?",
    "1.532.944.337 votos",
    "Total de votos daquele paredão.",
    "O número entrou para o Guinness como recorde de votação em programa de TV.",
    wiki("Big Brother Brasil 20", "Big_Brother_Brasil_20"),
  ),
  number(
    "br-lady-gaga-copacabana",
    "Quantas pessoas a Riotur estimou no show gratuito de Lady Gaga em Copacabana, em 2025?",
    "2,1 milhões de pessoas",
    "Estimativa oficial da Riotur para o show de 3/5/2025.",
    "Outras estimativas de imprensa falaram em até 2,5 milhões.",
    wiki("Todo Mundo no Rio 2025", "Todo_Mundo_no_Rio_2025"),
  ),
  number(
    "br-madonna-copacabana",
    "Quantas pessoas a Riotur estimou no show gratuito de Madonna em Copacabana, em 2024?",
    "1,6 milhão de pessoas",
    "Estimativa oficial da Riotur para o show de maio de 2024.",
    "Foi o maior público da carreira da cantora.",
    wiki("Todo Mundo no Rio", "Todo_Mundo_no_Rio"),
  ),
  number(
    "br-litoral",
    "Quantos quilômetros tem a linha costeira do Brasil?",
    "7.367 km",
    "Linha de costa contínua, sem contar reentrâncias de baías.",
    "Contando todos os recortes do litoral, o número passa de 9 mil km.",
    wiki("Geografia do Brasil", "Geografia_do_Brasil"),
  ),
  number(
    "br-avenida-brasil-capitulos",
    "Quantos capítulos teve a novela Avenida Brasil na exibição original?",
    "179 capítulos",
    "Exibição original na TV Globo, em 2012.",
    "A novela de Carminha e Nina parou o país no último capítulo.",
    wiki("Avenida Brasil (telenovela)", "Avenida_Brasil_(telenovela)"),
  ),
  number(
    "br-predio-mais-alto",
    "Qual é a altura do prédio mais alto do Brasil já concluído, em Balneário Camboriú (SC)?",
    "294,1 metros",
    "Yachthouse Residence Club, torre 2; apenas prédios concluídos.",
    "A Senna Tower, em construção na mesma cidade, promete mais de 500 metros.",
    wiki(
      "Arranha-céus mais altos do Brasil",
      "Lista_dos_arranha-c%C3%A9us_mais_altos_do_Brasil",
    ),
  ),
  number(
    "br-linguas-indigenas",
    "Quantas línguas indígenas diferentes o Censo 2022 registrou no Brasil?",
    "295 línguas",
    "Censo Demográfico 2022, IBGE.",
    "O mesmo Censo contou 391 etnias indígenas.",
    brasil,
  ),
  number(
    "br-populacao-2022",
    "Quantos habitantes o Censo 2022 contou no Brasil?",
    "203.080.756 habitantes",
    "População recenseada pelo IBGE em 2022.",
    "Foi o menor crescimento populacional já registrado entre dois censos.",
    brasil,
  ),
  number(
    "br-municipios",
    "Quantos municípios o Brasil tem, contando Brasília e Fernando de Noronha?",
    "5.571",
    "Total estatístico do IBGE, incluindo o Distrito Federal e Fernando de Noronha.",
    "Sem esses dois, são 5.569 municípios propriamente ditos.",
    ufsMunicipios,
  ),
  number(
    "br-minas-municipios",
    "Quantos municípios tem Minas Gerais, o estado com mais cidades do Brasil?",
    "853 municípios",
    "Municípios de Minas Gerais.",
    "São Paulo vem em segundo lugar, com 645.",
    ufsMunicipios,
  ),
  number(
    "br-sp-populacao",
    "Quantos habitantes a cidade de São Paulo tinha no Censo 2022?",
    "Cerca de 11,45 milhões",
    "Município de São Paulo, Censo 2022.",
    "É a cidade mais populosa do país, com quase o dobro do Rio de Janeiro.",
    censoMunicipios,
  ),
  number(
    "br-altamira-area",
    "Qual é a área de Altamira (PA), o maior município do Brasil em território?",
    "Cerca de 159.533 km²",
    "Área territorial do município, em km².",
    "Altamira é maior que vários países, como Portugal e Grécia.",
    municipiosArea,
  ),
  number(
    "br-silva",
    "Quantas pessoas tinham o sobrenome Silva no Brasil no Censo 2022?",
    "Cerca de 34 milhões",
    "Censo 2022; 34.030.104 pessoas, cerca de 16,8% da população.",
    "Silva é, com folga, o sobrenome mais comum do país.",
    sobrenomes,
  ),
  number(
    "br-marta-copas",
    "Quantos gols Marta marcou em Copas do Mundo femininas?",
    "17 gols",
    "Gols em Copas do Mundo da FIFA.",
    "Ela marcou em cinco Copas diferentes, de 2003 a 2019.",
    wiki("Marta (futebolista)", "Marta_(futebolista)"),
  ),
  number(
    "br-rebeca-medalhas",
    "Quantas medalhas olímpicas Rebeca Andrade tem, somando todas as cores?",
    "6 medalhas",
    "Jogos Olímpicos de verão até Paris 2024.",
    "São 2 ouros, 3 pratas e 1 bronze: ela é a maior medalhista olímpica do Brasil.",
    olimpiadas,
  ),
  number(
    "br-ouros-olimpicos",
    "Quantas medalhas de ouro o Brasil já ganhou em Jogos Olímpicos de verão?",
    "40 ouros",
    "Jogos de verão, até Paris 2024.",
    "Ao todo, o Brasil soma 170 medalhas em Jogos de verão.",
    olimpiadas,
  ),
  number(
    "br-maracana-capacidade",
    "Qual é a capacidade oficial do Maracanã, o maior estádio do Brasil?",
    "78.838 lugares",
    "Capacidade liberada para jogos, segundo o cadastro da CBF (CNEF).",
    "Na final de 1950, antes das reformas, o estádio recebeu perto de 200 mil pessoas.",
    wiki(
      "Estádios de futebol do Brasil",
      "Lista_de_est%C3%A1dios_de_futebol_do_Brasil",
    ),
  ),
  number(
    "br-portela-titulos",
    "Quantos títulos do Carnaval do Rio a Portela, maior campeã da história, tem?",
    "22 títulos",
    "Títulos do grupo principal do Carnaval carioca, até 2026.",
    "A Mangueira vem logo atrás, com 20.",
    carnaval,
  ),
  ...trivia([
    number(
      "br-cebolinha-fios",
      "Quantos fios de cabelo tem o Cebolinha, da Turma da Mônica?",
      "5 fios",
      "Versão atual do personagem.",
      "Quando foi criado, ele tinha 11 fios.",
      wiki("Cebolinha (personagem)", "Cebolinha_(personagem)"),
    ),
    number(
      "br-monica-idade",
      "Quantos anos tem a Mônica, dona do Sansão?",
      "7 anos",
      "Idade oficial da personagem nos gibis clássicos.",
      "Na Turma da Mônica Jovem, ela tem 15 anos. A personagem estreou em 1963.",
      wiki("Mônica (personagem)", "M%C3%B4nica_(personagem)"),
    ),
    number(
      "br-faustao-globo",
      "Por quantos anos o Faustão apresentou o Domingão na TV Globo?",
      "32 anos",
      "De março de 1989 a junho de 2021.",
      "Luciano Huck assumiu o Domingão em setembro de 2021.",
      wiki("Fausto Silva", "Fausto_Silva"),
    ),
    number(
      "br-malhacao-episodios",
      "Quantos episódios Malhação teve ao todo, de 1995 a 2020?",
      "6.191 episódios",
      "Todas as 27 temporadas na TV Globo.",
      "Foram 27 temporadas em 25 anos no ar.",
      wiki("Malhação", "Malha%C3%A7%C3%A3o"),
    ),
    number(
      "br-grande-familia-episodios",
      "Quantos episódios teve A Grande Família, a versão de 2001 com Lineu e Nenê?",
      "485 episódios",
      "Série da TV Globo exibida de 2001 a 2014.",
      "Foram 14 temporadas no ar.",
      wiki("A Grande Família (2001)", "A_Grande_Fam%C3%ADlia_(2001)"),
    ),
    number(
      "br-rock-in-rio-1985",
      "Quantas pessoas foram ao primeiro Rock in Rio, em 1985, somando os 10 dias?",
      "1,38 milhão de pessoas",
      "Público total da primeira edição, em janeiro de 1985.",
      "O festival teve Queen, Iron Maiden e muita lama.",
      wiki("Rock in Rio 1985", "Rock_in_Rio_1985"),
    ),
    number(
      "br-chaves-sbt",
      "Em que ano Chaves estreou no SBT?",
      "1984",
      "Primeira exibição no SBT.",
      "Estreou dentro do programa TV Powww!, em agosto de 1984, e já saiu e voltou da grade várias vezes.",
      wiki("El Chavo del Ocho", "El_Chavo_del_Ocho"),
    ),
    number(
      "br-silvio-estreia",
      "Em que ano estreou o Programa Silvio Santos com esse nome?",
      "1963",
      "Estreia com o nome Programa Silvio Santos.",
      "Silvio apresentou o programa por mais de 50 anos.",
      wiki("Programa Silvio Santos", "Programa_Silvio_Santos"),
    ),
    number(
      "br-juliette-final",
      "Com quantos por cento dos votos Juliette venceu o BBB 21?",
      "90,15%",
      "Votação da final do BBB 21.",
      "Foi uma das três maiores porcentagens de campeões na história do programa.",
      wiki("Big Brother Brasil 21", "Big_Brother_Brasil_21"),
    ),
    number(
      "br-karol-conka",
      "Com quantos por cento de rejeição Karol Conká foi eliminada do BBB 21?",
      "99,17%",
      "Paredão de fevereiro de 2021.",
      "É a maior rejeição da história do programa.",
      wiki("Big Brother Brasil 21", "Big_Brother_Brasil_21"),
    ),
    number(
      "br-bbb26-premio",
      "Quanto Ana Paula Renault levou de prêmio ao vencer o BBB 26?",
      "Cerca de R$ 5,7 milhões",
      "Prêmio bruto, sem desconto de imposto; R$ 5.708.712.",
      "O prêmio começou em R$ 5,44 milhões e cresceu durante a temporada.",
      wiki("Big Brother Brasil 26", "Big_Brother_Brasil_26"),
    ),
    number(
      "br-mega-virada-2025",
      "Qual foi o prêmio total da Mega da Virada de 2025, o maior da história?",
      "Cerca de R$ 1,09 bilhão",
      "Prêmio principal do concurso 2.955.",
      "Seis apostas dividiram o prêmio, cerca de R$ 181,9 milhões para cada. O sorteio atrasou e só aconteceu em 1º de janeiro.",
      {
        label: "Forbes Brasil · maiores prêmios da Mega-Sena",
        url: "https://forbes.com.br/forbes-money/2026/01/os-maiores-premios-ja-pagos-pela-mega-sena/",
      },
    ),
    number(
      "br-mega-aposta-unica",
      "Qual é o maior prêmio da Mega-Sena já ganho por uma única aposta sozinha?",
      "Cerca de R$ 289,4 milhões",
      "Concurso 2.150, de 11/05/2019; uma aposta simples acertou sozinha.",
      "A aposta foi feita em Pernambuco.",
      wiki("Mega-Sena", "Mega-Sena"),
    ),
    number(
      "br-ifood-morango-do-amor",
      "Quantos pedidos de Morango do Amor o iFood recebeu em 2025?",
      "Cerca de 1 milhão (1.039.558)",
      "Retrospectiva iFood 2025, Brasil inteiro.",
      "Quase tudo veio em julho, auge da febre: em junho tinham sido só 11 mil pedidos.",
      {
        label: "Mercado & Consumo · Retrospectiva iFood 2025",
        url: "https://mercadoeconsumo.com.br/08/12/2025/foodservice/retrospectiva-ifood-2025-brasileiros-pediram-hamburguer-pizza-de-calabresa-e-acai/",
      },
    ),
    number(
      "br-ifood-hamburguer",
      "Quantos pedidos de hambúrguer o iFood recebeu no Brasil em 2025?",
      "Cerca de 206,6 milhões",
      "Retrospectiva iFood 2025, item mais pedido do ano.",
      "Pizza de calabresa e açaí completaram o pódio.",
      {
        label: "Mercado & Consumo · Retrospectiva iFood 2025",
        url: "https://mercadoeconsumo.com.br/08/12/2025/foodservice/retrospectiva-ifood-2025-brasileiros-pediram-hamburguer-pizza-de-calabresa-e-acai/",
      },
    ),
    number(
      "br-neymar-instagram",
      "Quantos seguidores Neymar tem no Instagram?",
      "Cerca de 241 milhões",
      "Retrato de 14/11/2026; o número muda todo dia.",
      "É o único brasileiro entre as 50 contas mais seguidas do Instagram.",
      {
        label: "Wikipedia · contas mais seguidas do Instagram",
        url: "https://en.wikipedia.org/wiki/List_of_most-followed_Instagram_accounts",
      },
    ),
    number(
      "br-anitta-ouvintes",
      "Quantos ouvintes mensais Anitta tem no Spotify?",
      "Cerca de 36 milhões",
      "Retrato consultado em 19/11/2026; muda todo mês.",
      "É a artista brasileira com mais ouvintes mensais na plataforma.",
      {
        label: "Kworb · ouvintes mensais no Spotify",
        url: "https://kworb.net/spotify/listeners.html",
      },
    ),
  ]),
];

export const brazilRankingTopics: RankingTopic[] = [
  ranking(
    "br-cidades-populosas",
    "Quais são as 10 cidades mais populosas do Brasil segundo o Censo 2022?",
    "Municípios brasileiros · população recenseada em 2022",
    "Conta o município, não a região metropolitana. Brasília aparece como Distrito Federal.",
    censoMunicipios,
    `São Paulo (SP)|11.451.999
Rio de Janeiro (RJ)|6.211.223
Brasília (DF)|2.817.381
Fortaleza (CE)|2.428.708
Salvador (BA)|2.417.678
Belo Horizonte (MG)|2.315.560
Manaus (AM)|2.063.689
Curitiba (PR)|1.773.718
Recife (PE)|1.488.920
Goiânia (GO)|1.437.366`,
  ),
  ranking(
    "br-estados-populosos",
    "Quais são os 10 estados mais populosos do Brasil segundo o Censo 2022?",
    "Unidades federativas · população recenseada em 2022",
    "Dados do Censo 2022 do IBGE; estimativas mais recentes mantêm a mesma ordem no topo.",
    wiki(
      "Unidades federativas por população",
      "Lista_de_unidades_federativas_do_Brasil_por_popula%C3%A7%C3%A3o",
    ),
    `São Paulo|44.411.238
Minas Gerais|20.539.989
Rio de Janeiro|16.055.174
Bahia|14.141.626
Paraná|11.444.380
Rio Grande do Sul|10.882.965
Pernambuco|9.058.931
Ceará|8.794.957
Pará|8.120.131
Santa Catarina|7.610.361`,
  ),
  ranking(
    "br-estados-area",
    "Quais são os 10 maiores estados do Brasil em área?",
    "Unidades federativas · área territorial oficial do IBGE (base 2025)",
    "Área total em km², incluindo águas internas.",
    ufsArea,
    `Amazonas|1.558.704 km²
Pará|1.245.832 km²
Mato Grosso|903.208 km²
Minas Gerais|586.514 km²
Bahia|564.764 km²
Mato Grosso do Sul|357.142 km²
Goiás|340.243 km²
Maranhão|329.651 km²
Rio Grande do Sul|281.707 km²
Tocantins|277.424 km²`,
  ),
  ranking(
    "br-municipios-area",
    "Quais são os 10 maiores municípios do Brasil em área?",
    "Municípios brasileiros · área territorial do IBGE",
    "Todos ficam na Amazônia, no Pará ou no Amazonas.",
    municipiosArea,
    `Altamira (PA)|159.533 km²
Barcelos (AM)|122.453 km²
São Gabriel da Cachoeira (AM)|108.700 km²
Oriximiná (PA)|107.560 km²
Tapauá (AM)|84.698 km²
São Félix do Xingu (PA)|84.213 km²
Atalaia do Norte (AM)|76.313 km²
Almeirim (PA)|72.969 km²
Jutaí (AM)|68.971 km²
Lábrea (AM)|68.350 km²`,
  ),
  ranking(
    "br-estados-municipios",
    "Quais são os 10 estados brasileiros com mais municípios?",
    "Unidades federativas · número de municípios do IBGE",
    "O Distrito Federal não é dividido em municípios.",
    ufsMunicipios,
    `Minas Gerais|853
São Paulo|645
Rio Grande do Sul|497
Bahia|417
Paraná|399
Santa Catarina|295
Goiás|246
Piauí|224
Paraíba|223
Maranhão|217`,
  ),
  ranking(
    "br-sobrenomes",
    "Quais são os 10 sobrenomes mais comuns do Brasil segundo o Censo 2022?",
    "Brasil · pessoas com o sobrenome no Censo 2022",
    "Uma pessoa com dois sobrenomes da lista conta nos dois. Grafias diferentes, como Sousa e Souza, são separadas.",
    sobrenomes,
    `Silva|34.030.104
Santos|21.367.475
Oliveira|11.708.947
Souza|9.197.158
Pereira|6.888.212
Ferreira|6.226.228
Lima|6.094.630
Alves|5.756.825
Rodrigues|5.428.540
Costa|4.861.083`,
  ),
  ranking(
    "br-carnaval-campeas",
    "Quais são as 10 escolas de samba com mais títulos do Carnaval do Rio?",
    "Grupo principal do Carnaval carioca · até o Carnaval de 2026",
    "Salgueiro, Império Serrano e Imperatriz estão empatadas com 9; Tijuca e Viradouro, com 4. A Mangueira tem o título de 1984 contado duas vezes (campeã e supercampeã).",
    carnaval,
    `Portela|22 títulos
Mangueira|20 títulos
Beija-Flor|15 títulos
Salgueiro|9 títulos
Império Serrano|9 títulos
Imperatriz Leopoldinense|9 títulos
Mocidade Independente|6 títulos
Unidos da Tijuca|4 títulos
Viradouro|4 títulos
Vila Isabel|3 títulos`,
  ),
  ranking(
    "br-estadios-capacidade",
    "Quais são os 10 maiores estádios de futebol do Brasil em capacidade?",
    "Capacidade liberada para jogos · cadastro nacional da CBF (CNEF)",
    "Retrato do cadastro oficial; reformas podem mudar a capacidade de cada estádio.",
    wiki(
      "Estádios de futebol do Brasil",
      "Lista_de_est%C3%A1dios_de_futebol_do_Brasil",
    ),
    `Maracanã (RJ)|78.838
Mané Garrincha (DF)|72.788
MorumBIS (SP)|72.039
Castelão (CE)|63.903
Mineirão (MG)|61.846
Arruda (PE)|60.044
Arena do Grêmio (RS)|55.662
Mangueirão (PA)|53.645
Parque do Sabiá (MG)|53.000
Beira-Rio (RS)|50.942`,
  ),
  ranking(
    "br-spotify-musicas",
    "Quais são as 10 músicas com mais streams acumulados no Spotify Brasil?",
    "Spotify Brasil · soma das paradas semanais de 23/03/2014 a 12/11/2026",
    "Total contado pelas paradas semanais, não o contador do próprio app. Retrato salvo; o ranking muda toda semana.",
    {
      label: "Kworb · Spotify Brasil",
      url: "https://kworb.net/spotify/country/br_weekly_totals.html",
    },
    `Lapada Dela — Grupo Menos É Mais|488,8 milhões
Coração Partido (Corazón Partío) — Grupo Menos É Mais|481,1 milhões
P do Pecado — Grupo Menos É Mais|476,6 milhões
Tubarões — Diego & Victor Hugo|451,1 milhões
Leão — Marília Mendonça|440,3 milhões
Erro Gostoso — Simone Mendes|413,1 milhões
Posso Até Não Te Dar Flores — DJ Japa NK|409,6 milhões
Nosso Quadro — AgroPlay|399,8 milhões
Última Saudade — Henrique & Juliano|389 milhões
Apaga Apaga Apaga — Danilo e Davi|385,8 milhões`,
  ),
  ...trivia([
    ranking(
      "br-mega-maiores-premios",
      "Quais são os 10 maiores prêmios já pagos pela Mega-Sena?",
      "Prêmio principal total de cada concurso · até a Mega da Virada de 2025",
      "Valor total da faixa principal, dividido entre os ganhadores. Quase todos são Mega da Virada, que não acumula.",
      {
        label: "Forbes Brasil · maiores prêmios da Mega-Sena",
        url: "https://forbes.com.br/forbes-money/2026/01/os-maiores-premios-ja-pagos-pela-mega-sena/",
      },
      `Mega da Virada 2025|R$ 1,09 bilhão (6 apostas)
Mega da Virada 2024|R$ 635,5 milhões (8 apostas)
Mega da Virada 2023|R$ 588,9 milhões (5 apostas)
Mega da Virada 2022|R$ 542 milhões (5 apostas)
Mega da Virada 2021|R$ 378,1 milhões (2 apostas)
Mega da Virada 2020|R$ 325,3 milhões (2 apostas)
Concurso de 01/10/2022|R$ 317,9 milhões (2 apostas)
Mega da Virada 2017|R$ 306,7 milhões (17 apostas)
Mega da Virada 2019|R$ 304,2 milhões (4 apostas)
Mega da Virada 2018|R$ 302,5 milhões (52 apostas)`,
    ),
    {
      ...ranking(
        "br-bbb-rejeicoes",
        "Quais são as 10 maiores rejeições da história do BBB?",
        "Eliminações no paredão · até o BBB 26",
        "Rogério Padovan (BBB 5) e Rafael Leandro (BBB 12) empatam no 10º lugar com 92%. Algumas listas só contam paredões com três ou mais emparedados.",
        {
          label: "Exame · maiores rejeições do BBB",
          url: "https://exame.com/pop/bbb-veja-quais-foram-as-maiores-rejeicoes-da-historia",
        },
        `Karol Conká (BBB 21)|99,17%
Nego Di (BBB 21)|98,76%
Viih Tube (BBB 21)|96,69%
Aline dos Santos (BBB 5)|95%
Camilla Maia (BBB 25)|94,67%
Patrícia (BBB 18)|94,26%
Solange Couto (BBB 26)|94,17%
Felipe Cobra (BBB 7)|93%
Nayara (BBB 18)|92,69%
Rogério Padovan (BBB 5) ou Rafael Leandro (BBB 12)|92%`,
      ),
      sources: [
        {
          label: "Exame · maiores rejeições do BBB",
          url: "https://exame.com/pop/bbb-veja-quais-foram-as-maiores-rejeicoes-da-historia",
        },
        {
          label: "Mais Goiás · Solange Couto no ranking de rejeições",
          url: "https://www.maisgoias.com.br/entretenimento/big-brother-brasil/apos-saida-de-solange-couto-saiba-quem-foram-os-eliminados-mais-rejeitados-na-historia-do-bbb/",
        },
      ],
    },
    ranking(
      "br-spotify-artistas",
      "Quais são os 10 artistas brasileiros com mais ouvintes mensais no Spotify?",
      "Ouvintes mensais · retrato consultado em 19/11/2026",
      "Número muda todo mês. Duplas contam como um artista só.",
      {
        label: "Kworb · ouvintes mensais no Spotify",
        url: "https://kworb.net/spotify/listeners.html",
      },
      `Anitta|36,1 milhões
Alok|22,2 milhões
MC Ryan SP|19,1 milhões
MC Meno K|19,1 milhões
MC GW|18,7 milhões
Henrique & Juliano|16,3 milhões
Zé Neto & Cristiano|16,2 milhões
Felipe & Rodrigo|15,8 milhões
Hugo & Guilherme|15,4 milhões
MC Jacaré|15,3 milhões`,
    ),
  ]),
];
