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
];
