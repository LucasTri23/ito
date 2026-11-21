import type { PartySource, RankingTopic } from "./partyGames";

// Rankings extras do Top 10, pesquisados e com fonte. Ligados em partyGames.ts.
const checkedAt = "20/11/2026";

const wiki = (title: string, path: string): PartySource => ({
  label: `Wikipédia · ${title}`,
  url: `https://pt.wikipedia.org/wiki/${path}`,
});
const enwiki = (title: string, path: string): PartySource => ({
  label: `Wikipedia · ${title}`,
  url: `https://en.wikipedia.org/wiki/${path}`,
});

function ranking(
  id: string,
  category: string,
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
    items: rows
      .trim()
      .split("\n")
      .map((row) => {
        const [name, value] = row.split("|").map((part) => part.trim());
        return { name, value };
      }),
  };
}

// Lote "tp2-": pesquisado e conferido em 21/11/2026.
const checkedAtTp2 = "21/11/2026";
const src = (label: string, url: string): PartySource => ({ label, url });
function tp2(
  id: string,
  category: string,
  question: string,
  scope: string,
  note: string,
  source: PartySource,
  rows: string,
): RankingTopic {
  return {
    ...ranking(`tp2-${id}`, category, question, scope, note, source, rows),
    checkedAt: checkedAtTp2,
  };
}

const nomes2025: PartySource = {
  label: "IstoÉ · Nomes mais registrados em 2025 (Arpen-Brasil)",
  url: "https://istoe.com.br/nomes-mais-escolhidos-em-2025",
};
const google2025: PartySource = {
  label: "Google Brasil · As Buscas do Ano 2025",
  url: "https://blog.google/intl/pt-br/produtos/as-buscas-do-ano-o-que-os-brasileiros-mais-pesquisaram-no-google-em-2025/",
};

export const moreRankingTopics: RankingTopic[] = [
  // ---------- Brasil ----------
  ranking(
    "tp-br-estados-pib",
    "Brasil",
    "Quais são os 10 estados brasileiros com o maior PIB?",
    "Unidades federativas · PIB nominal de 2024 (IBGE, Contas Regionais, publicado em 2026)",
    "Só São Paulo tem um PIB maior que o dos dois estados seguintes somados. O Pará ficou em 11º, colado no Pernambuco.",
    wiki(
      "Unidades federativas do Brasil por PIB",
      "Lista_de_unidades_federativas_do_Brasil_por_PIB",
    ),
    `São Paulo|R$ 3,66 tri
Rio de Janeiro|R$ 1,24 tri
Minas Gerais|R$ 1,07 tri
Paraná|R$ 726,6 bi
Rio Grande do Sul|R$ 702,1 bi
Santa Catarina|R$ 584,2 bi
Bahia|R$ 467,7 bi
Distrito Federal|R$ 382,2 bi
Goiás|R$ 357,1 bi
Pernambuco|R$ 294,5 bi`,
  ),
  ranking(
    "tp-br-municipios-pib",
    "Brasil",
    "Quais são os 10 municípios brasileiros com o maior PIB?",
    "Municípios · PIB nominal de 2023 (IBGE, PIB dos Municípios)",
    "Maricá (RJ) aparece em 4º graças aos royalties do petróleo do pré-sal. Campinas ficou logo fora, em 11º.",
    wiki("Municípios do Brasil por PIB", "Lista_de_munic%C3%ADpios_do_Brasil_por_PIB"),
    `São Paulo (SP)|R$ 1,07 tri
Rio de Janeiro (RJ)|R$ 418,5 bi
Brasília (DF)|R$ 365,7 bi
Maricá (RJ)|R$ 134,1 bi
Belo Horizonte (MG)|R$ 130,2 bi
Manaus (AM)|R$ 127,6 bi
Curitiba (PR)|R$ 120,1 bi
Osasco (SP)|R$ 119,4 bi
Porto Alegre (RS)|R$ 104,7 bi
Guarulhos (SP)|R$ 97,6 bi`,
  ),
  ranking(
    "tp-br-estados-pib-per-capita",
    "Brasil",
    "Quais são os 10 estados brasileiros com o maior PIB per capita?",
    "Unidades federativas · PIB per capita de 2023 (IBGE, Contas Regionais)",
    "Mato Grosso, puxado pelo agronegócio, supera estados bem mais populosos. Rondônia ficou em 11º.",
    wiki(
      "Unidades federativas do Brasil por PIB per capita",
      "Lista_de_unidades_federativas_do_Brasil_por_PIB_per_capita",
    ),
    `Distrito Federal|R$ 128.147
São Paulo|R$ 79.665
Santa Catarina|R$ 72.498
Rio de Janeiro|R$ 72.154
Mato Grosso|R$ 68.975
Rio Grande do Sul|R$ 62.521
Mato Grosso do Sul|R$ 62.491
Paraná|R$ 61.450
Espírito Santo|R$ 56.956
Minas Gerais|R$ 49.983`,
  ),
  ranking(
    "tp-br-estados-densidade",
    "Brasil",
    "Quais são os 10 estados brasileiros com a maior densidade demográfica?",
    "Unidades federativas · habitantes por km² no Censo 2022 (IBGE)",
    "Alagoas e Sergipe, pequenos e populosos, ficam à frente de estados gigantes. O Ceará ficou em 11º.",
    wiki(
      "Unidades federativas do Brasil por densidade demográfica",
      "Lista_de_unidades_federativas_do_Brasil_por_densidade_demogr%C3%A1fica",
    ),
    `Distrito Federal|507,5 hab/km²
Rio de Janeiro|379,8 hab/km²
São Paulo|185,4 hab/km²
Alagoas|112,2 hab/km²
Sergipe|100,9 hab/km²
Pernambuco|92,3 hab/km²
Espírito Santo|86,3 hab/km²
Santa Catarina|81,0 hab/km²
Paraíba|71,4 hab/km²
Rio Grande do Norte|62,6 hab/km²`,
  ),
  ranking(
    "tp-br-estados-idh",
    "Brasil",
    "Quais são os 10 estados brasileiros com o maior IDH?",
    "Unidades federativas · IDH-M de 2024 divulgado pelo PNUD",
    "O IDH-M dos estados usa metodologia diferente do IDH nacional. Mato Grosso do Sul ficou em 11º (0,797).",
    wiki(
      "Unidades federativas do Brasil por IDH",
      "Lista_de_unidades_federativas_do_Brasil_por_IDH",
    ),
    `Distrito Federal|0,866
São Paulo|0,838
Santa Catarina|0,833
Paraná|0,822
Rio de Janeiro|0,819
Rio Grande do Sul|0,818
Goiás|0,815
Mato Grosso|0,812
Minas Gerais|0,809
Espírito Santo|0,804`,
  ),
  ranking(
    "tp-br-nomes-meninas-2025",
    "Nomes",
    "Quais foram os 10 nomes femininos mais registrados no Brasil em 2025?",
    "Registros de nascimento de 2025 nos cartórios (Arpen-Brasil), divulgados em 22/12/2025",
    "Helena liderou pelo segundo ano seguido. O cartório conta cada grafia separadamente, por isso Cecilia aparece sem acento, como no levantamento.",
    nomes2025,
    `Helena|28.271 registros
Maitê|20.677 registros
Cecilia|20.378 registros
Maria Cecilia|16.889 registros
Aurora|16.506 registros
Alice|14.777 registros
Laura|14.487 registros
Antonella|10.436 registros
Isis|10.378 registros
Heloisa|9.703 registros`,
  ),
  ranking(
    "tp-br-nomes-meninos-2025",
    "Nomes",
    "Quais foram os 10 nomes masculinos mais registrados no Brasil em 2025?",
    "Registros de nascimento de 2025 nos cartórios (Arpen-Brasil), divulgados em 22/12/2025",
    "Ravi tirou de Miguel a liderança entre os meninos por apenas 328 registros.",
    nomes2025,
    `Ravi|21.982 registros
Miguel|21.654 registros
Heitor|17.751 registros
Arthur|17.514 registros
Theo|16.766 registros
Gael|16.201 registros
Bernardo|15.395 registros
Davi|14.425 registros
Noah|14.182 registros
Samuel|14.021 registros`,
  ),
  ranking(
    "tp-br-hidreletricas",
    "Brasil",
    "Quais são as 10 maiores usinas hidrelétricas em operação no Brasil?",
    "Potência instalada em MW · usinas em operação (dados de até 2019 na lista)",
    "Itaipu é binacional (metade do Paraguai) e entra com a potência total. A usina de Jatobá, planejada e ainda não construída, foi excluída.",
    wiki(
      "Usinas hidrelétricas do Brasil",
      "Lista_de_usinas_hidrel%C3%A9tricas_do_Brasil",
    ),
    `Itaipu (rio Paraná)|14.000 MW
Belo Monte (rio Xingu)|11.233 MW
Tucuruí (rio Tocantins)|8.535 MW
Jirau (rio Madeira)|3.750 MW
Santo Antônio (rio Madeira)|3.568 MW
Ilha Solteira (rio Paraná)|3.444 MW
Xingó (rio São Francisco)|3.162 MW
Paulo Afonso IV (rio São Francisco)|2.462 MW
Itumbiara (rio Paranaíba)|2.082 MW
Teles Pires (rio Teles Pires)|1.820 MW`,
  ),
  ranking(
    "tp-br-turistas-paises",
    "Brasil",
    "Quais 10 países mais mandaram turistas para o Brasil em 2025?",
    "Chegadas de turistas internacionais ao Brasil em 2025 (Embratur, Ministério do Turismo e Polícia Federal)",
    "A Argentina sozinha mandou mais turistas que os quatro seguintes somados. O Brasil passou de 9 milhões de visitantes estrangeiros no ano, recorde.",
    {
      label: "O Hoje · De onde são os turistas que mais visitaram o Brasil em 2025",
      url: "https://ohoje.com/2026/06/29/descubra-de-onde-sao-os-turistas-que-mais-visitaram-o-brasil-em-2025/",
    },
    `Argentina|3,39 milhões
Chile|801,9 mil
Estados Unidos|759,6 mil
Paraguai|528,6 mil
Uruguai|524,7 mil
França|293 mil
Portugal|273,5 mil
Alemanha|209,9 mil
Colômbia|194,5 mil
Itália|190,3 mil`,
  ),
  ranking(
    "tp-br-torcidas-2025",
    "Brasil",
    "Quais são as 10 maiores torcidas de futebol do Brasil?",
    "Pesquisa Ipsos-Ipec para O Globo · campo de 5 a 9/06/2025, 2.000 entrevistas, margem de 2,2 pontos",
    "Cruzeiro e Atlético-MG empataram com 2,3% (ordem da reportagem). O Internacional ficou em 11º, com 1,7%.",
    {
      label: "Correio Braziliense · Estudo mostra as maiores torcidas do Brasil",
      url: "https://www.correiobraziliense.com.br/esportes/2025/07/7212823-estudo-mostra-quais-sao-as-maiores-torcidas-do-brasil.html",
    },
    `Flamengo|21,2%
Corinthians|11,9%
Palmeiras|6,5%
São Paulo|6,4%
Vasco|3,4%
Grêmio|3,0%
Cruzeiro|2,3%
Atlético-MG|2,3%
Bahia|2,2%
Santos|2,0%`,
  ),
  ranking(
    "tp-br-exportacoes-destinos",
    "Brasil",
    "Quais foram os 10 países que mais compraram produtos do Brasil em 2025?",
    "Destinos das exportações brasileiras em 2025, em US$ (MDIC)",
    "A China comprou sozinha cerca de 29% de tudo que o Brasil exportou, mais que o dobro dos Estados Unidos.",
    {
      label: "Bora Investir (B3) · Países que mais importaram do Brasil em 2025",
      url: "https://borainvestir.b3.com.br/noticias/mais-china-e-menos-eua-veja-ranking-dos-paises-que-mais-importaram-produtos-do-brasil-em-2025/",
    },
    `China|US$ 100,0 bi
Estados Unidos|US$ 37,7 bi
Argentina|US$ 18,1 bi
Países Baixos|US$ 11,7 bi
Espanha|US$ 8,8 bi
México|US$ 7,7 bi
Singapura|US$ 7,4 bi
Canadá|US$ 7,3 bi
Chile|US$ 7,2 bi
Índia|US$ 6,9 bi`,
  ),
  ranking(
    "tp-br-aeroportos-2022",
    "Brasil",
    "Quais foram os 10 aeroportos mais movimentados do Brasil em 2022?",
    "Total de passageiros embarcados e desembarcados em 2022",
    "Em 2022 o Galeão ficou atrás até do Santos Dumont. Fortaleza ficou em 11º.",
    enwiki(
      "Busiest airports in Brazil",
      "List_of_the_busiest_airports_in_Brazil",
    ),
    `Guarulhos (SP)|34,5 milhões
Congonhas (SP)|18,1 milhões
Brasília (DF)|13,5 milhões
Viracopos (Campinas, SP)|11,8 milhões
Santos Dumont (RJ)|10,2 milhões
Confins (Belo Horizonte, MG)|9,5 milhões
Guararapes (Recife, PE)|8,7 milhões
Salgado Filho (Porto Alegre, RS)|6,6 milhões
Salvador (BA)|6,55 milhões
Galeão (RJ)|5,9 milhões`,
  ),
  ...[
    ranking(
      "tp-br-spotify-artistas-2025",
      "",
      "Quais foram os 10 artistas mais ouvidos no Spotify Brasil em 2025?",
      "Retrospectiva Spotify (Wrapped) 2025 · Brasil, divulgada em 03/12/2025",
      "Henrique & Juliano repetiram o topo de 2024. Não há nenhuma mulher no top 10.",
      {
        label: "Billboard Brasil · Artistas mais ouvidos no Brasil em 2025",
        url: "https://billboard.com.br/artistas-mais-ouvidos-brasil-2025-spotify/",
      },
      `Henrique & Juliano|Sertanejo
Grupo Menos É Mais|Pagode
MC Ryan SP|Funk
Jorge & Mateus|Sertanejo
MC IG|Funk
Zé Neto & Cristiano|Sertanejo
Matheus & Kauan|Sertanejo
MC Tuto|Funk
Natanzinho Lima|Piseiro
Filipe Ret|Trap`,
    ),
    ranking(
      "tp-br-spotify-albuns-2025",
      "",
      "Quais foram os 10 álbuns mais ouvidos no Spotify Brasil em 2025?",
      "Retrospectiva Spotify (Wrapped) 2025 · Brasil",
      "Henrique & Juliano emplacaram três álbuns no top 10. O único estrangeiro é Lady Gaga, que fez show em Copacabana em 2025.",
      {
        label: "Rolling Stone Brasil · Os 10 álbuns mais ouvidos no Spotify em 2025",
        url: "https://rollingstone.com.br/musica/os-10-albuns-mais-ouvidos-do-brasil-no-spotify-em-2025/",
      },
      `Manifesto Musical 2|Henrique & Juliano
Churrasquinho 3|Grupo Menos É Mais
O Céu Explica Tudo|Henrique & Juliano
Obrigado Deus|Léo Foguete
To Be|Henrique & Juliano
333|Matuê
Nada Como um Dia Após o Outro Dia|Racionais MC's
MAYHEM|Lady Gaga
Transcende|Lauana Prado
A Nata de Tudo – A Ovelha Negra|MC Negão Original`,
    ),
    ranking(
      "tp-br-radio-2025",
      "",
      "Quais foram as 10 músicas mais tocadas nas rádios do Brasil no 1º semestre de 2025?",
      "Crowley Broadcast Analysis · 01/01 a 30/06/2025, execuções das 7h às 19h em dias úteis",
      "Sertanejo de ponta a ponta: as dez são de duplas ou cantores do gênero, quase todas gravadas ao vivo.",
      {
        label: "Billboard Brasil · Top 10 das rádios em 2025",
        url: "https://billboard.com.br/veja-o-top-10-das-musicas-mais-tocadas-nas-radios-em-2025/",
      },
      `Tubarões|Diego & Victor Hugo
Arruma um Bão|Israel & Rodolffo
Opa Cadê Eu|Clayton & Romário
Ai Que Vontade|Bruno & Marrone
Mentirosa|Hugo & Guilherme part. Wesley Safadão
Me Ama ou Me Larga|Simone Mendes
Vai Lá|Maiara & Maraisa
Solteiro Sofredor|João Neto & Frederico part. Rionegro & Solimões
Castelo de Sonhos|Rionegro & Solimões part. Emílio & Eduardo
Fiu Fiu|Bruno Rosa part. Israel & Rodolffo`,
    ),
    ranking(
      "tp-br-google-buscas-2025",
      "",
      "Quais foram os 10 assuntos em alta no Google Brasil em 2025?",
      "Buscas do Ano 2025 do Google · termos com maior crescimento de buscas no Brasil, não volume total",
      "O Mundial de Clubes nos EUA puxou PSG, Chelsea e Bayern para a lista. Sem o critério de crescimento, buscas como 'tempo' dominariam.",
      google2025,
      `Mundial de Clubes|Torneio da Fifa
PSG|Clube francês
Preta Gil|Cantora
Chelsea|Clube inglês
Papa|Conclave do Vaticano
Bayern|Clube alemão
Labubu|Boneco colecionável
Charlie Kirk|Ativista americano
Caso Vitória|Caso policial
Bobbie Goods|Livro de colorir`,
    ),
    ranking(
      "tp-br-google-quanto-custa-2025",
      "",
      "Quais foram as 10 perguntas 'Quanto custa…?' em alta no Google Brasil em 2025?",
      "Buscas do Ano 2025 do Google · categoria de perguntas 'Quanto custa', Brasil",
      "O bebê reborn venceu o morango do amor e até o Labubu.",
      google2025,
      `Um bebê reborn|Boneca realista
O show da Lady Gaga|Show em Copacabana
Um Labubu|Boneco colecionável
Mounjaro|Remédio para emagrecer
Um morango do amor|Doce da moda
Um Bobbie Goods|Livro de colorir
Um Cybertruck|Picape da Tesla
Um camarote na Sapucaí|Carnaval do Rio
O translado da Indonésia para o Brasil|Repatriação de corpo
O show de Natanzinho Lima|Show de piseiro`,
    ),
  ].map((topic) => ({ ...topic, category: "Brasil inútil" })),

  // ---------- Cinema ----------
  ranking(
    "tp-cinema-animacoes",
    "Cinema",
    "Quais são as 10 animações com maior bilheteria mundial da história?",
    "Bilheteria mundial acumulada em US$ · retrato da semana de 19/11/2026",
    "O chinês Ne Zha 2 lidera. Toy Story 5 ainda estava em cartaz e pode passar Minions; Toy Story 4 ficou em 11º.",
    enwiki(
      "Highest-grossing animated films",
      "List_of_highest-grossing_animated_films",
    ),
    `Ne Zha 2 (2025)|US$ 2,22 bi
Zootopia 2 (2025)|US$ 1,87 bi
Divertida Mente 2 (2024)|US$ 1,70 bi
O Rei Leão (2019)|US$ 1,66 bi
Frozen 2 (2019)|US$ 1,45 bi
Super Mario Bros. – O Filme (2023)|US$ 1,36 bi
Frozen (2013)|US$ 1,29 bi
Os Incríveis 2 (2018)|US$ 1,24 bi
Minions (2015)|US$ 1,16 bi
Toy Story 5 (2026)|US$ 1,15 bi`,
  ),
  ranking(
    "tp-cinema-franquias",
    "Cinema",
    "Quais são as 10 franquias de cinema com maior bilheteria mundial?",
    "Soma da bilheteria mundial dos filmes de cada franquia ou série, em US$ · retrato de novembro de 2026",
    "As franquias se sobrepõem: Vingadores e parte do Homem-Aranha também contam dentro do MCU. Jurassic Park ficou em 11º.",
    enwiki("Highest-grossing films", "List_of_highest-grossing_films"),
    `Universo Cinematográfico Marvel|US$ 35,2 bi
Homem-Aranha|US$ 13,7 bi
Star Wars|US$ 10,7 bi
Mundo Bruxo (Harry Potter)|US$ 9,7 bi
Vingadores|US$ 7,9 bi
James Bond|US$ 7,8 bi
X-Men|US$ 7,4 bi
Velozes e Furiosos|US$ 7,3 bi
Universo Estendido DC|US$ 7,2 bi
Batman|US$ 7,2 bi`,
  ),
  ranking(
    "tp-cinema-mcu",
    "Cinema",
    "Quais são os 10 filmes da Marvel (MCU) com maior bilheteria mundial?",
    "Universo Cinematográfico Marvel · bilheteria mundial em US$ · retrato de novembro de 2026",
    "Ultimato inclui os relançamentos de 2019 e de setembro de 2026. Homem-Aranha: Longe de Casa ficou em 11º.",
    enwiki(
      "Marvel Cinematic Universe films",
      "List_of_Marvel_Cinematic_Universe_films",
    ),
    `Vingadores: Ultimato|US$ 2,94 bi
Homem-Aranha: Um Novo Dia|US$ 2,52 bi
Vingadores: Guerra Infinita|US$ 2,05 bi
Homem-Aranha: Sem Volta para Casa|US$ 1,93 bi
Os Vingadores|US$ 1,52 bi
Vingadores: Era de Ultron|US$ 1,41 bi
Pantera Negra|US$ 1,37 bi
Deadpool & Wolverine|US$ 1,34 bi
Homem de Ferro 3|US$ 1,22 bi
Capitão América: Guerra Civil|US$ 1,16 bi`,
  ),

  // ---------- Música ----------
  ranking(
    "tp-musica-turnes",
    "Música",
    "Quais são as 10 turnês de shows com maior bilheteria da história?",
    "Arrecadação bruta em US$, sem correção pela inflação · retrato de novembro de 2026",
    "As turnês do Metallica e do BTS ainda estavam em andamento. Love On Tour, de Harry Styles, ficou em 11º.",
    enwiki(
      "Highest-grossing concert tours",
      "List_of_highest-grossing_concert_tours",
    ),
    `The Eras Tour (Taylor Swift)|US$ 2,08 bi
Music of the Spheres (Coldplay)|US$ 1,52 bi
After Hours til Dawn (The Weeknd)|US$ 1,3 bi
Farewell Yellow Brick Road (Elton John)|US$ 939 mi
+−=÷× Tour (Ed Sheeran)|US$ 876 mi
÷ Tour (Ed Sheeran)|US$ 776 mi
360° Tour (U2)|US$ 736 mi
Turnê 2023–2025 (Bruce Springsteen)|US$ 730 mi
M72 World Tour (Metallica)|US$ 668 mi
Arirang World Tour (BTS)|US$ 639 mi`,
  ),

  // ---------- Esportes ----------
  ranking(
    "tp-esporte-nba-pontos",
    "Esportes e recordes",
    "Quais são os 10 maiores pontuadores da história da NBA?",
    "Pontos na temporada regular, carreira inteira · atualizado em 18/11/2026",
    "LeBron James é o único acima de 40 mil pontos. Carmelo Anthony ficou em 11º.",
    enwiki(
      "NBA career scoring leaders",
      "List_of_National_Basketball_Association_career_scoring_leaders",
    ),
    `LeBron James|43.628 pontos
Kareem Abdul-Jabbar|38.387 pontos
Karl Malone|36.928 pontos
Kobe Bryant|33.643 pontos
Kevin Durant|32.938 pontos
Michael Jordan|32.292 pontos
Dirk Nowitzki|31.560 pontos
Wilt Chamberlain|31.419 pontos
James Harden|29.582 pontos
Shaquille O'Neal|28.596 pontos`,
  ),
  ranking(
    "tp-esporte-olimpiadas-paises",
    "Esportes e recordes",
    "Quais são os 10 países com mais medalhas de ouro na história dos Jogos Olímpicos de Verão?",
    "Quadro de medalhas histórico dos Jogos de Verão, de 1896 a Paris 2024",
    "Grã-Bretanha e China empatam em 303 ouros; a Grã-Bretanha fica à frente por ter mais pratas. A Alemanha não soma Alemanha Ocidental nem Oriental.",
    enwiki("All-time Olympic Games medal table", "All-time_Olympic_Games_medal_table"),
    `Estados Unidos|1.106 ouros
União Soviética|395 ouros
Grã-Bretanha|303 ouros
China|303 ouros
França|243 ouros
Itália|229 ouros
Alemanha|214 ouros
Japão|189 ouros
Hungria|187 ouros
Austrália|180 ouros`,
  ),
  ranking(
    "tp-esporte-maiores-medalhistas",
    "Esportes e recordes",
    "Quais são os 10 atletas com mais medalhas olímpicas na história?",
    "Total de medalhas em Jogos de Verão e de Inverno · até Milão-Cortina 2026",
    "Empates no total são desfeitos por ouros e depois pratas. Klæbo fica em 10º entre cinco atletas com 13 medalhas por ter 11 ouros.",
    enwiki("Multiple Olympic medalists", "List_of_multiple_Olympic_medalists"),
    `Michael Phelps (natação, EUA)|28 medalhas
Larisa Latynina (ginástica, URSS)|18 medalhas
Marit Bjørgen (esqui cross-country, Noruega)|15 medalhas
Nikolai Andrianov (ginástica, URSS)|15 medalhas
Katie Ledecky (natação, EUA)|14 medalhas
Isabell Werth (hipismo, Alemanha)|14 medalhas
Ole Einar Bjørndalen (biatlo, Noruega)|14 medalhas
Emma McKeon (natação, Austrália)|14 medalhas
Arianna Fontana (patinação, Itália)|14 medalhas
Johannes Høsflot Klæbo (esqui cross-country, Noruega)|13 medalhas`,
  ),
  ranking(
    "tp-esporte-forbes-2026",
    "Esportes e recordes",
    "Quais são os 10 atletas mais bem pagos do mundo segundo a Forbes?",
    "Lista Forbes de 2026 · ganhos totais em 12 meses (salários, prêmios e patrocínios)",
    "Cristiano Ronaldo ganhou quase o dobro do segundo colocado, o boxeador Canelo Álvarez.",
    enwiki(
      "Forbes list of the world's highest-paid athletes",
      "Forbes_list_of_the_world%27s_highest-paid_athletes",
    ),
    `Cristiano Ronaldo (futebol)|US$ 300 mi
Canelo Álvarez (boxe)|US$ 170 mi
Lionel Messi (futebol)|US$ 140 mi
LeBron James (basquete)|US$ 137,8 mi
Shohei Ohtani (beisebol)|US$ 127,6 mi
Stephen Curry (basquete)|US$ 124,7 mi
Jon Rahm (golfe)|US$ 107 mi
Karim Benzema (futebol)|US$ 104 mi
Kevin Durant (basquete)|US$ 103,8 mi
Lewis Hamilton (automobilismo)|US$ 100 mi`,
  ),
  ranking(
    "tp-esporte-transferencias",
    "Esportes e recordes",
    "Quais são as 10 transferências mais caras da história do futebol?",
    "Valor fixo da transferência em euros, sem bônus · retrato de novembro de 2026",
    "Diomande e Barcola custaram os mesmos € 125 mi fixos; vale a ordem da lista. Enzo Fernández aparece duas vezes. Griezmann ficou em 11º.",
    enwiki(
      "Most expensive association football transfers",
      "List_of_most_expensive_association_football_transfers",
    ),
    `Neymar (Barcelona → PSG, 2017)|€ 222 mi
Kylian Mbappé (Monaco → PSG, 2017)|€ 180 mi
Enzo Fernández (Chelsea → Manchester City, 2026)|€ 145,8 mi
Alexander Isak (Newcastle → Liverpool, 2025)|€ 144,5 mi
Morgan Rogers (Aston Villa → Chelsea, 2026)|€ 137,3 mi
Elliot Anderson (Nottingham Forest → Manchester City, 2026)|€ 135,5 mi
João Félix (Benfica → Atlético de Madrid, 2019)|€ 126 mi
Yan Diomande (RB Leipzig → Real Madrid, 2026)|€ 125 mi
Bradley Barcola (PSG → Liverpool, 2026)|€ 125 mi
Enzo Fernández (Benfica → Chelsea, 2023)|€ 121 mi`,
  ),
  ranking(
    "tp-esporte-estadios-mundo",
    "Esportes e recordes",
    "Quais são os 10 maiores estádios de futebol do mundo em capacidade?",
    "Capacidade de público sentado, estádios usados para futebol · retrato de novembro de 2026",
    "O maior fica na Coreia do Norte. O Monumental de Núñez, do River Plate, ficou em 11º.",
    enwiki(
      "Football stadiums by capacity",
      "List_of_association_football_stadiums_by_capacity",
    ),
    `Rungrado 1º de Maio (Pyongyang, Coreia do Norte)|113.281 lugares
Camp Nou (Barcelona, Espanha)|99.354 lugares
FNB Stadium (Joanesburgo, África do Sul)|94.736 lugares
Estádio da Nova Capital Administrativa (Egito)|93.940 lugares
Cotton Bowl (Dallas, EUA)|92.100 lugares
Wembley (Londres, Inglaterra)|90.000 lugares
Lusail (Catar)|88.966 lugares
Estádio Azteca (Cidade do México)|87.523 lugares
Bukit Jalil (Kuala Lumpur, Malásia)|87.411 lugares
Borg El-Arab (Alexandria, Egito)|86.000 lugares`,
  ),

  // ---------- Mundo ----------
  ranking(
    "tp-mundo-paises-visitados",
    "Natureza e geografia",
    "Quais são os 10 países mais visitados por turistas estrangeiros?",
    "Chegadas de turistas internacionais em 2024 (ONU Turismo, edição 2025)",
    "A França lidera com folga. A Grécia fecha o top 10, logo atrás do Japão.",
    enwiki("World Tourism rankings", "World_Tourism_rankings"),
    `França|102 milhões
Espanha|93,8 milhões
Estados Unidos|72,4 milhões
Turquia|60,6 milhões
Itália|57,7 milhões
México|45 milhões
Reino Unido|41,8 milhões
Alemanha|37,5 milhões
Japão|36,9 milhões
Grécia|36 milhões`,
  ),
  ranking(
    "tp-mundo-cidades-visitadas",
    "Natureza e geografia",
    "Quais são as 10 cidades mais visitadas por turistas estrangeiros no mundo?",
    "Chegadas de visitantes internacionais em 2025, ranking da Euromonitor",
    "Bangkok lidera com folga. Meca entra pela peregrinação, e Paris aparece só em 9º.",
    enwiki(
      "Cities by international visitors",
      "List_of_cities_by_international_visitors",
    ),
    `Bangkok (Tailândia)|30,3 milhões
Hong Kong|23,2 milhões
Londres (Reino Unido)|22,7 milhões
Macau|20,4 milhões
Istambul (Turquia)|19,7 milhões
Dubai (Emirados Árabes)|19,5 milhões
Meca (Arábia Saudita)|18,7 milhões
Antália (Turquia)|18,6 milhões
Paris (França)|18,3 milhões
Kuala Lumpur (Malásia)|17,3 milhões`,
  ),
  ranking(
    "tp-mundo-aeroportos",
    "Natureza e geografia",
    "Quais foram os 10 aeroportos mais movimentados do mundo em 2025?",
    "Total de passageiros em 2025, dados do Airports Council International (ACI)",
    "Atlanta segue no topo e é o único acima de 100 milhões. Délhi ficou em 11º. Guarulhos não aparece no top 10.",
    enwiki(
      "Busiest airports by passenger traffic",
      "List_of_busiest_airports_by_passenger_traffic",
    ),
    `Atlanta (EUA)|106,3 milhões
Dubai (Emirados Árabes)|95,2 milhões
Tóquio-Haneda (Japão)|91,7 milhões
Dallas/Fort Worth (EUA)|85,7 milhões
Xangai-Pudong (China)|85,0 milhões
Chicago-O'Hare (EUA)|84,9 milhões
Londres-Heathrow (Reino Unido)|84,5 milhões
Istambul (Turquia)|84,4 milhões
Guangzhou-Baiyun (China)|83,6 milhões
Denver (EUA)|82,4 milhões`,
  ),
  ranking(
    "tp-mundo-predios",
    "Natureza e geografia",
    "Quais são os 10 prédios mais altos do mundo?",
    "Altura arquitetônica em metros, prédios concluídos ou com estrutura finalizada",
    "Os dois CTF Finance Centre (Guangzhou e Tianjin) têm cerca de 530 m; vale a ordem da lista. O Taipei 101 ficou em 11º.",
    enwiki("Tallest buildings", "List_of_tallest_buildings"),
    `Burj Khalifa (Dubai)|828 m
Merdeka 118 (Kuala Lumpur)|678,9 m
Shanghai Tower (Xangai)|632 m
Torre do Relógio (Meca)|601 m
Ping An Finance Centre (Shenzhen)|599,1 m
Lotte World Tower (Seul)|554,5 m
One World Trade Center (Nova York)|541,3 m
Guangzhou CTF Finance Centre|530 m
Tianjin CTF Finance Centre|530 m
CITIC Tower (Pequim)|527,7 m`,
  ),
  ranking(
    "tp-mundo-estatuas",
    "Natureza e geografia",
    "Quais são as 10 estátuas mais altas do mundo?",
    "Altura da estátua em metros, sem contar pedestal",
    "Com 30 m de estátua, o Cristo Redentor fica muito longe da lista. A Mãe Pátria Chama, na Rússia, ficou em 11º.",
    enwiki("Tallest statues", "List_of_tallest_statues"),
    `Estátua da Unidade (Índia)|182 m
Buda do Templo da Primavera (China)|128 m
Laykyun Sekkya (Mianmar)|115,8 m
Estátua da Crença (Índia)|106 m
Ushiku Daibutsu (Japão)|100 m
Guanyin de Guishan (China)|99 m
Mãe de Toda a Ásia (Filipinas)|98,15 m
Grande Buda da Tailândia|93 m
Sendai Daikannon (Japão)|92 m
Dai Kannon de Kita no Miyako (Japão)|88 m`,
  ),
  ranking(
    "tp-mundo-idiomas",
    "Natureza e geografia",
    "Quais são os 10 idiomas mais falados do mundo?",
    "Total de falantes nativos e não nativos, em milhões · Ethnologue 2026",
    "O português aparece em 8º, logo atrás do bengali. O russo ficou em 11º.",
    enwiki(
      "Languages by total number of speakers",
      "List_of_languages_by_total_number_of_speakers",
    ),
    `Inglês|1,49 bilhão
Mandarim|1,18 bilhão
Hindi|611 milhões
Espanhol|561 milhões
Árabe padrão|335 milhões
Francês|334 milhões
Bengali|274 milhões
Português|269 milhões
Indonésio|255 milhões
Urdu|246 milhões`,
  ),
  ranking(
    "tp-mundo-pib-paises",
    "Natureza e geografia",
    "Quais são as 10 maiores economias do mundo pelo PIB?",
    "PIB nominal em US$ · estimativa do FMI para 2026",
    "O Brasil fecha o top 10, logo à frente do Canadá.",
    enwiki("Countries by GDP (nominal)", "List_of_countries_by_GDP_(nominal)"),
    `Estados Unidos|US$ 32,6 tri
China|US$ 21,5 tri
Alemanha|US$ 5,47 tri
Japão|US$ 4,34 tri
Reino Unido|US$ 4,27 tri
Índia|US$ 4,06 tri
França|US$ 3,55 tri
Rússia|US$ 2,86 tri
Itália|US$ 2,70 tri
Brasil|US$ 2,65 tri`,
  ),
  ranking(
    "tp-mundo-nobel-paises",
    "Natureza e geografia",
    "Quais são os 10 países com mais ganhadores do Prêmio Nobel?",
    "Laureados por país (pessoas, não prêmios) · até os prêmios de 2026",
    "Japão e Suécia empatam com 34; Rússia/URSS e Canadá, com 30. A Holanda ficou em 11º, com 22.",
    enwiki("Nobel laureates by country", "List_of_Nobel_laureates_by_country"),
    `Estados Unidos|426 laureados
Reino Unido|143 laureados
Alemanha|116 laureados
França|78 laureados
Japão|34 laureados
Suécia|34 laureados
Rússia/URSS|30 laureados
Canadá|30 laureados
Suíça|27 laureados
Áustria|25 laureados`,
  ),

  // ---------- Comida e agro ----------
  ranking(
    "tp-comida-cafe",
    "Comida e bebida",
    "Quais são os 10 países que mais produzem café no mundo?",
    "Produção de café verde em toneladas, 2023 (FAO/FAOSTAT)",
    "O Brasil produz mais que o 2º e o 3º colocados juntos. A Guatemala ficou em 11º.",
    enwiki("Countries by coffee production", "List_of_countries_by_coffee_production"),
    `Brasil|3,41 milhões de t
Vietnã|1,96 milhão de t
Indonésia|760 mil t
Colômbia|681 mil t
Etiópia|559 mil t
Honduras|384,4 mil t
Uganda|384,0 mil t
Peru|370 mil t
Índia|333 mil t
República Centro-Africana|316 mil t`,
  ),
  ranking(
    "tp-comida-cacau",
    "Comida e bebida",
    "Quais são os 10 países que mais produzem cacau no mundo?",
    "Produção de cacau em toneladas, 2024 (FAO)",
    "A Costa do Marfim produz quase três vezes mais que a Indonésia. O Brasil aparece em 7º.",
    enwiki("Countries by cocoa production", "List_of_countries_by_cocoa_production"),
    `Costa do Marfim|1,89 milhão de t
Indonésia|633 mil t
Gana|530 mil t
Equador|404 mil t
Nigéria|350 mil t
Camarões|320 mil t
Brasil|298 mil t
Peru|157 mil t
Serra Leoa|94 mil t
Colômbia|68 mil t`,
  ),
  ranking(
    "tp-comida-soja",
    "Comida e bebida",
    "Quais são os 10 países que mais produzem soja no mundo?",
    "Produção de soja em toneladas, 2022 (FAO/FAOSTAT)",
    "O Brasil passou os Estados Unidos e lidera. A África do Sul ficou em 11º.",
    enwiki("Countries by soybean production", "List_of_countries_by_soybean_production"),
    `Brasil|120,7 milhões de t
Estados Unidos|116,4 milhões de t
Argentina|43,9 milhões de t
China|20,3 milhões de t
Índia|13,0 milhões de t
Canadá|6,5 milhões de t
Rússia|6,0 milhões de t
Paraguai|4,5 milhões de t
Bolívia|3,46 milhões de t
Ucrânia|3,44 milhões de t`,
  ),
  ranking(
    "tp-comida-vinho",
    "Comida e bebida",
    "Quais são os 10 países que mais produzem vinho no mundo?",
    "Produção de vinho em toneladas, 2021 (FAO)",
    "Itália, França e Espanha somam quase metade do vinho do mundo. A Romênia ficou em 11º.",
    enwiki("Wine-producing countries", "List_of_wine-producing_countries"),
    `Itália|5,09 milhões de t
França|3,71 milhões de t
Espanha|3,70 milhões de t
Estados Unidos|2,06 milhões de t
China|1,81 milhão de t
Austrália|1,48 milhão de t
Chile|1,34 milhão de t
Argentina|1,25 milhão de t
África do Sul|1,13 milhão de t
Portugal|719 mil t`,
  ),

  // ---------- Ciência e espaço ----------
  ranking(
    "tp-espaco-maiores-luas",
    "Ciência e espaço",
    "Quais são as 10 maiores luas do Sistema Solar?",
    "Satélites naturais por raio médio, em km",
    "Ganimedes e Titã são maiores que o planeta Mercúrio. Jápeto, de Saturno, ficou em 11º.",
    enwiki(
      "Solar System objects by size",
      "List_of_Solar_System_objects_by_size",
    ),
    `Ganimedes (Júpiter)|2.632 km de raio
Titã (Saturno)|2.575 km de raio
Calisto (Júpiter)|2.410 km de raio
Io (Júpiter)|1.824 km de raio
Lua (Terra)|1.737 km de raio
Europa (Júpiter)|1.561 km de raio
Tritão (Netuno)|1.353 km de raio
Titânia (Urano)|788 km de raio
Reia (Saturno)|764 km de raio
Oberon (Urano)|761 km de raio`,
  ),
  ranking(
    "tp-espaco-estrelas-brilhantes",
    "Ciência e espaço",
    "Quais são as 10 estrelas mais brilhantes do céu noturno?",
    "Magnitude aparente visual, sem contar o Sol (quanto menor, mais brilhante)",
    "Alfa Centauri conta como um ponto só, somando suas estrelas visíveis. Hadar ficou em 11º.",
    enwiki("Brightest stars", "List_of_brightest_stars"),
    `Sirius (Cão Maior)|−1,46
Canopus (Carina)|−0,74
Alfa Centauri (Centauro)|−0,27
Arcturus (Boieiro)|−0,05
Vega (Lira)|0,03
Capela (Cocheiro)|0,08
Rigel (Órion)|0,13
Prócion (Cão Menor)|0,34
Achernar (Erídano)|0,46
Betelgeuse (Órion)|0,50`,
  ),
  ranking(
    "tp-ciencia-elementos-crosta",
    "Ciência e espaço",
    "Quais são os 10 elementos químicos mais abundantes na crosta terrestre?",
    "Proporção em massa na crosta continental (CRC Handbook, 97ª edição)",
    "Oxigênio e silício formam quase três quartos da crosta. O fósforo ficou em 11º.",
    enwiki(
      "Abundance of elements in Earth's crust",
      "Abundance_of_elements_in_Earth%27s_crust",
    ),
    `Oxigênio|46,1%
Silício|28,2%
Alumínio|8,23%
Ferro|5,63%
Cálcio|4,15%
Sódio|2,36%
Magnésio|2,33%
Potássio|2,09%
Titânio|0,565%
Hidrogênio|0,14%`,
  ),
  // ---------- Lote tp2 (21/11/2026) · Brasil ----------
  tp2(
    "br-filmes-nacionais-publico",
    "Cinema",
    "Quais são os 10 filmes brasileiros com mais espectadores nos cinemas?",
    "Filmes nacionais por público nas salas do Brasil (Ancine/Filme B, lista da Wikipédia conferida em novembro de 2026)",
    "Minha Melhor Amiga, de 2026, ainda pode mudar de posição. O Trapalhão nas Minas do Rei Salomão (1977) ficou em 11º.",
    wiki(
      "Filmes brasileiros com mais de um milhão de espectadores",
      "Lista_de_filmes_brasileiros_com_mais_de_um_milh%C3%A3o_de_espectadores",
    ),
    `Nada a Perder (2018)|12,18 milhões
Os Dez Mandamentos: O Filme (2016)|11,31 milhões
Tropa de Elite 2 (2010)|11,15 milhões
Minha Mãe É uma Peça 3 (2019)|10,98 milhões
Dona Flor e Seus Dois Maridos (1976)|10,74 milhões
Minha Mãe É uma Peça 2 (2016)|9,24 milhões
A Dama do Lotação (1978)|6,51 milhões
Nada a Perder 2 (2019)|6.189.465
Minha Melhor Amiga (2026)|6.188.950
Se Eu Fosse Você 2 (2009)|6,14 milhões`,
  ),
  tp2(
    "br-filmes-publico-brasil",
    "Cinema",
    "Quais são os 10 filmes com mais espectadores na história dos cinemas no Brasil?",
    "Qualquer nacionalidade, por público nas salas brasileiras (tabela da Wikipédia conferida em 21/11/2026)",
    "Homem-Aranha: Um Novo Dia, de 2026, já passou Sem Volta para Casa. Minha Mãe É uma Peça 3 ficou em 11º.",
    wiki("Filmes de maior bilheteria", "Lista_de_filmes_de_maior_bilheteria"),
    `Divertida Mente 2 (2024)|22,18 milhões
Vingadores: Ultimato (2019)|20,43 milhões
Titanic (1997)|19,23 milhões
Homem-Aranha: Um Novo Dia (2026)|18,78 milhões
Homem-Aranha: Sem Volta para Casa (2021)|17,68 milhões
O Rei Leão (2019)|16,27 milhões
Vingadores: Guerra Infinita (2018)|14,57 milhões
Tubarão (1975)|13,06 milhões
Nada a Perder (2018)|12,18 milhões
Avatar: O Caminho da Água (2022)|11,78 milhões`,
  ),
  tp2(
    "br-novelas-capitulos",
    "TV e streaming",
    "Quais são as 10 telenovelas brasileiras com mais capítulos?",
    "Telenovelas brasileiras por número de capítulos exibidos (lista da Wikipédia)",
    "Trilogia Mutantes conta as três novelas da Record como uma só. Floribella (Band, 2005) ficou em 11º, com 344.",
    wiki(
      "Telenovelas brasileiras com mais capítulos",
      "Lista_de_telenovelas_brasileiras_com_mais_cap%C3%ADtulos",
    ),
    `Chiquititas (SBT, 1997)|786 capítulos
Redenção (Excelsior, 1966)|596 capítulos
Trilogia Mutantes (Record, 2007)|587 capítulos
As Aventuras de Poliana (SBT, 2018)|564 capítulos
Chiquititas (SBT, 2013)|545 capítulos
Os Imigrantes (Band, 1981)|459 capítulos
Rebelde (Record, 2011)|410 capítulos
Carinha de Anjo (SBT, 2016)|403 capítulos
O Machão (Tupi, 1974)|371 capítulos
Cúmplices de um Resgate (SBT, 2015)|357 capítulos`,
  ),
  tp2(
    "br-picos-mais-altos",
    "Natureza e geografia",
    "Quais são os 10 pontos mais altos do Brasil?",
    "Ranking oficial do IBGE (Projeto Pontos Culminantes, Anuário Estatístico), altitude em metros",
    "Medições posteriores, como a do Pico do Calçado (2.849 m), não entraram no ranking oficial.",
    wiki(
      "Projeto Pontos Culminantes do Brasil",
      "Projeto_Pontos_Culminantes_do_Brasil",
    ),
    `Pico da Neblina (AM)|2.993,8 m
Pico 31 de Março (AM)|2.972,7 m
Pico da Bandeira (MG/ES)|2.892 m
Pedra da Mina (MG/SP)|2.798,4 m
Pico das Agulhas Negras (MG/RJ)|2.791,5 m
Pico do Cristal (MG)|2.769,8 m
Monte Roraima (RR)|2.739,3 m
Morro do Couto (RJ)|2.680 m
Pedra do Sino de Itatiaia (MG)|2.670 m
Pico Três Estados (SP/MG/RJ)|2.665 m`,
  ),
  tp2(
    "br-regioes-metropolitanas",
    "Brasil",
    "Quais são as 10 regiões metropolitanas mais populosas do Brasil?",
    "Regiões metropolitanas e RIDE do DF, população do Censo 2022 (IBGE)",
    "A RIDE do Distrito Federal soma municípios de Goiás e Minas. Campinas é a única RM do top 10 sem capital.",
    wiki(
      "Regiões metropolitanas do Brasil por população",
      "Lista_de_regi%C3%B5es_metropolitanas_do_Brasil_por_popula%C3%A7%C3%A3o",
    ),
    `São Paulo|20,74 milhões
Rio de Janeiro|12,02 milhões
Belo Horizonte|5,73 milhões
RIDE do Distrito Federal e Entorno|4,47 milhões
Porto Alegre|4,02 milhões
Fortaleza|3,90 milhões
Recife|3,73 milhões
Curitiba|3,56 milhões
Salvador|3,41 milhões
Campinas|3,18 milhões`,
  ),
  tp2(
    "br-estados-expectativa-vida",
    "Brasil",
    "Quais são os 10 estados brasileiros com a maior expectativa de vida ao nascer?",
    "Unidades federativas · esperança de vida ao nascer em 2024 (IBGE, tabela 7362 do SIDRA)",
    "Santa Catarina é a única acima dos 81 anos. Pernambuco ficou em 11º, com 76,44 anos.",
    wiki(
      "Unidades federativas do Brasil por expectativa de vida",
      "Lista_de_unidades_federativas_do_Brasil_por_expectativa_de_vida",
    ),
    `Santa Catarina|81,16 anos
Espírito Santo|80,20 anos
São Paulo|79,93 anos
Distrito Federal|79,89 anos
Rio Grande do Sul|79,69 anos
Paraná|79,20 anos
Minas Gerais|79,01 anos
Rio de Janeiro|78,25 anos
Mato Grosso do Sul|77,38 anos
Rio Grande do Norte|77,26 anos`,
  ),
  tp2(
    "br-estados-mortalidade-infantil",
    "Brasil",
    "Quais são os 10 estados brasileiros com a menor mortalidade infantil?",
    "Unidades federativas · óbitos de menores de 1 ano por mil nascidos vivos em 2023 (DATASUS)",
    "Paraná e Distrito Federal empatam com 10,8; a ordem segue a tabela. Rondônia ficou em 11º, com 12,2.",
    wiki(
      "Unidades federativas do Brasil por mortalidade infantil",
      "Lista_de_unidades_federativas_do_Brasil_por_mortalidade_infantil",
    ),
    `Santa Catarina|9,0 por mil
Rio Grande do Sul|9,6 por mil
Tocantins|10,6 por mil
Paraná|10,8 por mil
Distrito Federal|10,8 por mil
Rio Grande do Norte|11,1 por mil
Minas Gerais|11,2 por mil
São Paulo|11,3 por mil
Espírito Santo|11,6 por mil
Ceará|11,7 por mil`,
  ),
  tp2(
    "br-municipios-idhm",
    "Brasil",
    "Quais são os 10 municípios brasileiros com o maior IDH municipal?",
    "IDHM de 2010, o último calculado com dados de Censo (Atlas do Desenvolvimento Humano/PNUD)",
    "Balneário Camboriú e Vitória empatam com 0,845; a ordem segue a tabela. Jundiaí ficou em 11º, com 0,822.",
    wiki(
      "Municípios do Brasil por IDH",
      "Lista_de_munic%C3%ADpios_do_Brasil_por_IDH",
    ),
    `São Caetano do Sul (SP)|0,862
Águas de São Pedro (SP)|0,854
Florianópolis (SC)|0,847
Balneário Camboriú (SC)|0,845
Vitória (ES)|0,845
Santos (SP)|0,840
Niterói (RJ)|0,837
Joaçaba (SC)|0,827
Brasília (DF)|0,824
Curitiba (PR)|0,823`,
  ),
  tp2(
    "br-municipios-pib-per-capita",
    "Brasil",
    "Quais são os 10 municípios brasileiros com o maior PIB per capita?",
    "Municípios · PIB per capita de 2023 a preços correntes (IBGE, PIB dos Municípios)",
    "Petróleo, refinarias e polos industriais explicam quase todo o top 10. Gavião Peixoto (SP) ficou em 11º.",
    wiki(
      "Municípios do Brasil por PIB per capita",
      "Lista_de_munic%C3%ADpios_do_Brasil_por_PIB_per_capita",
    ),
    `Saquarema (RJ)|R$ 722,4 mil
São Francisco do Conde (BA)|R$ 684,3 mil
Maricá (RJ)|R$ 679,7 mil
Paulínia (SP)|R$ 606,7 mil
Presidente Kennedy (ES)|R$ 538,0 mil
Ilhabela (SP)|R$ 424,5 mil
Santa Rita do Trivelato (MT)|R$ 409,4 mil
Louveira (SP)|R$ 388,7 mil
São João da Barra (RJ)|R$ 382,4 mil
Extrema (MG)|R$ 377,8 mil`,
  ),
  tp2(
    "br-municipios-densidade",
    "Brasil",
    "Quais são os 10 municípios brasileiros com a maior densidade demográfica?",
    "Habitantes por km² com base no Censo 2022 (IBGE), lista da Wikipédia",
    "Taboão da Serra, na Grande São Paulo, é o mais apertado do país. Belo Horizonte ficou em 11º.",
    wiki(
      "Municípios do Brasil por densidade demográfica",
      "Lista_de_munic%C3%ADpios_do_Brasil_por_densidade_demogr%C3%A1fica",
    ),
    `Taboão da Serra (SP)|13.417 hab/km²
Diadema (SP)|12.796 hab/km²
São João de Meriti (RJ)|12.522 hab/km²
Osasco (SP)|11.446 hab/km²
Carapicuíba (SP)|11.206 hab/km²
São Caetano do Sul (SP)|10.805 hab/km²
Olinda (PE)|8.474 hab/km²
Fortaleza (CE)|7.775 hab/km²
Nilópolis (RJ)|7.568 hab/km²
São Paulo (SP)|7.528 hab/km²`,
  ),
  tp2(
    "br-municipios-menos-populosos",
    "Brasil",
    "Quais são os 10 municípios menos populosos do Brasil?",
    "Moradores recenseados no Censo 2022 (IBGE)",
    "Só três municípios tinham menos de mil moradores no Censo 2022.",
    src(
      "CNN Brasil · Censo 2022: as 10 maiores e menores cidades",
      "https://www.cnnbrasil.com.br/nacional/censo-2022-veja-as-10-maiores-e-menores-cidades-do-pais/",
    ),
    `Serra da Saudade (MG)|833 habitantes
Borá (SP)|907 habitantes
Anhanguera (GO)|924 habitantes
Araguainha (MT)|1.010 habitantes
Nova Castilho (SP)|1.062 habitantes
Cedro do Abaeté (MG)|1.081 habitantes
André da Rocha (RS)|1.135 habitantes
Oliveira de Fátima (TO)|1.164 habitantes
União da Serra (RS)|1.170 habitantes
São Sebastião do Rio Preto (MG)|1.259 habitantes`,
  ),
  tp2(
    "br-parques-nacionais-visitados",
    "Brasil",
    "Quais foram os 10 parques nacionais mais visitados do Brasil em 2025?",
    "Visitantes em 2025 segundo o Ministério do Turismo (números aproximados)",
    "O Parque Nacional da Tijuca, onde fica o Cristo Redentor, recebeu mais que o dobro do segundo colocado.",
    src(
      "Itatiaia · Top 10 parques mais visitados do Brasil em 2025",
      "https://www.itatiaia.com.br/turismo/top-10-confira-os-parques-mais-visitados-do-brasil-em-2025/",
    ),
    `Tijuca (RJ)|mais de 4,9 milhões
Iguaçu (PR)|mais de 2,2 milhões
Jericoacoara (CE)|mais de 1,3 milhão
Fernando de Noronha (PE)|cerca de 792 mil
Serra da Bocaina (RJ/SP)|mais de 727 mil
Lençóis Maranhenses (MA)|mais de 654 mil
Restinga de Jurubatiba (RJ)|mais de 335 mil
Serra dos Órgãos (RJ)|mais de 330 mil
Ubajara (CE)|mais de 238 mil
Brasília (DF)|mais de 235 mil`,
  ),
  tp2(
    "br-predios-mais-altos",
    "Brasil",
    "Quais são os 10 prédios mais altos do Brasil?",
    "Arranha-céus concluídos, altura em metros (lista da Wikipédia; prédios em construção ficam de fora)",
    "Complexo Orion e Epic Tower empatam com 191 m; a ordem segue a tabela. Splendia Tower ficou em 11º, com 175 m.",
    wiki(
      "Arranha-céus mais altos do Brasil",
      "Lista_dos_arranha-c%C3%A9us_mais_altos_do_Brasil",
    ),
    `Yachthouse Residence Club, torre 2 (Balneário Camboriú)|294,1 m
Yachthouse Residence Club, torre 1 (Balneário Camboriú)|294 m
One Tower (Balneário Camboriú)|290 m
Infinity Coast (Balneário Camboriú)|234 m
Complexo Orion (Goiânia)|191 m
Epic Tower (Balneário Camboriú)|191 m
Tour Geneve (João Pessoa)|183 m
Kingdom Park Vaca Brava (Goiânia)|180 m
Millennium Palace (Balneário Camboriú)|177 m
New York Apartments|176 m`,
  ),
  tp2(
    "br-empresas-receita",
    "Empresas",
    "Quais são as 10 empresas brasileiras com a maior receita?",
    "Receita anual em dólares na Forbes Global 2000 de 2023 (lista da Wikipédia)",
    "Vibra Energia e Braskem aparecem com a mesma receita; a ordem segue a tabela. Marfrig ficou em 11º.",
    wiki("Maiores empresas do Brasil", "Lista_das_maiores_empresas_do_Brasil"),
    `Petrobras|US$ 124,2 bi
JBS|US$ 72,6 bi
Bradesco|US$ 56,3 bi
Banco do Brasil|US$ 54,0 bi
Itaú Unibanco|US$ 53,2 bi
Raízen|US$ 47,3 bi
Vale|US$ 41,4 bi
Vibra Energia|US$ 35,1 bi
Braskem|US$ 35,1 bi
Grupo Ultra|US$ 27,7 bi`,
  ),
  tp2(
    "br-musicas-2025-pro-musica",
    "Música",
    "Quais foram as 10 músicas mais tocadas no streaming no Brasil em 2025?",
    "Ranking anual da Pro-Música somando Spotify, YouTube, Deezer, Apple Music, Amazon Music e Napster",
    "No Spotify sozinho, Tubarões ficou em 1º; somando as plataformas, P do Pecado venceu.",
    src(
      "Exame · As 10 músicas mais tocadas do Brasil em 2025 (Pro-Música)",
      "https://exame.com/casual/as-10-musicas-mais-tocadas-do-brasil-em-2025/",
    ),
    `P do Pecado (Ao Vivo)|Grupo Menos É Mais e Simone Mendes
Tubarões (Ao Vivo)|Diego & Victor Hugo
Coração Partido (Corazón Partío) (Ao Vivo)|Grupo Menos É Mais
Apaga Apaga Apaga (Ao Vivo)|Danilo & Davi
Última Saudade (Ao Vivo)|Henrique & Juliano
Fui Mlk|Nilo, DJ Di Marques e MC Paiva ZS
Famosinha|DJ Caio Vieira, MC Meno K e MC Rodrigo do CN
Oh Garota Eu Quero Você Só Pra Mim|Oruam, Zé Felipe e MC Tuto
Ilusão de Ótica (Ao Vivo)|Matheus & Kauan e Ana Castela
Cópia Proibida|Léo Foguete`,
  ),
  tp2(
    "br-medalhas-olimpicas-modalidade",
    "Esportes e recordes",
    "Quais são as 10 modalidades que mais deram medalhas olímpicas ao Brasil?",
    "Jogos Olímpicos de Verão até Paris 2024, por total de medalhas",
    "Empates no total foram desempatados pelos ouros: futebol empata com a ginástica (10) e canoagem com skate (5). Skate ficou em 11º.",
    wiki("Brasil nos Jogos Olímpicos", "Brasil_nos_Jogos_Ol%C3%ADmpicos"),
    `Judô|28 medalhas (5 ouros)
Atletismo|21 medalhas (5 ouros)
Vela|19 medalhas (8 ouros)
Natação|15 medalhas (1 ouro)
Vôlei de praia|14 medalhas (4 ouros)
Vôlei|12 medalhas (5 ouros)
Ginástica artística|10 medalhas (3 ouros)
Futebol|10 medalhas (2 ouros)
Boxe|9 medalhas (2 ouros)
Canoagem|5 medalhas (1 ouro)`,
  ),
  // ---------- Lote tp2 (21/11/2026) · Esportes ----------
  tp2(
    "paris-2024-quadro-medalhas",
    "Esportes e recordes",
    "Quais foram os 10 primeiros países no quadro de medalhas das Olimpíadas de Paris 2024?",
    "Quadro oficial ordenado por ouros, depois pratas e bronzes",
    "EUA e China empataram com 40 ouros; os americanos ficaram na frente pelas pratas. O Brasil foi o 20º, com 3 ouros.",
    enwiki(
      "2024 Summer Olympics medal table",
      "2024_Summer_Olympics_medal_table",
    ),
    `Estados Unidos|40 ouros · 126 medalhas
China|40 ouros · 91 medalhas
Japão|20 ouros · 45 medalhas
Austrália|18 ouros · 53 medalhas
França|16 ouros · 64 medalhas
Países Baixos|15 ouros · 34 medalhas
Grã-Bretanha|14 ouros · 65 medalhas
Coreia do Sul|13 ouros · 32 medalhas
Itália|12 ouros · 40 medalhas
Alemanha|12 ouros · 33 medalhas`,
  ),
  tp2(
    "paris-2024-paralimpiadas",
    "Esportes e recordes",
    "Quais foram os 10 primeiros países no quadro de medalhas das Paralimpíadas de Paris 2024?",
    "Quadro oficial ordenado por ouros (atletas neutros não entram na classificação)",
    "O Brasil fez sua melhor campanha paralímpica: 5º lugar e 88 medalhas.",
    enwiki(
      "2024 Summer Paralympics medal table",
      "2024_Summer_Paralympics_medal_table",
    ),
    `China|94 ouros · 220 medalhas
Grã-Bretanha|49 ouros · 124 medalhas
Estados Unidos|36 ouros · 105 medalhas
Países Baixos|27 ouros · 56 medalhas
Brasil|25 ouros · 88 medalhas
Itália|24 ouros · 72 medalhas
Ucrânia|22 ouros · 82 medalhas
França|19 ouros · 75 medalhas
Austrália|18 ouros · 62 medalhas
Japão|14 ouros · 41 medalhas`,
  ),
  tp2(
    "milao-cortina-2026-medalhas",
    "Esportes e recordes",
    "Quais foram os 10 primeiros países no quadro de medalhas dos Jogos de Inverno de Milão-Cortina 2026?",
    "Quadro oficial ordenado por ouros, depois pratas e bronzes",
    "O Brasil ganhou ali sua primeira medalha nos Jogos de Inverno, um ouro, e ficou em 19º.",
    enwiki(
      "2026 Winter Olympics medal table",
      "2026_Winter_Olympics_medal_table",
    ),
    `Noruega|18 ouros · 41 medalhas
Estados Unidos|12 ouros · 33 medalhas
Países Baixos|10 ouros · 20 medalhas
Itália|10 ouros · 30 medalhas
Alemanha|8 ouros · 26 medalhas
França|8 ouros · 23 medalhas
Suécia|8 ouros · 18 medalhas
Suíça|6 ouros · 23 medalhas
Áustria|5 ouros · 18 medalhas
Japão|5 ouros · 24 medalhas`,
  ),
  // ---------- Lote tp2 (21/11/2026) · Cinema e cultura ----------
  tp2(
    "filmes-terror-bilheteria",
    "Cinema",
    "Quais são os 10 filmes de terror com maior bilheteria mundial?",
    "Bilheteria mundial sem correção pela inflação; retrato da Wikipédia em 21/11/2026 (filmes de 2026 ainda em cartaz)",
    "Obsession e Resident Evil, ambos de 2026, ainda podem subir. Sinais (2002) ficou em 11º.",
    enwiki(
      "Highest-grossing horror films",
      "List_of_highest-grossing_horror_films",
    ),
    `It: A Coisa (2017)|US$ 719,8 mi
O Sexto Sentido (1999)|US$ 672,8 mi
Eu Sou a Lenda (2007)|US$ 585,5 mi
Guerra Mundial Z (2013)|US$ 540,0 mi
Obsession (2026)|US$ 525,1 mi
Invocação do Mal 4: O Último Ritual (2025)|US$ 499,3 mi
Tubarão (1975)|US$ 495,2 mi
It: Capítulo Dois (2019)|US$ 473,1 mi
O Exorcista (1973)|US$ 430,9 mi
Resident Evil (2026)|US$ 416,5 mi`,
  ),
  tp2(
    "filmes-anime-bilheteria",
    "Cinema",
    "Quais são os 10 filmes de anime com maior bilheteria mundial?",
    "Bilheteria mundial aproximada, sem correção pela inflação (Wikipédia, 2026)",
    "Demon Slayer ocupa os dois primeiros lugares. Ponyo (2008) ficou em 11º.",
    enwiki(
      "Highest-grossing anime films",
      "List_of_highest-grossing_anime_films",
    ),
    `Demon Slayer: Castelo Infinito (2025)|US$ 793,6 mi
Demon Slayer: Mugen Train (2020)|US$ 525,7 mi
Your Name (2016)|US$ 409,2 mi
A Viagem de Chihiro (2001)|US$ 401,2 mi
Suzume (2022)|US$ 315,0 mi
O Menino e a Garça (2023)|US$ 294,2 mi
The First Slam Dunk (2022)|US$ 279,0 mi
One Piece Film: Red (2022)|US$ 246,5 mi
O Castelo Animado (2004)|US$ 237,5 mi
Princesa Mononoke (1997)|US$ 231,3 mi`,
  ),
  tp2(
    "filmes-pixar-bilheteria",
    "Cinema",
    "Quais são os 10 filmes da Pixar com maior bilheteria mundial?",
    "Longas da Pixar por bilheteria mundial, sem correção pela inflação (Wikipédia, novembro de 2026)",
    "Toy Story 5, de 2026, entrou direto no pódio. Up: Altas Aventuras ficou em 11º.",
    enwiki("Pixar films", "List_of_Pixar_films"),
    `Divertida Mente 2 (2024)|US$ 1,699 bi
Os Incríveis 2 (2018)|US$ 1,243 bi
Toy Story 5 (2026)|US$ 1,136 bi
Toy Story 4 (2019)|US$ 1,073 bi
Toy Story 3 (2010)|US$ 1,067 bi
Procurando Dory (2016)|US$ 1,029 bi
Procurando Nemo (2003)|US$ 871 mi
Divertida Mente (2015)|US$ 858 mi
Viva: A Vida É uma Festa (2017)|US$ 815 mi
Universidade Monstros (2013)|US$ 744 mi`,
  ),
  tp2(
    "filmes-2025-bilheteria",
    "Cinema",
    "Quais foram os 10 filmes com maior bilheteria mundial lançados em 2025?",
    "Filmes lançados em 2025, bilheteria mundial acumulada",
    "A animação chinesa Ne Zha 2 passou dos US$ 2 bilhões quase só com o público da China.",
    enwiki("2025 in film", "2025_in_film"),
    `Ne Zha 2|US$ 2,216 bi
Zootopia 2|US$ 1,870 bi
Avatar: Fogo e Cinzas|US$ 1,490 bi
Lilo & Stitch|US$ 1,038 bi
Um Filme Minecraft|US$ 961 mi
Jurassic World: Recomeço|US$ 872 mi
Demon Slayer: Castelo Infinito|US$ 794 mi
Como Treinar o Seu Dragão|US$ 640 mi
F1: O Filme|US$ 634 mi
Superman|US$ 619 mi`,
  ),
  tp2(
    "franquias-midia-receita",
    "Empresas",
    "Quais são as 10 franquias de mídia que mais faturaram na história?",
    "Receita total estimada somando produtos, games, filmes e licenciamento (Wikipédia; números de anos variados)",
    "Pokémon fatura mais que o dobro do 2º lugar, graças aos produtos licenciados. Hello Kitty ficou em 11º.",
    enwiki(
      "Highest-grossing media franchises",
      "List_of_highest-grossing_media_franchises",
    ),
    `Pokémon|US$ 130,7 bi
Mickey Mouse e Amigos|US$ 61,2 bi
Ursinho Pooh|US$ 50,2 bi
Star Wars|US$ 46,7 bi
Princesas Disney|US$ 45,4 bi
Call of Duty|US$ 40 bi
Anpanman|US$ 38,4 bi
Universo Cinematográfico Marvel|US$ 37,5 bi
Barbie|US$ 36,3 bi
Wizarding World (Harry Potter)|US$ 35,1 bi`,
  ),
  tp2(
    "pinturas-mais-caras",
    "Arte e cultura",
    "Quais são as 10 pinturas mais caras já vendidas?",
    "Preço de venda corrigido pela inflação para dólares de 2025 (Wikipédia)",
    "O Retrato de Elisabeth Lederer, de Klimt, entrou em novembro de 2025. A Porta-Estandarte, de Rembrandt, ficou em 11º.",
    enwiki("Most expensive paintings", "List_of_most_expensive_paintings"),
    `Salvator Mundi (Leonardo da Vinci)|US$ 591,5 mi
Interchange (Willem de Kooning)|cerca de US$ 407 mi
Os Jogadores de Cartas (Paul Cézanne)|mais de US$ 358 mi
Nafea Faa Ipoipo (Paul Gauguin)|US$ 285 mi
Number 17A (Jackson Pollock)|cerca de US$ 272 mi
Serpentes Aquáticas II (Gustav Klimt)|US$ 254 mi
No. 6 (Mark Rothko)|US$ 253 mi
Retratos de Maerten Soolmans e Oopjen Coppit (Rembrandt)|US$ 244 mi
As Mulheres de Argel, versão O (Pablo Picasso)|US$ 243,6 mi
Retrato de Elisabeth Lederer (Gustav Klimt)|US$ 236,4 mi`,
  ),
  tp2(
    "broadway-mais-longos",
    "Arte e cultura",
    "Quais são os 10 espetáculos com mais apresentações na história da Broadway?",
    "Número de apresentações contado até 15/11/2026 (Wikipédia); musicais em cartaz seguem somando",
    "Chicago, O Rei Leão e Wicked ainda estão em cartaz. A Bela e a Fera ficou em 11º.",
    enwiki(
      "Longest-running Broadway shows",
      "List_of_the_longest-running_Broadway_shows",
    ),
    `O Fantasma da Ópera|13.981
Chicago (remontagem de 1996)|11.832
O Rei Leão|11.457
Wicked|8.995
Cats|7.485
Les Misérables|6.680
A Chorus Line|6.137
Oh! Calcutta! (remontagem de 1976)|5.959
The Book of Mormon|5.819
Mamma Mia!|5.758`,
  ),
  // ---------- Lote tp2 (21/11/2026) · Games ----------
  tp2(
    "games-game-boy",
    "Games",
    "Quais são os 10 jogos mais vendidos do Game Boy (e Game Boy Color)?",
    "Unidades vendidas no mundo (Wikipédia); versões gêmeas de Pokémon contam juntas",
    "Pokémon e Tetris passam dos 30 milhões cada. Zelda: Oracle of Seasons/Ages ficou em 11º.",
    enwiki(
      "Best-selling Game Boy games",
      "List_of_best-selling_Game_Boy_video_games",
    ),
    `Pokémon Red/Blue/Yellow|45,9 milhões
Tetris|35 milhões
Pokémon Gold/Silver/Crystal|30 milhões
Super Mario Land|18,14 milhões
Super Mario Land 2: 6 Golden Coins|11,18 milhões
Dr. Mario|5,34 milhões
Pokémon Pinball|5,31 milhões
Wario Land: Super Mario Land 3|5,19 milhões
Kirby's Dream Land|5,13 milhões
Super Mario Bros. Deluxe|5,07 milhões`,
  ),
  tp2(
    "games-gba",
    "Games",
    "Quais são os 10 jogos mais vendidos do Game Boy Advance?",
    "Unidades vendidas no mundo (Wikipédia); versões gêmeas de Pokémon contam juntas",
    "Os três primeiros são Pokémon. Zelda: A Link to the Past ficou em 11º, a 10 mil cópias do 10º.",
    enwiki(
      "Best-selling Game Boy Advance games",
      "List_of_best-selling_Game_Boy_Advance_video_games",
    ),
    `Pokémon Ruby/Sapphire|16,22 milhões
Pokémon FireRed/LeafGreen|12 milhões
Pokémon Emerald|6,8 milhões
Mario Kart: Super Circuit|5,91 milhões
Super Mario Advance 2 (Super Mario World)|5,69 milhões
Super Mario Advance|5,57 milhões
Super Mario Advance 4 (Super Mario Bros. 3)|5,43 milhões
Namco Museum|2,96 milhões
Pac-Man Collection|2,94 milhões
Super Mario Advance 3 (Yoshi's Island)|2,83 milhões`,
  ),
  tp2(
    "games-snes",
    "Games",
    "Quais são os 10 jogos mais vendidos do Super Nintendo?",
    "Unidades vendidas no mundo (Wikipédia)",
    "Super Mario World veio junto com o console em muitos pacotes. Donkey Kong Country 3 ficou em 11º.",
    enwiki(
      "Best-selling SNES games",
      "List_of_best-selling_Super_Nintendo_Entertainment_System_video_games",
    ),
    `Super Mario World|20,61 milhões
Super Mario All-Stars|10,55 milhões
Donkey Kong Country|9,3 milhões
Super Mario Kart|8,76 milhões
Street Fighter II|6,3 milhões
Donkey Kong Country 2|5,15 milhões
Zelda: A Link to the Past|4,61 milhões
Super Mario World 2: Yoshi's Island|4,12 milhões
Street Fighter II Turbo|4,1 milhões
Star Fox|4 milhões`,
  ),
  tp2(
    "games-nes",
    "Games",
    "Quais são os 10 jogos mais vendidos do Nintendinho (NES)?",
    "Unidades vendidas no mundo (Wikipédia)",
    "Duck Hunt vinha no pacote com a pistola Zapper. Teenage Mutant Ninja Turtles ficou em 11º.",
    enwiki(
      "Best-selling NES games",
      "List_of_best-selling_Nintendo_Entertainment_System_video_games",
    ),
    `Super Mario Bros.|40,24 milhões
Duck Hunt|28,31 milhões
Super Mario Bros. 3|18 milhões
Tetris|8 milhões
Super Mario Bros. 2|7,46 milhões
The Legend of Zelda|6,51 milhões
Dr. Mario|4,85 milhões
Zelda II: The Adventure of Link|4,38 milhões
Excitebike|4,16 milhões
Golf|4,01 milhões`,
  ),
  tp2(
    "games-n64",
    "Games",
    "Quais são os 10 jogos mais vendidos do Nintendo 64?",
    "Unidades vendidas no mundo (Wikipédia)",
    "GoldenEye 007 é o único jogo de tiro do top 10. Pokémon Snap ficou em 11º.",
    enwiki(
      "Best-selling Nintendo 64 games",
      "List_of_best-selling_Nintendo_64_video_games",
    ),
    `Super Mario 64|11,91 milhões
Mario Kart 64|9,87 milhões
GoldenEye 007|8,09 milhões
Zelda: Ocarina of Time|7,6 milhões
Super Smash Bros.|5,55 milhões
Pokémon Stadium|5,46 milhões
Donkey Kong 64|5,27 milhões
Diddy Kong Racing|4,88 milhões
Star Fox 64|4 milhões
Banjo-Kazooie|3,65 milhões`,
  ),
  tp2(
    "games-3ds",
    "Games",
    "Quais são os 10 jogos mais vendidos do Nintendo 3DS?",
    "Unidades vendidas no mundo, dados da Nintendo até 31/03/2025 (Yo-kai Watch 2 até 31/12/2022)",
    "Quatro dos dez são Pokémon. Tomodachi Life ficou em 11º.",
    enwiki(
      "Best-selling Nintendo 3DS games",
      "List_of_best-selling_Nintendo_3DS_video_games",
    ),
    `Mario Kart 7|18,99 milhões
Pokémon X/Y|16,80 milhões
Pokémon Sun/Moon|16,34 milhões
Pokémon Omega Ruby/Alpha Sapphire|14,68 milhões
New Super Mario Bros. 2|13,42 milhões
Animal Crossing: New Leaf|13,07 milhões
Super Mario 3D Land|12,89 milhões
Super Smash Bros. for Nintendo 3DS|9,65 milhões
Pokémon Ultra Sun/Ultra Moon|9,26 milhões
Yo-kai Watch 2|7,30 milhões`,
  ),
  tp2(
    "games-wii-u",
    "Games",
    "Quais são os 10 jogos mais vendidos do Wii U?",
    "Unidades vendidas no mundo (Wikipédia; dados da Nintendo até 31/03/2023)",
    "Quase todos ganharam versão turbinada no Switch depois. Donkey Kong Country: Tropical Freeze ficou em 11º.",
    enwiki(
      "Best-selling Wii U games",
      "List_of_best-selling_Wii_U_video_games",
    ),
    `Mario Kart 8|8,46 milhões
Super Mario 3D World|5,89 milhões
New Super Mario Bros. U|5,82 milhões
Super Smash Bros. for Wii U|5,38 milhões
Nintendo Land|5,21 milhões
Splatoon|4,95 milhões
Super Mario Maker|4,02 milhões
New Super Luigi U|3,07 milhões
Zelda: The Wind Waker HD|2,37 milhões
Mario Party 10|2,27 milhões`,
  ),
  tp2(
    "br-rios-mais-extensos",
    "Natureza e geografia",
    "Quais são os 10 rios mais extensos que passam pelo Brasil?",
    "Extensão total de cada rio, incluindo trechos fora do país (lista da Wikipédia)",
    "Paraná e Paraguai também correm por países vizinhos. O Parnaíba ficou em 11º, com 1.850 km.",
    wiki("Listas de rios do Brasil", "Listas_de_rios_do_Brasil"),
    `Amazonas|6.992 km
Paraná|3.998 km
Purus|3.400 km
Madeira|3.315 km
São Francisco|2.863 km
Paraguai|2.695 km
Tocantins|2.460 km
Juruá|2.410 km
Araguaia|2.115 km
Xingu|1.870 km`,
  ),
  tp2(
    "br-nomes-femininos-censo-2022",
    "Nomes",
    "Quais são os 10 nomes femininos mais comuns no Brasil segundo o Censo 2022?",
    "Pessoas com cada primeiro nome no Censo 2022 (IBGE, Nomes no Brasil, divulgado em novembro de 2025)",
    "Maria tem mais que o triplo de Ana, a segunda colocada. Os nomes aparecem como o IBGE os agrupa, sem acento.",
    src(
      "CNN Brasil · IBGE revela nomes e sobrenomes mais populares do Brasil",
      "https://www.cnnbrasil.com.br/nacional/brasil/ibge-revela-nomes-e-sobrenomes-mais-populares-do-brasil-veja-ranking/",
    ),
    `Maria|12,22 milhões
Ana|3,93 milhões
Francisca|661,6 mil
Julia|646,3 mil
Antonia|553,0 mil
Juliana|536,7 mil
Adriana|533,8 mil
Fernanda|520,7 mil
Marcia|520,0 mil
Patricia|499,1 mil`,
  ),
  tp2(
    "br-nomes-masculinos-censo-2022",
    "Nomes",
    "Quais são os 10 nomes masculinos mais comuns no Brasil segundo o Censo 2022?",
    "Pessoas com cada primeiro nome no Censo 2022 (IBGE, Nomes no Brasil, divulgado em novembro de 2025)",
    "Lucas e Gabriel são os únicos nomes 'jovens' do top 10. Luiz e Paulo ficaram separados por só 2 mil pessoas.",
    src(
      "CNN Brasil · IBGE revela nomes e sobrenomes mais populares do Brasil",
      "https://www.cnnbrasil.com.br/nacional/brasil/ibge-revela-nomes-e-sobrenomes-mais-populares-do-brasil-veja-ranking/",
    ),
    `José|5,14 milhões
João|3,41 milhões
Antônio|2,23 milhões
Francisco|1,66 milhão
Pedro|1,61 milhão
Carlos|1,47 milhão
Lucas|1,332 milhão
Luiz|1,328 milhão
Paulo|1,326 milhão
Gabriel|1,20 milhão`,
  ),
  tp2(
    "br-clubes-receita-2025",
    "Esportes e recordes",
    "Quais foram os 10 clubes brasileiros com a maior receita em 2025?",
    "Receita total de 2025 nos balanços dos clubes, compilada pela Sports Value (publicado em maio de 2026)",
    "Prêmios do novo Mundial de Clubes inflaram as contas de 2025. O Internacional ficou em 11º, com R$ 655,5 milhões.",
    src(
      "Times Brasil · Receitas dos clubes com maior faturamento em 2025 (Sports Value)",
      "https://timesbrasil.com.br/esportes/veja-as-receitas-dos-clubes-com-maior-faturamento-do-futebol-brasileiro-em-2025/",
    ),
    `Flamengo|R$ 2,089 bi
Palmeiras|R$ 1,696 bi
Botafogo|R$ 1,388 bi
São Paulo|R$ 1,085 bi
Fluminense|R$ 1,022 bi
Corinthians|R$ 971,1 mi
Grêmio|R$ 736,8 mi
Santos|R$ 678,5 mi
Cruzeiro|R$ 677,2 mi
Atlético Mineiro|R$ 669,8 mi`,
  ),
  tp2(
    "br-cidades-nao-capitais",
    "Brasil",
    "Quais são as 10 cidades mais populosas do Brasil que não são capitais?",
    "Municípios que não são capitais estaduais nem Brasília, população do Censo 2022 (IBGE)",
    "Guarulhos tem mais gente que 15 capitais. Ribeirão Preto ficou em 11º.",
    wiki(
      "Municípios do Brasil por população (2022)",
      "Lista_de_munic%C3%ADpios_do_Brasil_por_popula%C3%A7%C3%A3o_(2022)",
    ),
    `Guarulhos (SP)|1.291.771
Campinas (SP)|1.139.047
São Gonçalo (RJ)|896.744
São Bernardo do Campo (SP)|810.729
Duque de Caxias (RJ)|808.161
Nova Iguaçu (RJ)|785.867
Santo André (SP)|748.919
Osasco (SP)|728.615
Sorocaba (SP)|723.682
Uberlândia (MG)|713.224`,
  ),
  tp2(
    "br-terras-indigenas-area",
    "Brasil",
    "Quais são as 10 maiores terras indígenas do Brasil em área?",
    "Área calculada pelo Instituto Socioambiental (ISA), em km², na lista da Wikipédia (atualizada em 2012)",
    "A Terra Yanomami é maior que Portugal. Uru-Eu-Wau-Wau (RO) ficou em 11º.",
    wiki(
      "Terras indígenas do Brasil",
      "Lista_de_terras_ind%C3%ADgenas_do_Brasil",
    ),
    `Yanomami (AM/RR)|96.650 km²
Vale do Javari (AM)|85.753 km²
Alto Rio Negro (AM)|80.370 km²
Menkragnoti (PA/MT)|49.471 km²
Trombetas/Mapuera (AM/PA/RR)|39.913 km²
Kayapó (PA)|32.979 km²
Tumucumaque (AP/PA)|30.806 km²
Xingu (MT)|26.530 km²
Waimiri Atroari (AM/RR)|26.023 km²
Mundurucu (PA)|23.999 km²`,
  ),
  tp2(
    "br-estados-eleitores-2026",
    "Brasil",
    "Quais são os 10 estados com mais eleitores aptos a votar nas eleições de 2026?",
    "Eleitorado apto por unidade federativa nas Eleições 2026 (dados do TSE)",
    "Só São Paulo reúne 21,5% dos 158,7 milhões de eleitores do país.",
    src(
      "Portal de Prefeitura · Os 10 maiores colégios eleitorais de 2026 (TSE)",
      "https://portaldeprefeitura.com.br/bastidores-da-politica/eleicoes/eleicoes-2026-saiba-quais-sao-os-10-maiores-colegios-eleitorais-do/633471/",
    ),
    `São Paulo|34,10 milhões
Minas Gerais|16,38 milhões
Rio de Janeiro|12,86 milhões
Bahia|11,32 milhões
Paraná|8,61 milhões
Rio Grande do Sul|8,53 milhões
Pernambuco|7,23 milhões
Ceará|7,00 milhões
Pará|6,27 milhões
Santa Catarina|5,73 milhões`,
  ),
  tp2(
    "br-predios-sao-paulo",
    "Brasil",
    "Quais são os 10 prédios mais altos da cidade de São Paulo?",
    "Edifícios concluídos, altura em metros (Wikipédia); o Alto das Nações, em construção, fica de fora",
    "O Mirante do Vale, de 1960, foi o mais alto da cidade por mais de 60 anos. Torre Norte e Parque Cidade Jardim empatam com 158 m; Eco Berrini ficou em 11º.",
    enwiki(
      "Tallest buildings in São Paulo",
      "List_of_tallest_buildings_in_S%C3%A3o_Paulo",
    ),
    `Platina 220 (2022)|172 m
Mirante do Vale (1960)|170 m
Figueira Altos do Tatuapé (2021)|168 m
Edifício Itália (1965)|165 m
Edifício Altino Arantes (1947)|161 m
Torre Norte do CENU (1999)|158 m
Parque Cidade Jardim|158 m
Josephine (2014)|150 m
Birmann 21 (1997)|149 m
E-Tower (2005)|148 m`,
  ),
  tp2(
    "copa-do-mundo-tabela-historica",
    "Esportes e recordes",
    "Quais são as 10 seleções com mais pontos na história das Copas do Mundo?",
    "Tabela histórica de todas as Copas até a de 2026, vitória valendo 3 pontos (Wikipédia, novembro de 2026)",
    "O Brasil lidera com folga e é o único que jogou todas as 23 edições. O México ficou em 11º.",
    enwiki(
      "FIFA World Cup records and statistics",
      "FIFA_World_Cup_records_and_statistics",
    ),
    `Brasil|257 pontos
Alemanha|232 pontos
Argentina|179 pontos
Itália|156 pontos
França|149 pontos
Inglaterra|137 pontos
Espanha|132 pontos
Países Baixos|112 pontos
Uruguai|90 pontos
Bélgica|84 pontos`,
  ),
  // ---------- Lote tp2 (21/11/2026) · Mundo, natureza e ciência ----------
  tp2(
    "paises-menores-area",
    "Natureza e geografia",
    "Quais são os 10 menores países do mundo em área?",
    "Estados soberanos membros ou observadores da ONU, área total em km² (sem territórios dependentes)",
    "O Vaticano é observador na ONU, não membro. Granada ficou em 11º, com 345 km².",
    enwiki(
      "Countries and dependencies by area",
      "List_of_countries_and_dependencies_by_area",
    ),
    `Vaticano|0,44 km²
Mônaco|2 km²
Nauru|21 km²
Tuvalu|26 km²
San Marino|61 km²
Liechtenstein|160 km²
Ilhas Marshall|181 km²
São Cristóvão e Névis|261 km²
Maldivas|300 km²
Malta|315 km²`,
  ),
  tp2(
    "paises-expectativa-vida",
    "Natureza e geografia",
    "Quais são os 10 países e territórios com a maior expectativa de vida do mundo?",
    "Expectativa de vida ao nascer em 2023, estimativas da ONU (World Population Prospects)",
    "Hong Kong e Polinésia Francesa são territórios, não países. A ilha francesa de Reunião ficou em 11º.",
    enwiki(
      "Countries by life expectancy",
      "List_of_countries_by_life_expectancy",
    ),
    `Hong Kong|85,51 anos
Japão|84,71 anos
Coreia do Sul|84,33 anos
Polinésia Francesa|84,07 anos
Andorra|84,04 anos
Suíça|83,95 anos
Austrália|83,92 anos
Singapura|83,74 anos
Itália|83,72 anos
Espanha|83,67 anos`,
  ),
  tp2(
    "paises-bilionarios-2026",
    "Empresas",
    "Quais são os 10 países com mais bilionários em 2026?",
    "Número de bilionários por país na lista da Forbes de março de 2026",
    "O Brasil subiu de 56 para 70 bilionários em um ano. O Reino Unido ficou em 11º, com 56.",
    enwiki(
      "Countries by number of billionaires",
      "List_of_countries_by_number_of_billionaires",
    ),
    `Estados Unidos|989
China|539
Índia|229
Alemanha|212
Rússia|147
Itália|89
Canadá|82
Hong Kong|71
Brasil|70
Taiwan|66`,
  ),
  tp2(
    "capitais-mais-altas",
    "Natureza e geografia",
    "Quais são as 10 capitais nacionais mais altas do mundo?",
    "Altitude em metros das capitais de membros e observadores da ONU; a Bolívia aparece com a sede do governo e a capital constitucional",
    "Cabul ficou em 11º, só 5 m abaixo de Nairóbi. Os valores de altitude variam um pouco entre fontes.",
    enwiki(
      "Capital cities by elevation",
      "List_of_capital_cities_by_elevation",
    ),
    `La Paz (sede do governo da Bolívia)|3.640 m
Quito (Equador)|2.850 m
Sucre (capital constitucional da Bolívia)|2.790 m
Bogotá (Colômbia)|2.625 m
Adis Abeba (Etiópia)|2.355 m
Timbu (Butão)|2.334 m
Asmara (Eritreia)|2.325 m
Sanaã (Iêmen)|2.250 m
Cidade do México (México)|2.240 m
Nairóbi (Quênia)|1.795 m`,
  ),
  tp2(
    "montanhas-andes",
    "Natureza e geografia",
    "Quais são as 10 montanhas mais altas dos Andes?",
    "Picos com pelo menos 400 m de proeminência, altitude em metros (Wikipédia)",
    "Todas ficam na Argentina, no Chile ou no Peru. O peruano Yerupajá ficou em 11º, com 6.634 m.",
    enwiki("Mountains in the Andes", "List_of_mountains_in_the_Andes"),
    `Aconcágua (Argentina)|6.961 m
Ojos del Salado (Argentina/Chile)|6.893 m
Monte Pissis (Argentina)|6.792 m
Huascarán (Peru)|6.768 m
Bonete (Argentina)|6.759 m
Tres Cruces (Argentina/Chile)|6.758 m
Llullaillaco (Argentina/Chile)|6.739 m
Mercedario (Argentina)|6.720 m
Cazadero/Walther Penck (Argentina)|6.670 m
Incahuasi (Argentina/Chile)|6.638 m`,
  ),
  tp2(
    "lagos-mais-profundos",
    "Natureza e geografia",
    "Quais são os 10 lagos mais profundos do mundo?",
    "Profundidade máxima em metros (Wikipédia); Vostok fica sob o gelo da Antártida",
    "Vostok e Viedma aparecem com cerca de 900 m; a ordem segue a tabela. O Crater Lake (EUA) ficou em 11º.",
    enwiki("Lakes by depth", "List_of_lakes_by_depth"),
    `Baikal (Rússia)|1.642 m
Tanganica (África)|1.470 m
Mar Cáspio|1.025 m
Vostok (Antártida)|cerca de 900 m
Viedma (Argentina)|cerca de 900 m
O'Higgins/San Martín (Chile/Argentina)|799 m
Argentino (Argentina)|719 m
Malawi (África)|706 m
Issyk-Kul (Quirguistão)|668 m
Grande Lago do Escravo (Canadá)|614 m`,
  ),
  tp2(
    "cavernas-mais-profundas",
    "Natureza e geografia",
    "Quais são as 10 cavernas mais profundas do mundo?",
    "Profundidade máxima explorada, em metros (Wikipédia)",
    "As quatro primeiras ficam na Abecásia, região disputada da Geórgia. Hirlatzhöhle e Huautla empatam com 1.560 m; Chevé (México) ficou em 11º.",
    enwiki("Deepest caves", "List_of_deepest_caves"),
    `Krubera-Voronya (Abecásia/Geórgia)|2.224 m
Veryovkina (Abecásia/Geórgia)|2.209 m
Sarma (Abecásia/Geórgia)|1.830 m
Tovliani (Abecásia/Geórgia)|1.760 m
Lamprechtsofen (Áustria)|1.727 m
Gouffre Mirolda (França)|1.661 m
Gouffre Jean-Bernard (França)|1.612 m
Sistema del Cerro del Cuevón (Espanha)|1.589 m
Hirlatzhöhle (Áustria)|1.560 m
Sistema Huautla (México)|1.560 m`,
  ),
  tp2(
    "arvores-mais-altas-especies",
    "Natureza e geografia",
    "Quais são as 10 espécies de árvore com os exemplares mais altos já medidos?",
    "Árvore viva mais alta medida de cada espécie, em metros (Wikipédia)",
    "O angelim-vermelho (Dinizia excelsa), na divisa do Amapá com o Pará, ficou em 11º, com 88,5 m: a mais alta da lista no Brasil.",
    enwiki("Tallest trees", "List_of_tallest_trees"),
    `Sequoia-vermelha (Hyperion, EUA)|116,2 m
Cipreste-do-tibete (China)|102,3 m
Espruce-de-sitka (EUA)|100,2 m
Abeto-de-douglas (EUA)|99,5 m
Meranti-amarelo (Menara, Malásia)|97,6 m
Sequoia-gigante (EUA)|96,4 m
Eucalyptus regnans (Centurion, Austrália)|96 m
Eucalipto-azul (Austrália)|92 m
Eucalyptus viminalis (White Knight, Austrália)|91,3 m
Abeto-nobre (EUA)|89,9 m`,
  ),
  tp2(
    "aves-mais-pesadas",
    "Natureza e geografia",
    "Quais são as 10 aves vivas mais pesadas do mundo?",
    "Espécies atuais ordenadas pela massa média dos adultos (Wikipédia)",
    "A ema, que vive no Brasil, é a 7ª. A abetarda-kori, que voa, ficou em 11º.",
    enwiki("Largest birds", "List_of_largest_birds"),
    `Avestruz-comum|104 kg
Avestruz-somali|90 kg
Casuar-do-sul|45 kg
Casuar-do-norte|44 kg
Emu|33 kg
Pinguim-imperador|31,5 kg
Ema|23 kg
Casuar-anão|19,7 kg
Nandu-de-darwin|19,6 kg
Pinguim-rei|13,6 kg`,
  ),
  tp2(
    "sistema-solar-maiores-corpos",
    "Ciência e espaço",
    "Quais são os 10 maiores corpos do Sistema Solar, contando o Sol?",
    "Raio médio em km de estrelas, planetas e luas",
    "Ganimedes e Titã são maiores que Mercúrio, que ficou em 11º.",
    enwiki(
      "Solar System objects by size",
      "List_of_Solar_System_objects_by_size",
    ),
    `Sol|695.700 km
Júpiter|69.886 km
Saturno|58.232 km
Urano|25.362 km
Netuno|24.622 km
Terra|6.371 km
Vênus|6.052 km
Marte|3.390 km
Ganimedes (lua de Júpiter)|2.632 km
Titã (lua de Saturno)|2.575 km`,
  ),
  tp2(
    "pontes-mais-longas",
    "Natureza e geografia",
    "Quais são as 10 pontes mais longas do mundo?",
    "Extensão total, em km (Wikipédia); não há um método único de medição",
    "A maioria é viaduto de trem-bala na China. A Lake Pontchartrain Causeway (EUA) ficou em 11º.",
    enwiki("Longest bridges", "List_of_longest_bridges"),
    `Danyang–Kunshan (China)|164,8 km
Changhua–Kaohsiung (Taiwan)|157,3 km
Kita–Yaita (Japão)|114,4 km
Grande Ponte de Tianjin (China)|113,7 km
Grande Ponte de Cangde (China)|105,9 km
Weinan Weihe (China)|79,7 km
Burapha Withi (Tailândia)|54,0 km
Hong Kong–Zhuhai–Macau (China)|50,0 km
Grande Ponte de Pequim (China)|48,2 km
Skyway de Metro Manila (Filipinas)|39,2 km`,
  ),
  tp2(
    "barragens-mais-altas",
    "Natureza e geografia",
    "Quais são as 10 barragens construídas pelo homem mais altas do mundo?",
    "Barragens concluídas, altura em metros (Wikipédia); barragens naturais e desativadas ficam de fora",
    "Seis das dez são chinesas. Nuozhadu (China) ficou em 11º, com 261,5 m.",
    enwiki("Tallest dams", "List_of_tallest_dams"),
    `Shuangjiangkou (China)|312 m
Jinping-I (China)|305 m
Nurek (Tajiquistão)|300 m
Lianghekou (China)|295 m
Xiaowan (China)|292 m
Baihetan (China)|289 m
Xiluodu (China)|285,5 m
Grande Dixence (Suíça)|285 m
Enguri (Geórgia)|271,5 m
Yusufeli (Turquia)|270 m`,
  ),
  tp2(
    "cerveja-consumo-per-capita",
    "Comida e bebida",
    "Quais são os 10 países que mais bebem cerveja por pessoa?",
    "Litros por habitante por ano; maioria com dados de 2019 do relatório Kirin (Tchéquia com dado de 2024)",
    "O Brasil aparece só em 31º, com 58,4 litros por pessoa. A Estônia ficou em 11º.",
    enwiki(
      "Countries by beer consumption per capita",
      "List_of_countries_by_beer_consumption_per_capita",
    ),
    `Tchéquia|126,0 litros
Áustria|107,8 litros
Romênia|100,3 litros
Alemanha|99,0 litros
Polônia|97,7 litros
Namíbia|95,5 litros
Irlanda|92,9 litros
Espanha|88,8 litros
Croácia|85,5 litros
Letônia|81,4 litros`,
  ),
  // ---------- Lote tp2 (21/11/2026) · Esportes, música, TV e lazer ----------
  tp2(
    "olimpiadas-inverno-historico",
    "Esportes e recordes",
    "Quais são os 10 países com mais medalhas de ouro na história dos Jogos Olímpicos de Inverno?",
    "Quadro histórico de 1924 a Milão-Cortina 2026, ordenado por ouros",
    "A União Soviética ainda aparece mesmo extinta. A França ficou em 11º, com 50 ouros.",
    enwiki(
      "All-time Olympic Games medal table",
      "All-time_Olympic_Games_medal_table",
    ),
    `Noruega|166 ouros · 447 medalhas
Estados Unidos|126 ouros · 363 medalhas
Alemanha|113 ouros · 293 medalhas
Canadá|82 ouros · 246 medalhas
União Soviética|78 ouros · 194 medalhas
Áustria|76 ouros · 269 medalhas
Suécia|73 ouros · 195 medalhas
Suíça|69 ouros · 191 medalhas
Países Baixos|63 ouros · 167 medalhas
Itália|52 ouros · 171 medalhas`,
  ),
  tp2(
    "super-bowl-audiencia",
    "TV e streaming",
    "Quais foram os 10 Super Bowls com a maior audiência média nos EUA?",
    "Audiência média nos Estados Unidos, em milhões de espectadores, até o Super Bowl LX (2026)",
    "As três maiores audiências são as de 2024, 2025 e 2026. O Super Bowl XLVII (2013) ficou em 11º.",
    enwiki("Super Bowl television ratings", "Super_Bowl_television_ratings"),
    `Super Bowl LIX (2025)|127,7 milhões
Super Bowl LX (2026)|124,9 milhões
Super Bowl LVIII (2024)|120,25 milhões
Super Bowl XLIX (2015)|114,44 milhões
Super Bowl LVII (2023)|114,21 milhões
Super Bowl XLVIII (2014)|112,19 milhões
Super Bowl 50 (2016)|111,86 milhões
Super Bowl XLVI (2012)|111,35 milhões
Super Bowl LI (2017)|111,32 milhões
Super Bowl XLV (2011)|111,04 milhões`,
  ),
  tp2(
    "billboard-fim-de-ano-2025",
    "Música",
    "Quais foram as 10 primeiras músicas da parada de fim de ano da Billboard Hot 100 de 2025?",
    "Billboard Year-End Hot 100 de 2025 (desempenho ao longo do ano nos EUA)",
    "Bruno Mars aparece duas vezes no top 10. Love Somebody, de Morgan Wallen, ficou em 11º.",
    enwiki(
      "Billboard Year-End Hot 100 singles of 2025",
      "Billboard_Year-End_Hot_100_singles_of_2025",
    ),
    `Die with a Smile|Lady Gaga e Bruno Mars
Luther|Kendrick Lamar e SZA
A Bar Song (Tipsy)|Shaboozey
Lose Control|Teddy Swims
Birds of a Feather|Billie Eilish
Beautiful Things|Benson Boone
Ordinary|Alex Warren
I Had Some Help|Post Malone e Morgan Wallen
APT.|Rosé e Bruno Mars
Pink Pony Club|Chappell Roan`,
  ),
  tp2(
    "parques-tematicos-2024",
    "Arte e cultura",
    "Quais foram os 10 parques temáticos mais visitados do mundo em 2024?",
    "Público anual de 2024 segundo o relatório TEA/AECOM",
    "Oito dos dez levam a marca Disney. O Disney California Adventure ficou em 11º.",
    enwiki("Amusement park rankings", "List_of_amusement_park_rankings"),
    `Magic Kingdom (Flórida)|17,84 milhões
Disneyland (Califórnia)|17,34 milhões
Universal Studios Japan (Osaka)|16,0 milhões
Tokyo Disneyland|15,10 milhões
Shanghai Disneyland|14,70 milhões
Chimelong Ocean Kingdom (China)|12,63 milhões
Tokyo DisneySea|12,44 milhões
Epcot (Flórida)|12,13 milhões
Disney's Hollywood Studios (Flórida)|10,33 milhões
Disneyland Park (Paris)|10,21 milhões`,
  ),
  tp2(
    "montanhas-russas-mais-altas",
    "Arte e cultura",
    "Quais são as 10 montanhas-russas mais altas do mundo em operação?",
    "Montanhas-russas de aço em funcionamento, altura em metros (Wikipédia, novembro de 2026)",
    "A Kingda Ka, que já foi a mais alta, fechou. Tormenta e Millennium Force diferem por 1 pé (310 contra 309).",
    enwiki("Roller coaster rankings", "List_of_roller_coaster_rankings"),
    `Falcons Flight (Arábia Saudita)|163 m
Top Thrill 2 (EUA)|130 m
Red Force (Espanha)|112 m
Fury 325 (EUA)|99 m
Steel Dragon 2000 (Japão)|97 m
Millennium Force (EUA)|94 m (310 pés)
Tormenta Rampaging Run (EUA)|94 m (309 pés)
Leviathan (Canadá)|93 m (306 pés)
Pantherian (EUA)|93 m (305 pés)
Orion (EUA)|87 m`,
  ),
  tp2(
    "games-psp",
    "Games",
    "Quais são os 10 jogos mais vendidos do PSP?",
    "Unidades vendidas no mundo (Wikipédia; lista com números de fontes variadas)",
    "Três jogos de Monster Hunter estão no top 10. Metal Gear Solid: Peace Walker ficou em 11º.",
    enwiki(
      "Best-selling PlayStation Portable games",
      "List_of_best-selling_PlayStation_Portable_video_games",
    ),
    `GTA: Liberty City Stories|7,5 milhões
Monster Hunter Portable 3rd|4,9 milhões
Gran Turismo|4,67 milhões
Ratchet & Clank: Size Matters|4,4 milhões
Monster Hunter Freedom Unite|3,8 milhões
God of War: Chains of Olympus|3,2 milhões
Crisis Core: Final Fantasy VII|3,1 milhões
Monster Hunter Freedom 2|2,4 milhões
Daxter|2,3 milhões
Tekken: Dark Resurrection|2,2 milhões`,
  ),
  tp2(
    "br-paralimpiadas-edicoes",
    "Esportes e recordes",
    "Em quais 10 edições das Paralimpíadas de Verão o Brasil ganhou mais medalhas?",
    "Total de medalhas do Brasil por edição, de 1972 a Paris 2024 (Wikipédia)",
    "Tóquio 2020 e Rio 2016 empatam com 72; Tóquio fica na frente pelos ouros (22 contra 14). Barcelona-Madri 1992 ficou em 11º, com 12.",
    enwiki("Brazil at the Paralympics", "Brazil_at_the_Paralympics"),
    `Paris 2024|88 medalhas (25 ouros)
Tóquio 2020|72 medalhas (22 ouros)
Rio 2016|72 medalhas (14 ouros)
Pequim 2008|47 medalhas (16 ouros)
Londres 2012|43 medalhas (21 ouros)
Atenas 2004|33 medalhas (14 ouros)
Stoke Mandeville/Nova York 1984|28 medalhas (7 ouros)
Seul 1988|27 medalhas (4 ouros)
Sydney 2000|22 medalhas (6 ouros)
Atlanta 1996|21 medalhas (2 ouros)`,
  ),
];
