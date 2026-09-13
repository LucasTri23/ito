export type PartyMode = "everyone" | "admin";
export interface PartySource {
  label: string;
  url: string;
}
interface Topic {
  id: string;
  category: string;
  question: string;
  scope: string;
  note: string;
  sources: PartySource[];
  checkedAt: string;
}
export interface NumberTopic extends Topic {
  kind: "number";
  answer: string;
}
export interface RankingTopic extends Topic {
  kind: "ranking";
  items: { name: string; value: string }[];
}
export type PartyTopic = NumberTopic | RankingTopic;
const checkedAt = "13/09/2026";
const earth = {
  label: "NASA · Terra",
  url: "https://science.nasa.gov/earth/facts/",
};
const sun = { label: "NASA · Sol", url: "https://science.nasa.gov/sun/facts/" };
const moon = {
  label: "NASA · Lua",
  url: "https://science.nasa.gov/moon/facts/",
};
function number(
  id: string,
  category: string,
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
export const numberTopics: NumberTopic[] = [
  number(
    "corrida-dean",
    "Esportes e recordes",
    "Quantos quilômetros Dean Karnazes correu em sua jornada contínua de 2005?",
    "Cerca de 563 km",
    "Distância da façanha de 2005; responda em quilômetros.",
    "Conversão de 350 milhas. É uma façanha específica, não uma afirmação de recorde mundial sem qualquer parada.",
    {
      label: "Entrevista com Dean Karnazes",
      url: "https://weather.com/health/fitness/news/ultramarathoner-dean-karnazes-endurance-20120514",
    },
  ),
  number(
    "sangue",
    "Corpo e natureza",
    "Aproximadamente quantos litros de sangue há no corpo de um adulto?",
    "Cerca de 5 litros",
    "Estimativa para um adulto; varia conforme o tamanho do corpo.",
    "A Cruz Vermelha usa aproximadamente 10 pints americanos, equivalentes a 4,7 litros. Para a brincadeira, arredondamos para 5.",
    {
      label: "Cruz Vermelha Americana",
      url: "https://prod-www.redcrossblood.org/donate-blood/how-to-donate/common-concerns.html",
    },
  ),
  number(
    "muralha",
    "Mundo e construções",
    "Qual é a extensão total aproximada da Grande Muralha da China?",
    "Cerca de 21.196 km",
    "Somando os trechos e estruturas históricos; não apenas a muralha da dinastia Ming.",
    "O levantamento considera o conjunto de estruturas distribuídas pelo território chinês.",
    {
      label: "World Athletics · boletim de Pequim 2015",
      url: "https://worldathletics.org/download/downloadresultinfo?filename=81336224-898c-4ac2-a87c-fa84ee873b4c.pdf&urlSlug=2nd-official-bulletin-iaaf-world-championsh",
    },
  ),
  number(
    "ossos",
    "Corpo e natureza",
    "Quantos ossos tem, normalmente, o esqueleto de um adulto?",
    "206 ossos",
    "Contagem anatômica usual; há variações individuais.",
    "Vários ossos presentes na infância se unem durante o crescimento.",
    {
      label: "NIAMS · ossos",
      url: "https://www.niams.nih.gov/health-topics/educational-resources/health-lesson-learning-about-bones",
    },
  ),
  number(
    "polvo",
    "Corpo e natureza",
    "Quantos corações tem um polvo?",
    "3 corações",
    "Conte todos os corações do animal.",
    "Dois atendem às brânquias e um bombeia sangue para o restante do corpo.",
    {
      label: "Museu de História Natural de Londres",
      url: "https://www.nhm.ac.uk/discover/octopuses-keep-surprising-us-here-are-eight-examples-how.html",
    },
  ),
  number(
    "eiffel-altura",
    "Mundo e construções",
    "Qual é a altura da Torre Eiffel, incluindo a antena?",
    "330 metros",
    "Altura após a instalação da antena em 2022.",
    "A pergunta inclui a antena; não é a altura da plataforma de visitação.",
    {
      label: "Torre Eiffel · números oficiais",
      url: "https://www.toureiffel.paris/fr/le-monument/chiffres-cle",
    },
  ),
  number(
    "eiffel-degraus",
    "Mundo e construções",
    "Quantos degraus existem da base até o topo da Torre Eiffel?",
    "1.665 degraus",
    "Trajeto completo, inclusive a parte não aberta ao público.",
    "Os visitantes não podem percorrer a pé todo esse trajeto até o topo.",
    {
      label: "Torre Eiffel · escadas",
      url: "https://www.toureiffel.paris/en/faq/spot/how-can-you-walk-eiffel-tower-foot",
    },
  ),
  number(
    "burj",
    "Mundo e construções",
    "Qual é a altura arquitetônica do Burj Khalifa?",
    "828 metros",
    "Edifício em Dubai; responda em metros.",
    "Medida arquitetônica, que inclui a ponta integrada ao projeto.",
    {
      label: "CTBUH · Skyscraper Center",
      url: "https://www.skyscrapercentre.com/building/burj-khalifa/3",
    },
  ),
  number(
    "oceano",
    "Corpo e natureza",
    "Qual é a profundidade aproximada do Challenger Deep?",
    "10.935 metros",
    "Use a estimativa publicada pela NOAA, em metros.",
    "Fica na Fossa das Marianas; diferentes levantamentos podem apresentar pequenas diferenças.",
    {
      label: "NOAA · profundidade do oceano",
      url: "https://oceanservice.noaa.gov/facts/oceandepth.html",
    },
  ),
  number(
    "wadlow",
    "Esportes e recordes",
    "Quantos centímetros media Robert Wadlow, o homem mais alto registrado?",
    "272 centímetros",
    "Última altura registrada, em 1940.",
    "Isso equivale a 2,72 metros.",
    {
      label: "Guinness World Records",
      url: "https://www.guinnessworldrecords.com/world-records/tallest-man-ever",
    },
  ),
  number(
    "maratona",
    "Esportes e recordes",
    "Quantos quilômetros tem uma maratona oficial?",
    "42,195 km",
    "Distância completa da prova, com três casas decimais.",
    "Equivale a 42 quilômetros e 195 metros.",
    {
      label: "Atletismo Sul-Americano · história da maratona",
      url: "https://atletismosudamericano.org/maraton/en/the-distance/",
    },
  ),
  number(
    "cinquenta-maratonas",
    "Esportes e recordes",
    "Em quantos dias consecutivos Karnazes completou 50 maratonas nos 50 estados americanos?",
    "50 dias",
    "Desafio de uma maratona em cada estado.",
    "A façanha aparece na biografia oficial do corredor.",
    {
      label: "Dean Karnazes · biografia",
      url: "https://ultramarathonman.com/about",
    },
  ),
  number(
    "luis-xiv",
    "Esportes e recordes",
    "Quantos anos completos durou o reinado de Luís XIV?",
    "72 anos",
    "Conte apenas anos completos.",
    "A duração total foi de 72 anos e 110 dias, de 1643 a 1715.",
    {
      label: "Guinness · duração de reinados",
      url: "https://www.guinnessworldrecords.com/records/hall-of-fame/queen-elizabeth-II-longest-reigning-queen",
    },
  ),
  number(
    "terra-diametro",
    "Espaço",
    "Qual é o diâmetro equatorial aproximado da Terra?",
    "12.756 km",
    "Diâmetro no equador, não circunferência.",
    "A Terra é ligeiramente achatada nos polos.",
    earth,
  ),
  number(
    "terra-sol",
    "Espaço",
    "Qual é a distância média aproximada da Terra ao Sol?",
    "150 milhões de km",
    "Distância média, arredondada.",
    "A distância varia durante a órbita.",
    earth,
  ),
  number(
    "luz-sol",
    "Espaço",
    "Aproximadamente quantos minutos a luz do Sol leva para chegar à Terra?",
    "8 minutos",
    "Resposta em minutos inteiros.",
    "É um valor arredondado para a distância média.",
    earth,
  ),
  number(
    "terra-ano",
    "Espaço",
    "Em aproximadamente quantos dias a Terra completa uma volta ao redor do Sol?",
    "365,25 dias",
    "Use duas casas decimais.",
    "O valor é aproximado; um ano do calendário comum tem 365 dias.",
    earth,
  ),
  number(
    "lua-distancia",
    "Espaço",
    "Qual é a distância média entre a Terra e a Lua?",
    "384.400 km",
    "Distância média entre os centros, em quilômetros.",
    "A órbita lunar não é um círculo perfeito.",
    earth,
  ),
  number(
    "rochas-lua",
    "Espaço",
    "Quantos quilos de rochas e solo lunar as missões Apollo trouxeram à Terra?",
    "382 kg",
    "Total aproximado das missões Apollo.",
    "Amostras desse material continuam sendo estudadas.",
    moon,
  ),
  number(
    "sol-temperatura",
    "Espaço",
    "Qual é a temperatura aproximada do núcleo do Sol?",
    "15 milhões de °C",
    "Núcleo, não superfície.",
    "É a região onde ocorre a fusão nuclear.",
    sun,
  ),
  number(
    "sol-superficie",
    "Espaço",
    "Qual é a temperatura aproximada da fotosfera do Sol?",
    "5.500 °C",
    "Fotosfera: a camada que vemos como superfície.",
    "Essa camada é muito menos quente que o núcleo.",
    sun,
  ),
  number(
    "sol-volume",
    "Espaço",
    "Quantas Terras equivalem aproximadamente ao volume do Sol?",
    "1,3 milhão",
    "Comparação de volumes, não de massas.",
    "Imagine somar volumes terrestres até atingir o volume solar.",
    sun,
  ),
  number(
    "sol-orbita",
    "Espaço",
    "Quantos anos o Sol leva aproximadamente para dar uma volta na Via Láctea?",
    "230 milhões de anos",
    "Uma órbita em torno do centro galáctico.",
    "O Sistema Solar acompanha esse movimento.",
    sun,
  ),
  number(
    "sol-diametro",
    "Espaço",
    "Qual é o diâmetro aproximado do Sol?",
    "1,4 milhão de km",
    "Responda em quilômetros.",
    "O diâmetro é o dobro do raio aproximado de 700 mil quilômetros.",
    sun,
  ),
];

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
    items: rows.split("\n").map((row) => {
      const [name, value] = row.split("|");
      return { name, value };
    }),
  };
}
const netflixNote =
  "Cada temporada ou parte conta separadamente. Visualizações = horas assistidas divididas pela duração; não são pessoas únicas. Retrato da lista consultada, sem atualização automática.";
const cinemaNote =
  "Bilheteria nominal acumulada, sem correção pela inflação. O ranking inclui relançamentos contabilizados pela fonte e pode mudar.";
const ssa = {
  label: "Social Security Administration",
  url: "https://www.ssa.gov/oact/babynames/decades/century.html",
};
const ibge = {
  label: "IBGE · Censo 2010",
  url: "https://www.ibge.gov.br/en/component/content/article/2185-news-agency/releases-en/10446-brazil-of-marias-and-joses-ibge-releases-name-database-based-on-2010-population-census.html?Itemid=6702&lang=en-GB",
};
export const rankingTopics: RankingTopic[] = [
  ranking(
    "nomes-brasil-2010",
    "Nomes",
    "Quais eram os 10 primeiros nomes mais comuns no Brasil no Censo 2010?",
    "Brasil · todos os sexos · população recenseada em 2010",
    "Rodada histórica, não ranking atual. Só o primeiro nome; grafias diferentes são separadas.",
    ibge,
    `Maria|11.734.129
José|5.754.529
Ana|3.089.858
João|2.984.119
Antônio|2.576.348
Francisco|1.772.197
Carlos|1.489.191
Paulo|1.423.262
Pedro|1.219.605
Lucas|1.127.310`,
  ),
  ranking(
    "nomes-brasil-femininos-2010",
    "Nomes",
    "Quais eram os 10 nomes femininos mais comuns no Brasil no Censo 2010?",
    "Brasil · população feminina recenseada em 2010",
    "Recorte histórico por sexo registrado no Censo. Só o primeiro nome.",
    ibge,
    `Maria|11.694.738
Ana|3.079.729
Francisca|721.637
Antônia|588.783
Adriana|565.621
Juliana|562.589
Márcia|551.855
Fernanda|531.607
Patrícia|529.446
Aline|509.869`,
  ),
  ranking(
    "nomes-brasil-masculinos-2010",
    "Nomes",
    "Quais eram os 10 nomes masculinos mais comuns no Brasil no Censo 2010?",
    "Brasil · população masculina recenseada em 2010",
    "Recorte histórico por sexo registrado no Censo. Só o primeiro nome.",
    ibge,
    `José|5.732.508
João|2.971.935
Antônio|2.567.494
Francisco|1.765.197
Carlos|1.483.121
Paulo|1.417.907
Pedro|1.213.557
Lucas|1.116.818
Luiz|1.102.927
Marcos|1.101.126`,
  ),
  ranking(
    "netflix-series-ingles",
    "TV e streaming",
    "Quais são as 10 temporadas de séries em inglês mais vistas da Netflix?",
    "Mundo · visualizações nos primeiros 91 dias · lista consultada em 13/09/2026",
    netflixNote,
    {
      label: "Netflix Tudum",
      url: "https://www.netflix.com/tudum/top10/most-popular/tv",
    },
    `Wandinha — temporada 1|252,1 milhões
Adolescência — minissérie|142,6 milhões
Stranger Things — temporada 4|140,7 milhões
Stranger Things — temporada 5|133,8 milhões
Wandinha — temporada 2|119,3 milhões
I Will Find You — minissérie|119 milhões
Dahmer: Um Canibal Americano|115,6 milhões
Bridgerton — temporada 1|113,3 milhões
O Gambito da Rainha|112,8 milhões
Bridgerton — temporada 3|106 milhões`,
  ),
  ranking(
    "netflix-series-outros",
    "TV e streaming",
    "Quais são as 10 temporadas de séries não faladas em inglês mais vistas da Netflix?",
    "Mundo · visualizações nos primeiros 91 dias · lista consultada em 13/09/2026",
    netflixNote,
    {
      label: "Netflix Tudum",
      url: "https://www.netflix.com/tudum/top10/most-popular/tv-non-english",
    },
    `Round 6 — temporada 1|265,2 milhões
Round 6 — temporada 2|192,6 milhões
Round 6 — temporada 3|145,8 milhões
La Casa de Papel — parte 4|106 milhões
Lupin — parte 1|99,5 milhões
La Casa de Papel — parte 5|99,2 milhões
La Casa de Papel — parte 3|80 milhões
La Palma|70,3 milhões
Lupin — parte 2|68,4 milhões
Teach You a Lesson|67,2 milhões`,
  ),
  ranking(
    "netflix-filmes-ingles",
    "TV e streaming",
    "Quais são os 10 filmes em inglês mais vistos da Netflix?",
    "Mundo · visualizações nos primeiros 91 dias · lista consultada em 13/09/2026",
    "Classificação de idioma da Netflix. " + netflixNote,
    {
      label: "Netflix Tudum",
      url: "https://www.netflix.com/tudum/top10/most-popular/films",
    },
    `Guerreiras do K-Pop (KPop Demon Hunters)|325,1 milhões
Alerta Vermelho (Red Notice)|230,9 milhões
Bagagem de Risco (Carry-On)|172,1 milhões
Não Olhe para Cima|171,4 milhões
O Projeto Adam|157,6 milhões
Bird Box|157,4 milhões
De Volta à Ação|147,2 milhões
Swapped|144,9 milhões
O Mundo Depois de Nós|143,4 milhões
War Machine|139,9 milhões`,
  ),
  ranking(
    "netflix-filmes-outros",
    "TV e streaming",
    "Quais são os 10 filmes não falados em inglês mais vistos da Netflix?",
    "Mundo · visualizações nos primeiros 91 dias · lista consultada em 13/09/2026",
    "Classificação de idioma da Netflix. " + netflixNote,
    {
      label: "Netflix Tudum",
      url: "https://www.netflix.com/tudum/top10/most-popular/films-non-english",
    },
    `O Troll da Montanha (Troll)|103 milhões
Sob as Águas do Sena (Under Paris)|102,3 milhões
A Sociedade da Neve|98,5 milhões
Exterritorial|91,7 milhões
The Great Flood|86,6 milhões
Destinos à Deriva (Nowhere)|85,7 milhões
O Poço (The Platform)|82,8 milhões
Contra-Ataque (Counterattack)|66,9 milhões
Ad Vitam|63,1 milhões
Brick|61,8 milhões`,
  ),
  ranking(
    "bilheteria-mundo",
    "Cinema",
    "Quais são os 10 filmes com maior bilheteria mundial acumulada?",
    "Mundo · receita em dólares, sem inflação · 13/09/2026",
    cinemaNote,
    {
      label: "Box Office Mojo · mundial",
      url: "https://www.boxofficemojo.com/chart/top_lifetime_gross/?area=XWW",
    },
    `Avatar|US$ 2,924 bilhões
Vingadores: Ultimato|US$ 2,799 bilhões
Spider-Man: Brand New Day|US$ 2,451 bilhões
Avatar: O Caminho da Água|US$ 2,334 bilhões
Ne Zha 2|US$ 2,271 bilhões
Titanic|US$ 2,265 bilhões
Star Wars: O Despertar da Força|US$ 2,071 bilhões
Vingadores: Guerra Infinita|US$ 2,052 bilhões
Homem-Aranha: Sem Volta para Casa|US$ 1,921 bilhão
Zootopia 2|US$ 1,867 bilhão`,
  ),
  ranking(
    "bilheteria-domestica",
    "Cinema",
    "Quais são os 10 filmes com maior bilheteria nos Estados Unidos e Canadá?",
    "Mercado doméstico do Box Office Mojo · dólares, sem inflação · 13/09/2026",
    cinemaNote,
    {
      label: "Box Office Mojo · doméstico",
      url: "https://www.boxofficemojo.com/chart/top_lifetime_gross/",
    },
    `Star Wars: O Despertar da Força|US$ 936,7 milhões
Spider-Man: Brand New Day|US$ 935,2 milhões
Vingadores: Ultimato|US$ 858,4 milhões
Homem-Aranha: Sem Volta para Casa|US$ 814,9 milhões
Avatar|US$ 785,2 milhões
Top Gun: Maverick|US$ 722 milhões
Pantera Negra|US$ 700,4 milhões
Avatar: O Caminho da Água|US$ 688,5 milhões
Vingadores: Guerra Infinita|US$ 678,8 milhões
Titanic|US$ 674,4 milhões`,
  ),
  ranking(
    "steam-jogadores",
    "Games",
    "Quais eram os 10 jogos mais jogados na Steam no retrato desta rodada?",
    "Jogadores simultâneos no momento da consulta em 13/09/2026 · somente Steam",
    "Lista por jogadores naquele instante, não vendas, pico histórico ou jogadores de todas as plataformas. Os números ao vivo mudam continuamente; vale este retrato salvo.",
    {
      label: "Steam · mais jogados",
      url: "https://store.steampowered.com/charts/mostplayed",
    },
    `Counter-Strike 2|713.250 jogadores
Dota 2|535.280 jogadores
WARDOGS|371.920 jogadores
Valheim|239.988 jogadores
FiveM|171.163 jogadores
PUBG: BATTLEGROUNDS|138.885 jogadores
Bongo Cat|132.018 jogadores
Marvel Rivals|114.846 jogadores
Tom Clancy's Rainbow Six Siege|96.873 jogadores
Overwatch|94.488 jogadores`,
  ),
  ranking(
    "nomes-eua-masculinos",
    "Nomes",
    "Quais foram os 10 nomes masculinos mais frequentes nos nascimentos dos EUA em 100 anos?",
    "Nascimentos de 1926 a 2025 · registros da SSA · Estados Unidos",
    "Não é a população viva atual. Grafias diferentes contam separadamente.",
    ssa,
    `James|4.505.076
Michael|4.359.450
John|4.204.996
Robert|4.191.413
David|3.560.303
William|3.358.163
Richard|2.365.369
Joseph|2.246.662
Thomas|2.105.675
Christopher|2.063.964`,
  ),
  ranking(
    "nomes-eua-femininos",
    "Nomes",
    "Quais foram os 10 nomes femininos mais frequentes nos nascimentos dos EUA em 100 anos?",
    "Nascimentos de 1926 a 2025 · registros da SSA · Estados Unidos",
    "Não é a população viva atual. Grafias diferentes contam separadamente.",
    ssa,
    `Mary|2.845.637
Patricia|1.531.355
Jennifer|1.471.356
Linda|1.447.992
Elizabeth|1.380.056
Barbara|1.362.329
Susan|1.099.802
Jessica|1.049.169
Karen|986.098
Sarah|981.437`,
  ),
];
