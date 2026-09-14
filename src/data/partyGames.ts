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
  number(
    "animal-girafa-pescoco",
    "Animais",
    "Quantas vértebras cervicais (do pescoço) tem uma girafa adulta?",
    "7 vértebras",
    "Conte apenas as vértebras do pescoço; vale para girafas adultas.",
    "É o mesmo número encontrado no pescoço de um ser humano — a diferença está no tamanho de cada osso, não na quantidade.",
    { label: "San Diego Zoo Animals & Plants", url: "https://animals.sandiegozoo.org/animals/giraffe" },
  ),
  number(
    "animal-chita-velocidade",
    "Animais",
    "Qual é a velocidade máxima que um chita consegue atingir em uma corrida curta?",
    "Mais de 110 km/h",
    "Velocidade de pico em disparada curta, segundo a Cheetah Conservation Fund.",
    "O chita alcança essa velocidade em pouco mais de três segundos de aceleração.",
    { label: "Cheetah Conservation Fund UK", url: "https://cheetah.org/uk/cheetahfacts/" },
  ),
  number(
    "animal-elefante-gestacao",
    "Animais",
    "Quantos meses dura, em média, a gestação de um elefante-africano?",
    "Cerca de 22 meses",
    "Média da espécie; a duração real pode variar entre 17 e 25 meses.",
    "É a gestação mais longa entre os mamíferos terrestres.",
    { label: "San Diego Zoo Wildlife Alliance · Ficha do elefante-africano", url: "https://ielc.libguides.com/sdzg/factsheets/african_elephant/reproduction" },
  ),
  number(
    "animal-elefante-dentes",
    "Animais",
    "Quantos conjuntos de dentes molares um elefante-africano chega a desenvolver ao longo da vida?",
    "6 conjuntos",
    "Contando todos os conjuntos de molares que vão substituindo os anteriores durante a vida do animal.",
    "Apenas um ou dois molares ficam em uso de cada vez em cada lado da mandíbula; o último conjunto costuma se desgastar entre os 60 e 70 anos de idade.",
    { label: "San Diego Zoo Wildlife Alliance · Ficha do elefante-africano", url: "https://ielc.libguides.com/sdzg/factsheets/african_elephant/characteristics" },
  ),
  number(
    "animal-beija-flor-coracao",
    "Animais",
    "Quantas vezes por minuto pode bater o coração de um beija-flor em pleno voo ativo?",
    "1.200 batimentos por minuto",
    "Frequência cardíaca durante voo ativo, não em repouso ou torpor.",
    "Para efeito de comparação, o coração de um pombo em voo bate cerca de 600 vezes por minuto.",
    { label: "Audubon", url: "https://www.audubon.org/news/hummingbird-hearts-beat-10-times-faster-yours" },
  ),
  number(
    "animal-galinha-incubacao",
    "Animais",
    "Quantos dias leva, em média, a incubação de um ovo de galinha até a eclosão?",
    "21 dias",
    "Incubação em condições padrão de temperatura, artificial ou natural.",
    "Um atraso na eclosão para o dia 22 ou 23 geralmente indica que a incubadora ficou um pouco fria.",
    { label: "Mississippi State University Extension Service", url: "https://extension.msstate.edu/agriculture/livestock/poultry/incubation-duration-periods" },
  ),
  number(
    "animal-baleia-azul-coracao",
    "Animais",
    "Qual foi o menor número de batimentos por minuto já registrado no coração de uma baleia-azul durante um mergulho profundo?",
    "2 batimentos por minuto",
    "Menor frequência registrada durante um mergulho de alimentação; não é a frequência na superfície.",
    "No mesmo estudo, ao voltar à superfície o coração do mesmo animal chegou a bater até 37 vezes por minuto.",
    { label: "Stanford Report", url: "https://news.stanford.edu/stories/2019/11/first-ever-recording-blue-whales-heart-rate" },
  ),
  number(
    "animal-baleia-azul-comprimento",
    "Animais",
    "Qual é o maior comprimento que uma baleia-azul da subpopulação antártica pode atingir?",
    "Cerca de 33,5 metros (110 pés)",
    "Recorde de comprimento para a subpopulação antártica, a maior da espécie.",
    "Essas mesmas baleias podem pesar mais de 150 toneladas.",
    { label: "NOAA Fisheries", url: "https://www.fisheries.noaa.gov/species/blue-whale" },
  ),
  number(
    "animal-polvo-ventosas",
    "Animais",
    "Quantas ventosas tem, ao todo, uma fêmea de polvo-gigante-do-pacífico?",
    "2.240 ventosas",
    "Soma das ventosas dos oito braços em uma fêmea adulta.",
    "Os machos têm cerca de 100 ventosas a menos, porque um dos braços é especializado na reprodução.",
    { label: "Monterey Bay Aquarium", url: "https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/giant-pacific-octopus" },
  ),
  number(
    "animal-pinguim-imperador-incubacao",
    "Animais",
    "Por quantos dias, aproximadamente, o pinguim-imperador macho incuba o ovo equilibrado sobre as próprias patas?",
    "Entre 65 e 75 dias",
    "Período em que o macho equilibra o ovo sobre as patas, sob a bolsa de choco, sem se alimentar.",
    "Durante todo esse tempo, o macho sobrevive apenas com as reservas de gordura acumuladas.",
    { label: "Australian Antarctic Program", url: "https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/breeding-cycle/" },
  ),
  number(
    "animal-canguru-gestacao",
    "Animais",
    "Quantos dias dura a gestação de um canguru-vermelho?",
    "Cerca de 33 dias",
    "Tempo entre a fecundação e o nascimento; o filhote nasce minúsculo e sobe até o bolso da mãe.",
    "Apesar da gestação curta, o desenvolvimento do filhote continua por meses dentro do bolso marsupial.",
    { label: "Australian Museum", url: "https://australian.museum/learn/animals/mammals/red-kangaroo/" },
  ),
  number(
    "animal-coala-sono",
    "Animais",
    "Quantas horas por dia um coala adulto passa dormindo ou parado, sem se mover?",
    "Cerca de 19 a 20 horas",
    "Tempo total gasto sentado ou dormindo por dia, incluindo cochilos, e não apenas o sono noturno.",
    "O pouco tempo restante é usado principalmente para se alimentar de folhas de eucalipto.",
    { label: "San Diego Zoo Wildlife Alliance · Ficha do coala", url: "https://ielc.libguides.com/sdzg/factsheets/koala/behavior" },
  ),
  number(
    "animal-gato-bigodes",
    "Animais",
    "Quantos bigodes tem um gato, ao todo, contando os dois lados do focinho?",
    "24 bigodes",
    "Contagem típica das vibrissas do focinho; não inclui os pelos táteis acima dos olhos ou nas patas.",
    "São 12 bigodes organizados em fileiras de cada lado do focinho.",
    { label: "Hill's Pet Nutrition", url: "https://www.hillspet.com/cat-care/behavior-appearance/why-do-cats-have-whiskers" },
  ),
  number(
    "animal-aranha-olhos",
    "Animais",
    "Quantos olhos tem a maioria das espécies de aranha?",
    "8 olhos",
    "Contagem típica da maioria das famílias de aranhas; algumas espécies têm seis ou menos.",
    "Apesar do número de olhos, a maioria das aranhas enxerga mal e depende mais do tato e da vibração para se orientar.",
    { label: "Australian Museum", url: "https://australian.museum/learn/animals/spiders/how-spiders-see-the-world/" },
  ),
  number(
    "animal-crocodilo-dentes",
    "Animais",
    "Quantos dentes tem, em média, um crocodilo-do-nilo adulto?",
    "Entre 64 e 68 dentes",
    "Contagem total de dentes em um exemplar adulto típico da espécie.",
    "Os dentes são perdidos e substituídos continuamente ao longo de toda a vida do animal.",
    { label: "San Diego Zoo Wildlife Alliance · Ficha do crocodilo-do-nilo", url: "https://ielc.libguides.com/sdzg/factsheets/nile_crocodile/characteristics" },
  ),
  number(
    "animal-falcao-peregrino-mergulho",
    "Animais",
    "Qual foi a maior velocidade já registrada em um mergulho de caça de um falcão-peregrino?",
    "389 km/h (242 mph)",
    "Recorde experimental medido em 1999 durante um mergulho controlado, não a velocidade típica de voo horizontal.",
    "O falcão que bateu o recorde se chamava Frightful e mergulhou a partir de vários quilômetros de altitude.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/70929-fastest-bird-diving" },
  ),
  number(
    "animal-jonathan-tartaruga",
    "Animais",
    "Em que ano se estima que Jonathan, a tartaruga-gigante-de-Seicheles considerada o animal terrestre vivo mais velho, tenha nascido?",
    "Por volta de 1832",
    "Ano estimado de nascimento, já que não existe um registro exato da data.",
    "Jonathan vive na ilha de Santa Helena e já era considerado adulto quando chegou lá, em 1882.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/511806-oldest-living-land-animal" },
  ),
  number(
    "animal-panda-bambu",
    "Animais",
    "Quantos quilos de bambu um panda-gigante recebe, em média, por dia no Zoológico Nacional dos Estados Unidos?",
    "Cerca de 45 kg (95 libras)",
    "Quantidade oferecida por dia a cada panda adulto; o animal nem sempre come tudo, pois é seletivo.",
    "Mesmo com essa quantidade disponível, os pandas costumam comer principalmente as partes mais nutritivas da planta.",
    { label: "Smithsonian's National Zoo", url: "https://nationalzoo.si.edu/animals/news/keep-national-zoos-pandas-satisfied-staff-prepare-endless-supply-bamboo" },
  ),
  number(
    "animal-lontra-pelos",
    "Animais",
    "Quantos pelos por polegada quadrada pode ter a pelagem de uma lontra-marinha, no ponto mais denso do corpo?",
    "Até 1 milhão de pelos",
    "Densidade máxima de pelos por polegada quadrada de pele, a mais alta entre todos os animais conhecidos.",
    "Diferentemente de outros mamíferos marinhos, a lontra-marinha não tem uma camada espessa de gordura e depende da pelagem para se manter aquecida.",
    { label: "Seattle Aquarium", url: "https://www.seattleaquarium.org/stories/the-densest-fur-of-any-animal-on-earth-all-about-sea-otters/" },
  ),
  number(
    "animal-toupeira-nariz",
    "Animais",
    "Quantos apêndices carnudos formam o nariz em forma de estrela da toupeira-nariz-de-estrela?",
    "22 apêndices",
    "Contagem total dos pequenos tentáculos (rays) ao redor do focinho do animal.",
    "Esses apêndices são cobertos por milhares de órgãos sensoriais e tornam o nariz mais sensível ao tato do que a mão humana.",
    { label: "Smithsonian Magazine", url: "https://www.smithsonianmag.com/smart-news/watch-how-fast-the-insane-snout-of-the-star-nosed-mole-can-move-13863378/" },
  ),
  number(
    "animal-vaca-estomagos",
    "Animais",
    "Em quantos compartimentos é dividido o estômago de uma vaca?",
    "4 compartimentos",
    "Conte rúmen, retículo, omaso e abomaso como compartimentos de um único estômago.",
    "Por causa disso, é comum (mas tecnicamente incorreto) dizer que a vaca tem quatro estômagos.",
    { label: "Merck Veterinary Manual", url: "https://www.merckvetmanual.com/management-and-nutrition/nutrition-beef-cattle/the-digestive-system-of-beef-cattle" },
  ),
  number(
    "animal-avestruz-ovo",
    "Animais",
    "Quanto pesa, aproximadamente, um ovo de avestruz?",
    "Cerca de 1,5 kg (3 libras)",
    "Peso médio de um único ovo; é o maior ovo entre as aves atuais.",
    "Apesar de ser o maior ovo do mundo das aves, é proporcionalmente um dos menores em relação ao tamanho do corpo da mãe.",
    { label: "San Diego Zoo Animals & Plants", url: "https://animals.sandiegozoo.org/animals/ostrich" },
  ),
  number(
    "animal-camaleao-visao",
    "Animais",
    "Quantos graus de visão ao redor do corpo um camaleão consegue enxergar, combinando a rotação independente dos dois olhos?",
    "360 graus",
    "Campo de visão total obtido pela soma da rotação independente dos dois olhos do animal.",
    "Cada olho do camaleão pode girar e focar separadamente, permitindo observar dois objetos diferentes ao mesmo tempo.",
    { label: "San Diego Zoo Animals & Plants", url: "https://animals.sandiegozoo.org/animals/chameleon" },
  ),
  number(
    "geo-nilo-comprimento",
    "Geografia",
    "Quantos quilômetros de comprimento tem o rio Nilo, da nascente até a foz?",
    "Cerca de 6.695 km",
    "Medida da NASA do curso principal, do alto planalto africano até o mar Mediterrâneo.",
    "É tradicionalmente citado como o rio mais longo do mundo, embora o Amazonas dispute esse título.",
    { label: "NASA Science · Quest for the Source of the Nile", url: "https://science.nasa.gov/earth/earth-observatory/quest-for-the-source-of-the-nile-7236/" },
  ),
  number(
    "geo-amazonas-comprimento",
    "Geografia",
    "Quantos quilômetros de comprimento tem o rio Amazonas, segundo a medição do U.S. Geological Survey?",
    "Cerca de 6.437 km",
    "Medição oficial do USGS citada pela National Geographic; a definição exata da nascente ainda é debatida.",
    "Alguns estudos recentes propõem uma nascente mais distante, o que tornaria o rio ainda mais longo.",
    { label: "National Geographic · Where Does the Amazon River Begin?", url: "https://www.nationalgeographic.com/adventure/article/140213-amazon-river-length-source-maps-science" },
  ),
  number(
    "geo-everest-altitude",
    "Geografia",
    "Qual é a altitude oficial do Monte Everest, segundo o levantamento conjunto anunciado por Nepal e China em 2020?",
    "8.848,86 metros",
    "Novo valor oficial acordado por Nepal e China em dezembro de 2020, encerrando décadas de divergência.",
    "A medição usou GPS e trigonometria, com equipes nepalesas chegando ao cume em 2019 e chinesas em 2020.",
    { label: "The Kathmandu Post · Everest height announcement", url: "https://kathmandupost.com/national/2020/12/08/it-s-official-mount-everest-is-8-848-86-metres-tall" },
  ),
  number(
    "geo-k2-altitude",
    "Geografia",
    "Qual é a altitude do K2, o segundo pico mais alto do mundo?",
    "8.611 metros",
    "Altitude oficial do cume, localizado na cordilheira do Caracórum, entre Paquistão e China.",
    "Fica logo atrás do Everest, mas é considerado tecnicamente mais difícil de escalar.",
    { label: "Encyclopaedia Britannica · K2", url: "https://www.britannica.com/place/K2" },
  ),
  number(
    "geo-baikal-profundidade",
    "Geografia",
    "Qual é a profundidade máxima do Lago Baikal, na Sibéria?",
    "1.642 metros",
    "Ponto mais profundo já registrado no lago, medido a partir da superfície da água.",
    "É o lago mais profundo do planeta e também o maior reservatório de água doce líquida em volume.",
    { label: "Encyclopaedia Britannica · Lake Baikal", url: "https://www.britannica.com/place/Lake-Baikal" },
  ),
  number(
    "geo-caspio-area",
    "Geografia",
    "Qual é a área de superfície do Mar Cáspio, o maior corpo de água interior do mundo?",
    "Cerca de 371.000 km²",
    "Área medida por satélite; a superfície vem encolhendo nas últimas décadas.",
    "É classificado como o maior lago do mundo, apesar do nome 'mar'.",
    { label: "NASA Earth Observatory · The Caspian Sea's Shrinking Coastline", url: "https://science.nasa.gov/earth/earth-observatory/the-caspian-seas-shrinking-coastline/" },
  ),
  number(
    "geo-groenlandia-area",
    "Geografia",
    "Qual é a área total da Groenlândia, a maior ilha do mundo?",
    "2.166.086 km²",
    "Área total do território, incluindo a calota de gelo que cobre a maior parte da superfície.",
    "Cerca de 1,71 milhão de km² desse total é permanentemente coberto por gelo.",
    { label: "The World Factbook · Greenland", url: "https://theworldfactbook.org/country/greenland.html" },
  ),
  number(
    "geo-saara-area",
    "Geografia",
    "Qual é a área aproximada do Deserto do Saara, o maior deserto quente do mundo?",
    "Cerca de 9,4 milhões de km²",
    "Estimativa da área total do deserto, que cobre grande parte do norte da África.",
    "É quase do tamanho dos Estados Unidos e continua se expandindo lentamente.",
    { label: "National Geographic Education · Deserts", url: "https://education.nationalgeographic.org/resource/deserts/" },
  ),
  number(
    "geo-russia-area",
    "Geografia",
    "Qual é a área total da Rússia, o maior país do mundo?",
    "17.098.242 km²",
    "Área total do território russo, somando terra e água.",
    "O país é tão extenso que abrange 11 fusos horários diferentes.",
    { label: "The World Factbook · Russia", url: "https://theworldfactbook.org/country/russia.html" },
  ),
  number(
    "geo-vaticano-area",
    "Geografia",
    "Qual é a área total do Vaticano, o menor país do mundo?",
    "0,44 km²",
    "Área do território dentro dos muros, todo ele classificado como área terrestre.",
    "É um enclave completamente cercado pela cidade de Roma, na Itália.",
    { label: "The World Factbook · Holy See (Vatican City)", url: "https://theworldfactbook.org/country/holy-see-vatican-city.html" },
  ),
  number(
    "geo-kilimanjaro-altitude",
    "Geografia",
    "Qual é a altitude do Monte Kilimanjaro, o ponto mais alto da África?",
    "5.895 metros",
    "Altitude do pico Uhuru, o ponto culminante do vulcão na Tanzânia.",
    "É o vulcão independente mais alto do mundo, não fazendo parte de nenhuma cordilheira.",
    { label: "National Geographic Education · Kilimanjaro", url: "https://education.nationalgeographic.org/resource/kilimanjaro/" },
  ),
  number(
    "geo-volga-comprimento",
    "Geografia",
    "Quantos quilômetros de comprimento tem o rio Volga, o maior rio da Europa?",
    "3.530 km",
    "Comprimento do curso principal, da nascente no noroeste da Rússia até o Mar Cáspio.",
    "Toda a sua bacia hidrográfica está contida dentro do território russo.",
    { label: "Encyclopaedia Britannica · Volga River", url: "https://www.britannica.com/place/Volga-River" },
  ),
  number(
    "geo-africa-paises",
    "Geografia",
    "Quantos países africanos são Estados-membros da ONU?",
    "54 países",
    "Contagem oficial do Grupo Africano na Organização das Nações Unidas.",
    "É o maior grupo regional da ONU, representando mais de um quarto de todos os membros.",
    { label: "United Nations · Ask a Librarian (Ask DAG)", url: "https://ask.un.org/faq/22882" },
  ),
  number(
    "geo-vitoria-area",
    "Geografia",
    "Qual é a área do Lago Vitória, o maior lago da África?",
    "69.484 km²",
    "Área de superfície do lago, compartilhado entre Uganda, Quênia e Tanzânia.",
    "É também o maior lago tropical do mundo e a principal fonte do rio Nilo Branco.",
    { label: "Encyclopaedia Britannica · Lake Victoria", url: "https://www.britannica.com/place/Lake-Victoria" },
  ),
  number(
    "geo-grandcanyon-profundidade",
    "Geografia",
    "Qual é a profundidade máxima do Grand Canyon, do topo até o rio Colorado?",
    "Cerca de 1.829 metros (6.000 pés)",
    "Profundidade no ponto mais fundo do cânion, do platô até a margem do rio.",
    "Perto da vila do parque, na margem sul, essa distância cai para cerca de 1.524 metros.",
    { label: "National Park Service · Grand Canyon FAQs", url: "https://www.nps.gov/grca/faqs.htm" },
  ),
  number(
    "geo-amazonia-area",
    "Geografia",
    "Qual é a área aproximada ocupada pela Floresta Amazônica?",
    "Cerca de 7 milhões de km²",
    "Área total do bioma amazônico, espalhado por nove países da América do Sul.",
    "É quase 29 vezes maior que o Reino Unido e o dobro do tamanho da Índia.",
    { label: "WWF UK · The Amazon", url: "https://www.wwf.org.uk/learn/places/amazon" },
  ),
  number(
    "geo-eua-canada-fronteira",
    "Geografia",
    "Quantos quilômetros tem a fronteira entre Estados Unidos e Canadá, a mais longa fronteira internacional do mundo?",
    "8.891 km",
    "Extensão total oficial, do Oceano Atlântico ao Pacífico, somando o trecho contíguo e o do Alasca.",
    "É mantida por um tratado internacional e demarcada por centenas de mapas oficiais.",
    { label: "International Boundary Commission · The Boundary", url: "https://www.internationalboundarycommission.org/en/about/the-boundary.php" },
  ),
  number(
    "geo-denali-altitude",
    "Geografia",
    "Qual é a altitude oficial do Monte Denali, o ponto mais alto da América do Norte?",
    "6.190 metros (20.310 pés)",
    "Novo valor oficial medido pelo USGS em 2015, usando GPS de alta precisão.",
    "O valor substituiu a medição anterior, de 1950, que era 10 pés mais alta.",
    { label: "USGS · New Elevation for Nation's Highest Peak", url: "https://www.usgs.gov/news/national-news-release/new-elevation-nations-highest-peak" },
  ),
  number(
    "geo-aconcagua-altitude",
    "Geografia",
    "Qual é a altitude do Aconcágua, o pico mais alto das Américas?",
    "6.959 metros",
    "Altitude oficial documentada pelo Instituto Geográfico Militar da Argentina.",
    "Fica na cordilheira dos Andes, na província argentina de Mendoza, perto do Chile.",
    { label: "Encyclopaedia Britannica · Mount Aconcagua", url: "https://www.britannica.com/place/Mount-Aconcagua" },
  ),
  number(
    "geo-marmorto-altitude",
    "Geografia",
    "Aproximadamente quantos metros abaixo do nível do mar está a superfície do Mar Morto, o ponto mais baixo da superfície terrestre?",
    "Mais de 400 metros abaixo do nível do mar",
    "Nível da superfície da água, que continua caindo por causa do desvio de rios afluentes para irrigação.",
    "É o ponto mais baixo em terra firme do planeta, e sua água é extremamente salgada.",
    { label: "USGS EROS · Dead Sea, Israel, Jordan, West Bank", url: "https://eros.usgs.gov/earthshots/dead-sea-israel-jordan-west-bank" },
  ),
  number(
    "geo-indonesia-ilhas",
    "Geografia",
    "Quantas ilhas oficialmente registradas compõem a Indonésia, segundo o órgão geoespacial do país em 2024?",
    "17.380 ilhas",
    "Contagem oficial de ilhas nomeadas e com coordenadas verificadas pela agência geoespacial indonésia.",
    "O número cresce a cada novo levantamento, à medida que mais ilhas são mapeadas e registradas.",
    { label: "Badan Informasi Geospasial · SI Pulau", url: "https://sipulau.big.go.id/news/11" },
  ),
  number(
    "geo-yangtze-comprimento",
    "Geografia",
    "Quantos quilômetros de comprimento tem o rio Yangtzé, o rio mais longo da Ásia?",
    "6.300 km",
    "Comprimento do curso principal, do planalto tibetano até o Mar da China Oriental.",
    "É o terceiro rio mais longo do mundo e corta a China inteira de oeste a leste.",
    { label: "Encyclopaedia Britannica · Yangtze River", url: "https://www.britannica.com/place/Yangtze-River" },
  ),
  number(
    "geo-superior-profundidade",
    "Geografia",
    "Qual é a profundidade máxima do Lago Superior, o maior dos Grandes Lagos norte-americanos?",
    "406 metros",
    "Ponto mais profundo já registrado no lago, medido a partir da superfície.",
    "É o maior lago de água doce do mundo em área de superfície.",
    { label: "NOAA · Lake Superior (National Marine Ecosystem Status)", url: "https://ecowatch.noaa.gov/regions/great-lakes/lake-superior" },
  ),
  number(
    "hist-guerra-cem-anos",
    "História",
    "Quantos anos durou a Guerra dos Cem Anos entre Inglaterra e França?",
    "116 anos",
    "Conte do início ao fim do conflito, de 1337 a 1453, mesmo com as longas tréguas pelo caminho.",
    "Apesar do nome, o conflito intermitente durou 116 anos, de 1337 a 1453, com tréguas e dois tratados de paz interrompendo os combates.",
    { label: "World History Encyclopedia · Guerra dos Cem Anos", url: "https://www.worldhistory.org/Hundred_Years'_War/" },
  ),
  number(
    "hist-piramide-gize",
    "História",
    "Segundo as estimativas históricas mais aceitas, quantos anos levou a construção da Grande Pirâmide de Gizé?",
    "Cerca de 20 anos",
    "Considere a estimativa para o reinado do faraó Quéops, quando a pirâmide foi erguida.",
    "A construção é datada do reinado de Quéops (2589–2566 a.C.), da 4ª dinastia, ao longo de aproximadamente duas décadas.",
    { label: "World History Encyclopedia · Grande Pirâmide de Gizé", url: "https://www.worldhistory.org/Great_Pyramid_of_Giza/" },
  ),
  number(
    "hist-notre-dame",
    "História",
    "Quantos anos durou a construção original da Catedral de Notre-Dame de Paris?",
    "Cerca de 182 anos",
    "Conte do início das obras em 1163 até a conclusão da estrutura principal em 1345.",
    "As obras começaram em 1163, sob o reinado de Luís VII, e a catedral ficou majoritariamente concluída em 1345.",
    { label: "Friends of Notre-Dame de Paris", url: "https://www.friendsofnotredamedeparis.org/notre-dame-cathedral/" },
  ),
  number(
    "hist-termopilas",
    "História",
    "Quantos soldados espartanos Leônidas liderou na Batalha das Termópilas?",
    "300 espartanos",
    "Conte apenas os hoplitas espartanos do destacamento de Leônidas, não o total do exército grego aliado.",
    "Os 300 hoplitas espartanos formavam apenas uma pequena parte da força grega reunida para deter o exército persa no desfiladeiro.",
    { label: "World History Encyclopedia · Batalha das Termópilas", url: "https://www.worldhistory.org/Battle_of_Thermopylae/" },
  ),
  number(
    "hist-dinastia-ming",
    "História",
    "Quantos anos durou a dinastia Ming na China?",
    "276 anos",
    "Conte de 1368, quando Zhu Yuanzhang se proclamou imperador, até a queda da dinastia em 1644.",
    "A dinastia Ming governou a China de 1368 a 1644, quando um exército rebelde tomou Pequim, abrindo caminho para a dinastia Qing.",
    { label: "World History Encyclopedia · Dinastia Ming", url: "https://www.worldhistory.org/Ming_Dynasty/" },
  ),
  number(
    "hist-magalhaes-sobreviventes",
    "História",
    "Quantos tripulantes sobreviveram e completaram a primeira volta ao mundo na expedição de Magalhães?",
    "18 sobreviventes",
    "Conte apenas os que retornaram à Espanha a bordo do navio Victoria, em 1522.",
    "Dos cerca de 240 homens que partiram em 1519 com cinco navios, apenas 18 voltaram à Espanha em setembro de 1522, sob o comando de Elcano.",
    { label: "National Geographic · expedição de Magalhães", url: "https://www.nationalgeographic.com/history/history-magazine/article/240-men-started-magellan-voyage-around-world-only-18-finished-it" },
  ),
  number(
    "hist-eiffel-construcao",
    "História",
    "Quanto tempo levou a construção da Torre Eiffel, do início das obras à inauguração?",
    "2 anos, 2 meses e 5 dias",
    "Conte da escavação das fundações, em janeiro de 1887, até a conclusão, em março de 1889.",
    "A obra foi finalizada em 31 de março de 1889, um prazo recorde para a época graças ao sistema de peças pré-fabricadas.",
    { label: "Tour Eiffel · site oficial", url: "https://www.toureiffel.paris/en/news/history-and-culture/133-years-and-1083-feet" },
  ),
  number(
    "hist-ramses-reinado",
    "História",
    "Quantos anos durou o reinado do faraó Ramsés II no Egito Antigo?",
    "66 anos",
    "Conte anos completos de reinado, entre a ascensão ao trono e a morte.",
    "Ramsés II reinou de 1279 a 1213 a.C., um dos mais longos da história do Egito Antigo.",
    { label: "World History Encyclopedia · Ramsés II", url: "https://www.worldhistory.org/Ramesses_II/" },
  ),
  number(
    "hist-peloponeso",
    "História",
    "Quantos anos durou a fase final e decisiva da Guerra do Peloponeso, entre Atenas e Esparta?",
    "27 anos",
    "Considere apenas o conflito de 431 a 404 a.C., não a fase anterior, das décadas de 460-446 a.C.",
    "Essa fase da guerra, vencida por Esparta, se estendeu de 431 a 404 a.C., pontuada por tréguas ao longo do caminho.",
    { label: "World History Encyclopedia · Guerra do Peloponeso", url: "https://www.worldhistory.org/Peloponnesian_War/" },
  ),
  number(
    "hist-sao-pedro-construcao",
    "História",
    "Quantos anos levou a construção da atual Basílica de São Pedro, no Vaticano?",
    "120 anos",
    "Conte do início das obras, em 1506, até a conclusão, em 1626.",
    "A construção substituiu a antiga basílica do século IV e envolveu arquitetos como Bramante, Rafael e Michelangelo.",
    { label: "Basílica de São Pedro · site oficial do Vaticano", url: "https://www.basilicasanpietro.va/en/faq/when-was-st-peters-basilica-built" },
  ),
  number(
    "hist-colombo-viagens",
    "História",
    "Quantas viagens Cristóvão Colombo fez ao continente americano?",
    "4 viagens",
    "Conte as travessias do Atlântico feitas por Colombo entre 1492 e 1504.",
    "As quatro viagens ocorreram em 1492-93, 1493-96, 1498-1500 e 1502-04, explorando o Caribe e a América Central.",
    { label: "World History Encyclopedia · Cristóvão Colombo", url: "https://www.worldhistory.org/Christopher_Columbus/" },
  ),
  number(
    "hist-vitoria-reinado",
    "História",
    "Quantos anos durou o reinado da Rainha Vitória do Reino Unido?",
    "63 anos",
    "Conte apenas anos completos de reinado, entre 1837 e 1901.",
    "Vitória reinou por 63 anos e 216 dias, recorde britânico só superado por Elizabeth II em 2015.",
    { label: "Guinness World Records · reinados mais longos", url: "https://www.guinnessworldrecords.com/records/hall-of-fame/queen-elizabeth-II-longest-reigning-queen" },
  ),
  number(
    "hist-armada-espanhola",
    "História",
    "Quantos navios compunham a Armada Espanhola enviada contra a Inglaterra em 1588?",
    "132 navios",
    "Conte a frota reunida por Felipe II para a tentativa de invasão.",
    "A Armada partiu rumo ao Canal da Mancha, mas foi derrotada pela frota inglesa e por tempestades no caminho de volta.",
    { label: "World History Encyclopedia · Armada Espanhola", url: "https://www.worldhistory.org/Spanish_Armada/" },
  ),
  number(
    "hist-alexandre-reinado",
    "História",
    "Quantos anos Alexandre, o Grande, reinou como rei da Macedônia?",
    "13 anos",
    "Conte da ascensão ao trono, em 336 a.C., até sua morte, em 323 a.C.",
    "Em pouco mais de uma década no trono, Alexandre construiu um dos maiores impérios da Antiguidade.",
    { label: "World History Encyclopedia · Alexandre, o Grande", url: "https://www.worldhistory.org/Alexander_the_Great/" },
  ),
  number(
    "hist-lewis-clark",
    "História",
    "Aproximadamente quantos dias durou a expedição de Lewis e Clark, da partida ao retorno?",
    "Cerca de 862 dias",
    "Conte de 14 de maio de 1804 (partida) a 23 de setembro de 1806 (retorno a St. Louis).",
    "São pouco mais de dois anos e quatro meses de viagem, atravessando o território dos Estados Unidos até o Oceano Pacífico e voltando.",
    { label: "World History Encyclopedia · Expedição de Lewis e Clark", url: "https://www.worldhistory.org/Lewis_and_Clark_Expedition/" },
  ),
  number(
    "hist-henrique-viii-esposas",
    "História",
    "Quantas esposas teve o rei Henrique VIII da Inglaterra?",
    "6 esposas",
    "Conte todos os casamentos oficiais do rei, incluindo os anulados.",
    "Catarina de Aragão, Ana Bolena, Joana Seymour, Ana de Cleves, Catarina Howard e Catarina Parr formam a famosa lista das seis rainhas.",
    { label: "Historic Royal Palaces · as seis esposas de Henrique VIII", url: "https://www.hrp.org.uk/hampton-court-palace/history-and-stories/henry-viii-s-wives-six-queens-six-women/" },
  ),
  number(
    "hist-wright-voo",
    "História",
    "Quantos segundos durou o primeiro voo motorizado dos irmãos Wright, em 1903?",
    "12 segundos",
    "Conte apenas o primeiro dos quatro voos feitos naquele dia em Kitty Hawk.",
    "Orville pilotou esse primeiro voo, percorrendo cerca de 36 metros; já o último voo do dia, com Wilbur, durou 59 segundos.",
    { label: "Smithsonian · National Air and Space Museum", url: "https://airandspace.si.edu/stories/editorial/wright-brothers-made-history-kitty-hawk" },
  ),
  number(
    "hist-napoleao-exilio",
    "História",
    "Quantos anos completos Napoleão Bonaparte passou exilado na ilha de Santa Helena, até sua morte?",
    "5 anos",
    "Conte apenas anos completos entre o desembarque na ilha e a morte, sem arredondar os meses excedentes.",
    "Napoleão chegou a Santa Helena em outubro de 1815 e morreu em maio de 1821 — pouco mais de 5 anos e meio depois.",
    { label: "World History Encyclopedia · Napoleão Bonaparte", url: "https://www.worldhistory.org/Napoleon_Bonaparte/" },
  ),
  number(
    "hist-tokugawa",
    "História",
    "Quantos anos durou o Xogunato Tokugawa no Japão?",
    "265 anos",
    "Conte de 1603, quando Ieyasu foi nomeado xogum, até a queda do xogunato em 1868.",
    "Esse período também é conhecido como era Edo, encerrado com a Restauração Meiji.",
    { label: "Japan Guide · período Edo", url: "https://www.japan-guide.com/e/e2128.html" },
  ),
  number(
    "hist-marco-polo",
    "História",
    "Quantos anos durou, ao todo, a viagem de Marco Polo de Veneza até a China e de volta?",
    "24 anos",
    "Conte da partida de Veneza, em 1271, até o retorno, em 1295.",
    "Ao voltar, Marco Polo e seus parentes tiveram dificuldade até para convencer os próprios vizinhos de quem eram, de tanto tempo fora.",
    { label: "World History Encyclopedia · Marco Polo", url: "https://www.worldhistory.org/Marco_Polo/" },
  ),
  number(
    "hist-galileu-prisao",
    "História",
    "Por quantos anos, aproximadamente, Galileu Galilei viveu sob prisão domiciliar até sua morte?",
    "Cerca de 9 anos",
    "Conte a partir da sentença do Santo Ofício, em 1633, até a morte de Galileu, em 1642.",
    "Condenado em junho de 1633, Galileu viveu seus últimos anos em sua vila em Arcetri, perto de Florença, onde morreu em janeiro de 1642.",
    { label: "Stanford Encyclopedia of Philosophy · Galileu", url: "https://plato.stanford.edu/entries/galileo/" },
  ),
  number(
    "hist-magalhaes-circum",
    "História",
    "Quantos anos durou a primeira viagem de circum-navegação do globo, iniciada por Fernão de Magalhães?",
    "Cerca de 3 anos",
    "Conte da partida da Espanha, em 1519, até o retorno do navio Victoria, em 1522.",
    "Magalhães morreu no caminho, nas Filipinas, e coube a Juan Sebastián Elcano comandar o retorno e completar a primeira volta ao mundo.",
    { label: "UNESCO · Memória do Mundo, primeira circum-navegação", url: "https://www.unesco.org/en/memory-world/first-voyage-circumnavigation-fernao-de-magalhaes-and-juan-sebastian-elcano-1519-1522" },
  ),
  number(
    "hist-qin-shihuang",
    "História",
    "Quantos anos Qin Shi Huang reinou como o primeiro imperador de uma China unificada?",
    "11 anos",
    "Conte a partir da proclamação do título de imperador, em 221 a.C., até sua morte, em 210 a.C.",
    "Antes de unificar a China, ele já governava o estado de Qin desde jovem; como imperador de uma China unificada, porém, seu reinado foi mais curto do que se imagina.",
    { label: "World History Encyclopedia · Qin Shi Huang", url: "https://www.worldhistory.org/Qin_Shi_Huang/" },
  ),
  number(
    "tech-intel-4004",
    "Tecnologia",
    "Quantos transistores tinha o Intel 4004, o primeiro microprocessador comercial do mundo?",
    "2.300 transistores",
    "Contagem oficial do chip lançado em 1971, fabricado em processo de 10 micra.",
    "Cabia inteiro em uma pastilha de silício de cerca de 12 mm².",
    { label: "Computer History Museum · Intel's Microprocessor", url: "https://www.computerhistory.org/revolution/digital-logic/12/285" },
  ),
  number(
    "tech-apple-m1",
    "Tecnologia",
    "Quantos transistores tem o chip Apple M1, anunciado em 2020?",
    "16 bilhões de transistores",
    "Contagem divulgada no lançamento oficial do chip, fabricado em processo de 5 nanômetros.",
    "Foi o primeiro chip de computador pessoal da Apple feito nesse processo de fabricação.",
    { label: "Apple Newsroom · Apple unleashes M1", url: "https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/" },
  ),
  number(
    "tech-nvidia-h100",
    "Tecnologia",
    "Quantos transistores tem a GPU NVIDIA H100, revelada na GTC de 2022?",
    "80 bilhões de transistores",
    "Contagem do die GH100 fabricado no processo TSMC 4N, anunciado em março de 2022.",
    "É cerca de 68% mais transistores do que a geração anterior, a A100.",
    { label: "Tom's Hardware · Nvidia Hopper H100 GPU Revealed", url: "https://www.tomshardware.com/news/nvidia-hopper-h100-gpu-revealed-gtc-2022" },
  ),
  number(
    "tech-cerebras-wse2",
    "Tecnologia",
    "Quantos transistores tem o Cerebras WSE-2, o maior chip de IA já construído, lançado em 2021?",
    "2,6 trilhões de transistores",
    "Chip em escala de wafer completo, fabricado em processo de 7 nanômetros da TSMC.",
    "Ele também reúne 850 mil núcleos otimizados para inteligência artificial.",
    { label: "Cerebras · press release do WSE-2", url: "https://www.cerebras.ai/press-release/cerebras-systems-smashes-the-2-5-trillion-transistor-mark-with-new-second-generation-wafer-scale-engine" },
  ),
  number(
    "tech-eniac-valvulas",
    "Tecnologia",
    "Quantas válvulas (tubos a vácuo) tinha o ENIAC, considerado o primeiro computador eletrônico de uso geral?",
    "18.000 válvulas",
    "Contagem aproximada divulgada pelo Computer History Museum para a máquina concluída em 1945.",
    "Uma válvula queimava, em média, a cada um ou dois dias de operação.",
    { label: "Computer History Museum · Birth of the Computer", url: "https://www.computerhistory.org/revolution/birth-of-the-computer/4/78" },
  ),
  number(
    "tech-ibm-ramac",
    "Tecnologia",
    "Quantos caracteres de dados armazenava o disco rígido do IBM 305 RAMAC, o primeiro HD comercial, lançado em 1956?",
    "5 milhões de caracteres",
    "Capacidade do conjunto de 50 discos magnéticos da unidade de armazenamento.",
    "O equipamento ocupava o espaço de duas geladeiras e pesava mais de uma tonelada.",
    { label: "IBM · história do RAMAC", url: "https://www.ibm.com/history/ramac" },
  ),
  number(
    "tech-apollo-guidance-computer",
    "Tecnologia",
    "Quantas palavras de memória fixa (core rope) tinha o Computador de Orientação do Apollo (AGC), usado nas missões lunares?",
    "36.864 palavras",
    "Memória fixa somente leitura, tecida à mão em fios de cobre; não conta a memória apagável.",
    "Guardava os programas, rotinas e constantes usados durante o voo.",
    { label: "NASA · Apollo Flight Journal, computadores de bordo", url: "https://history.nasa.gov/afj/compessay.html" },
  ),
  number(
    "tech-voyager1-velocidade",
    "Tecnologia",
    "Em 21 de agosto de 2024, a quantos quilômetros por hora a sonda Voyager 1 viajava em relação ao Sol?",
    "Cerca de 61.243 km/h",
    "Velocidade relativa ao Sol na data informada pela NASA; equivale a 17 km/s.",
    "A sonda é o objeto feito por humanos mais distante da Terra.",
    { label: "NASA Science · Voyager 1", url: "https://science.nasa.gov/mission/voyager/voyager-1/" },
  ),
  number(
    "tech-parker-solar-probe",
    "Tecnologia",
    "Qual foi a velocidade recorde atingida pela sonda Parker Solar Probe no periélio de 24 de dezembro de 2024?",
    "Cerca de 692.000 km/h",
    "Velocidade no ponto mais próximo do Sol na aproximação de dezembro de 2024; equivale a 192,2 km/s.",
    "Isso faz dela o objeto mais rápido já construído por humanos.",
    { label: "NASA Science · Parker Solar Probe faz história", url: "https://science.nasa.gov/science-research/heliophysics/nasas-parker-solar-probe-makes-history-with-closest-pass-to-sun/" },
  ),
  number(
    "tech-new-horizons-lancamento",
    "Tecnologia",
    "A que velocidade a sonda New Horizons deixou a Terra em seu lançamento, em 19 de janeiro de 2006?",
    "Cerca de 58.536 km/h",
    "Velocidade em relação à Terra logo após a queima do último estágio do foguete.",
    "Até hoje é a maior velocidade de partida da Terra já registrada por um objeto feito por humanos.",
    { label: "New Horizons · Fifty Facts (JHU APL / NASA)", url: "https://pluto.jhuapl.edu/News-Center/Fifty-Facts.php" },
  ),
  number(
    "tech-sr71-recorde",
    "Tecnologia",
    "Qual é o recorde absoluto de velocidade para aviões tripulados com respiração de ar, estabelecido pelo SR-71 Blackbird em 28 de julho de 1976?",
    "3.529,56 km/h",
    "Recorde certificado pela FAI (Federação Aeronáutica Internacional), ainda vigente.",
    "Equivale a Mach 3,32 e foi pilotado por Eldon Joersz e George Morgan Jr.",
    { label: "FAI · 50 anos dos recordes do SR-71 Blackbird", url: "https://www.fai.org/news/50-years-lockheed-blackbird-records" },
  ),
  number(
    "tech-concorde-velocidade",
    "Tecnologia",
    "Qual era a velocidade máxima de cruzeiro do Concorde, o avião de passageiros supersônico?",
    "2.179 km/h",
    "Velocidade oficial de operação em cruzeiro, equivalente a Mach 2,04.",
    "O avião cruzava a 18.000 metros de altitude, na estratosfera.",
    { label: "Encyclopaedia Britannica · Concorde", url: "https://www.britannica.com/technology/Concorde" },
  ),
  number(
    "tech-iss-velocidade",
    "Tecnologia",
    "A qual velocidade orbital a Estação Espacial Internacional viaja ao redor da Terra?",
    "Cerca de 27.600 km/h",
    "Velocidade orbital média, equivalente a 7,66 km/s; a ISS dá uma volta completa a cada 90 minutos.",
    "Isso corresponde a cerca de cinco milhas por segundo.",
    { label: "NASA · Space Station Facts and Figures", url: "https://www.nasa.gov/international-space-station/space-station-facts-and-figures/" },
  ),
  number(
    "tech-facebook-bilhao",
    "Tecnologia",
    "Em que dia de outubro de 2012 o Facebook anunciou ter atingido a marca de 1 bilhão de usuários ativos mensais?",
    "4 de outubro de 2012",
    "Data do anúncio oficial feito por Mark Zuckerberg.",
    "O Facebook havia atingido 500 milhões de usuários pouco mais de dois anos antes, em julho de 2010.",
    { label: "About Meta · One Billion People on Facebook", url: "https://about.fb.com/news/2012/10/one-billion-people-on-facebook/" },
  ),
  number(
    "tech-instagram-bilhao",
    "Tecnologia",
    "Em que mês e ano o Instagram anunciou ter atingido 1 bilhão de usuários ativos mensais?",
    "Junho de 2018",
    "Marco de usuários mensais divulgado junto com o lançamento do IGTV.",
    "O aplicativo havia passado de 800 milhões de usuários em setembro de 2017.",
    { label: "TechCrunch · Instagram hits 1 billion monthly users", url: "https://techcrunch.com/2018/06/20/instagram-1-billion-users/" },
  ),
  number(
    "tech-chatgpt-100milhoes",
    "Tecnologia",
    "Em janeiro de 2023, cerca de quantos milhões de usuários ativos mensais o ChatGPT havia atingido, segundo estudo do UBS citado pela Reuters?",
    "100 milhões de usuários",
    "Estimativa referente a janeiro de 2023, dois meses após o lançamento do aplicativo.",
    "Isso o tornou, na época, o aplicativo de consumo de crescimento mais rápido da história.",
    { label: "Reuters (via ITIF) · ChatGPT sets record for user growth", url: "https://itif.org/publications/2023/02/13/openais-chatgpt-user-base-has-grown-faster-than-tiktoks-or-instagrams/" },
  ),
  number(
    "tech-primeiro-sms",
    "Tecnologia",
    "Em que dia de dezembro de 1992 foi enviada a primeira mensagem de texto (SMS) da história, dizendo 'Merry Christmas'?",
    "3 de dezembro de 1992",
    "Mensagem enviada pelo engenheiro Neil Papworth pela rede da Vodafone no Reino Unido.",
    "O destinatário não podia responder, pois seu celular ainda não enviava textos.",
    { label: "Vodafone · 25 anos da primeira mensagem de texto", url: "https://www.vodafone.com/news/newsroom/technology/25-anniversary-text-message" },
  ),
  number(
    "tech-bitcoin-genesis",
    "Tecnologia",
    "Quantos bitcoins foram criados como recompensa no bloco gênese da rede Bitcoin, minerado em 3 de janeiro de 2009?",
    "50 bitcoins",
    "Recompensa do bloco 0; por uma peculiaridade do código original, esses bitcoins não podem ser gastos.",
    "O bloco contém uma manchete de jornal sobre bancos como marca de data.",
    { label: "Bitcoin Wiki · Genesis block", url: "https://en.bitcoin.it/wiki/Genesis_block" },
  ),
  number(
    "tech-ps5-ssd",
    "Tecnologia",
    "Qual é a capacidade do SSD customizado embutido no PlayStation 5, lançado em 2020?",
    "825 GB",
    "Capacidade bruta do armazenamento interno; a capacidade disponível ao usuário é menor.",
    "A Sony criou um design próprio de SSD, o que explica essa capacidade pouco usual.",
    { label: "PlayStation Blog · especificações técnicas do PS5", url: "https://blog.playstation.com/2020/03/18/unveiling-new-details-of-playstation-5-hardware-technical-specs/" },
  ),
  number(
    "tech-hitachi-1tb",
    "Tecnologia",
    "Em que ano a Hitachi anunciou o Deskstar 7K1000, o primeiro disco rígido comercial de 1 terabyte?",
    "2007",
    "Anúncio feito na CES de Las Vegas, em janeiro daquele ano.",
    "O disco chegou às lojas custando cerca de 40 centavos de dólar por gigabyte.",
    { label: "Hitachi · Shatters Capacity Record with World's First Terabyte Hard Drive", url: "https://www.hitachi.com/en-us/press/archive/01052007/" },
  ),
  number(
    "tech-ibm-osprey",
    "Tecnologia",
    "Quantos qubits tem o processador quântico IBM Osprey, apresentado em novembro de 2022?",
    "433 qubits",
    "Processador supercondutor revelado no IBM Quantum Summit de 2022.",
    "Ele mais que triplicou a contagem de qubits do processador anterior da IBM, o Eagle.",
    { label: "IBM Newsroom · IBM Unveils 400 Qubit-Plus Quantum Processor", url: "https://newsroom.ibm.com/2022-11-09-IBM-Unveils-400-Qubit-Plus-Quantum-Processor-and-Next-Generation-IBM-Quantum-System-Two" },
  ),
  number(
    "tech-google-sycamore",
    "Tecnologia",
    "Quantos qubits funcionais o processador Sycamore, do Google, usou no experimento de 'supremacia quântica' publicado na Nature em outubro de 2019?",
    "53 qubits",
    "O chip físico tem 54 qubits, mas um deles não funcionava durante o experimento.",
    "A tarefa realizada em cerca de 200 segundos levaria, segundo a estimativa do estudo, milhares de anos em um supercomputador clássico.",
    { label: "Nature · Quantum supremacy using a programmable superconducting processor", url: "https://www.nature.com/articles/s41586-019-1666-5" },
  ),
  number(
    "tech-frontier-exaflops",
    "Tecnologia",
    "Qual foi a marca de desempenho (em exaflops) do supercomputador Frontier no topo da lista TOP500 de maio de 2023?",
    "1,194 exaflops",
    "Resultado do teste de desempenho Linpack (HPL) divulgado na lista TOP500 de maio de 2023.",
    "O Frontier, do laboratório ORNL nos EUA, foi o primeiro supercomputador do mundo a ultrapassar a marca de um exaflop.",
    { label: "TOP500 · Frontier Remains As Sole Exaflop Machine", url: "https://www.top500.org/news/frontier-remains-sole-exaflop-machine-and-retains-top-spot-improving-upon-its-previous-hpl-score/" },
  ),
  number(
    "musica-piano-teclas",
    "Música",
    "Quantas teclas tem um piano acústico padrão?",
    "88 teclas",
    "Contagem total de teclas brancas e pretas em um piano moderno de tamanho padrão.",
    "A extensão cobre sete oitavas completas mais uma terça menor, da nota mais grave à mais aguda do instrumento.",
    { label: "Wikipédia · Piano", url: "https://en.wikipedia.org/wiki/Piano" },
  ),
  number(
    "musica-violao-cordas",
    "Música",
    "Quantas cordas tem um violão ou guitarra no formato mais comum?",
    "6 cordas",
    "Configuração padrão de seis cordas, a mais usada em violões e guitarras convencionais (existem variações com 7, 8, 9 ou 12 cordas).",
    "É a base da afinação padrão ensinada na maioria dos métodos do instrumento.",
    { label: "Wikipédia · Guitarra", url: "https://en.wikipedia.org/wiki/Guitar" },
  ),
  number(
    "musica-violino-cordas",
    "Música",
    "Quantas cordas tem um violino no modelo mais comum?",
    "4 cordas",
    "Modelo padrão de violino usado em orquestras; existem variantes raras com uma corda extra.",
    "As cordas costumam ser afinadas em quintas justas.",
    { label: "Wikipédia · Violino", url: "https://en.wikipedia.org/wiki/Violin" },
  ),
  number(
    "musica-trompete-pistos",
    "Música",
    "Quantos pistões (válvulas) tem um trompete moderno padrão?",
    "3 pistões",
    "Modelo padrão de trompete de pistões usado na maioria das orquestras e bandas; modelos com um pistão extra são raros.",
    "Cada pistão, ao ser acionado, aumenta o comprimento do tubo de ar e altera a nota produzida.",
    { label: "Wikipédia · Trompete", url: "https://en.wikipedia.org/wiki/Trumpet" },
  ),
  number(
    "musica-la-440",
    "Música",
    "Qual é a frequência, em Hz, da nota Lá usada como referência de afinação (diapasão padrão) na música ocidental?",
    "440 Hz",
    "Padrão internacional de afinação para a nota Lá4 (Lá acima do Dó central).",
    "Foi recomendado internacionalmente em 1955 e formalizado como norma ISO em 1975.",
    { label: "Wikipédia · A440 (padrão de afinação)", url: "https://en.wikipedia.org/wiki/A440_(pitch_standard)" },
  ),
  number(
    "musica-harpa-cordas",
    "Música",
    "Quantas cordas tem uma harpa de concerto (harpa de pedais) padrão?",
    "47 cordas",
    "Modelo profissional de harpa de pedais de concerto, do tamanho concertino ao grand concert.",
    "O número de pedais do instrumento é bem menor do que o número de cordas.",
    { label: "Lyon & Healy Harps · Style 30 (harpa de concerto)", url: "https://www.lyonhealy.com/harps/style-30/" },
  ),
  number(
    "musica-cancao-mais-longa",
    "Música",
    "Quantas horas tem a canção reconhecida pelo Guinness como a mais longa já lançada oficialmente, 'The Rise and Fall of Bossanova', do artista PC III?",
    "Cerca de 13 horas, 23 minutos e 32 segundos",
    "Duração oficial da faixa lançada em 2016, recorde do Guinness entre 2016 e 2020.",
    "Apesar de ser dividida em cinco partes no lançamento, é tratada como uma única canção contínua.",
    { label: "Internet Archive · The Rise and Fall of Bossanova (PC III)", url: "https://archive.org/details/TheRiseAndFallOfBossanova" },
  ),
  number(
    "musica-beyonce-grammys",
    "Música",
    "Quantos prêmios Grammy Beyoncé havia vencido ao todo até a cerimônia de 5 de fevereiro de 2023 (65ª edição), quando bateu o recorde histórico?",
    "32 Grammys",
    "Soma de vitórias em toda a carreira contabilizada até aquela cerimônia específica.",
    "O prêmio decisivo daquela noite foi na categoria Best Dance/Electronic Album, por 'Renaissance'.",
    { label: "NPR · Grammy Awards 2023", url: "https://www.npr.org/2023/02/05/1152837932/2023-grammy-awards-winners-beyonce" },
  ),
  number(
    "musica-beyonce-indicacoes",
    "Música",
    "Quantas indicações ao Grammy Beyoncé já havia recebido ao longo da carreira, segundo o balanço divulgado após a cerimônia de 2025?",
    "99 indicações",
    "Total acumulado de indicações (não apenas vitórias) reconhecido pela Recording Academy até 2025.",
    "Esse total também a torna a artista mais indicada da história do prêmio.",
    { label: "Grammy.com · Perfil de Beyoncé", url: "https://www.grammy.com/artists/beyonce-knowles/12474/" },
  ),
  number(
    "musica-solti-grammys",
    "Música",
    "Quantos Grammys o maestro Georg Solti venceu ao longo da carreira, recorde que ficou de pé de 1998 até 2023?",
    "31 Grammys",
    "Total de vitórias do maestro húngaro-britânico entre 1963 e 1998, incluindo o prêmio recebido postumamente.",
    "A maioria de suas vitórias veio à frente da Orquestra Sinfônica de Chicago.",
    { label: "Guinness World Records · mais Grammys vencidos por um artista masculino", url: "https://www.guinnessworldrecords.com/world-records/649014-most-grammy-awards-won-by-a-male-artist" },
  ),
  number(
    "musica-old-town-road-semanas",
    "Música",
    "Quantas semanas consecutivas 'Old Town Road', de Lil Nas X com Billy Ray Cyrus, ficou em 1º lugar na Billboard Hot 100 em 2019, recorde ainda vigente?",
    "19 semanas",
    "Contagem de semanas consecutivas no topo da parada Billboard Hot 100 dos EUA.",
    "A música só foi destronada pelo single 'Bad Guy', de Billie Eilish.",
    { label: "NBC News · recorde de 'Old Town Road'", url: "https://www.nbcnews.com/pop-culture/music/old-town-road-dethroned-top-single-after-record-smashing-19-n1044461" },
  ),
  number(
    "musica-one-sweet-day-semanas",
    "Música",
    "Antes de 'Old Town Road', quantas semanas 'One Sweet Day', de Mariah Carey e Boyz II Men, ficou em 1º lugar na Billboard Hot 100 (1995-1996)?",
    "16 semanas",
    "Recorde de semanas consecutivas no topo da Billboard Hot 100, mantido por 23 anos.",
    "Foi a décima música de Mariah Carey e a quarta de Boyz II Men a chegar ao topo da parada.",
    { label: "Billboard · recorde de 'One Sweet Day'", url: "https://www.billboard.com/pro/mariah-carey-boyz-ii-men-one-sweet-day-most-weeks-no-1-billboard-hot-100/" },
  ),
  number(
    "musica-despacito-semanas",
    "Música",
    "Quantas semanas 'Despacito', de Luis Fonsi e Daddy Yankee com Justin Bieber, ficou em 1º lugar na Billboard Hot 100 em 2017, igualando um recorde histórico?",
    "16 semanas",
    "Semanas consecutivas no topo da Billboard Hot 100 alcançadas pela versão remix da canção em 2017.",
    "Empatou com a marca que 'One Sweet Day' mantinha havia mais de duas décadas.",
    { label: "CBC · 'Despacito' iguala recorde de Mariah Carey", url: "https://amp.cbc.ca/lite/story/1.4264852" },
  ),
  number(
    "musica-whitney-semanas",
    "Música",
    "Quantas semanas 'I Will Always Love You', de Whitney Houston, ficou em 1º lugar na Billboard Hot 100 em 1992-1993?",
    "14 semanas",
    "Semanas consecutivas no topo da parada, contadas a partir de novembro de 1992.",
    "Ao alcançar essa marca, a canção superou o recorde que 'End of the Road', do Boyz II Men, havia acabado de estabelecer.",
    { label: "Site oficial de Whitney Houston", url: "https://www.whitneyhouston.com/news/whitney-houstons-i-will-always-love-you-topped-billboard-hot-100-in-1992/" },
  ),
  number(
    "musica-adele-25-vendas",
    "Música",
    "Quantas cópias do álbum '25', de Adele, foram vendidas nos Estados Unidos apenas na primeira semana de lançamento, em novembro de 2015?",
    "3,38 milhões de cópias",
    "Vendas físicas e digitais no mercado norte-americano medidas pela Nielsen Music na primeira semana de vendas.",
    "Foi a maior semana de vendas de um álbum desde que a Nielsen começou a medir o mercado musical, em 1991.",
    { label: "Billboard · vendas de '25' de Adele", url: "https://www.billboard.com/pro/adele-25-sales-first-week-us/" },
  ),
  number(
    "musica-thriller-grammys",
    "Música",
    "Quantos prêmios Grammy o álbum 'Thriller', de Michael Jackson, venceu na cerimônia de 1984 (26ª edição), um recorde para uma única noite?",
    "8 Grammys",
    "Prêmios vencidos na cerimônia realizada em 28 de fevereiro de 1984, incluindo Álbum do Ano.",
    "Jackson foi o primeiro artista a conquistar essa quantidade de prêmios em uma única cerimônia.",
    { label: "Grammy.com · a noite histórica de Michael Jackson", url: "https://www.grammy.com/news/30-years-later-michael-jacksons-thrilling-grammy-night/" },
  ),
  number(
    "musica-santana-grammys",
    "Música",
    "Quantos Grammys Santana venceu na cerimônia do ano 2000 pelo álbum 'Supernatural', igualando o recorde que Michael Jackson havia estabelecido em 1984?",
    "8 Grammys",
    "Prêmios vencidos numa única cerimônia (ano 2000), feito alcançado até hoje só por esses dois artistas.",
    "O álbum 'Supernatural' marcou o retorno de Carlos Santana ao topo das paradas décadas após seu auge nos anos 1970.",
    { label: "Berklee · o legado de Grammys de 'Thriller'", url: "https://www.berklee.edu/berklee-now/news/40-years-later-thriller-grammy-sweep-still-resonates" },
  ),
  number(
    "musica-maior-orquestra",
    "Música",
    "Quantos músicos tocaram juntos na maior orquestra já reunida, recorde do Guinness estabelecido na Venezuela em novembro de 2021?",
    "8.573 músicos",
    "Total de integrantes reconhecido oficialmente pelo Guinness World Records para essa apresentação específica.",
    "A apresentação, organizada pelo sistema venezuelano El Sistema, interpretou uma marcha de Tchaikovsky.",
    { label: "Guinness World Records · maior orquestra", url: "https://www.guinnessworldrecords.com/world-records/largest-orchestra" },
  ),
  number(
    "musica-orgao-tubos",
    "Música",
    "Quantos tubos tem o maior órgão de tubos do mundo, o Boardwalk Hall Auditorium Organ, em Atlantic City?",
    "Cerca de 33.112 tubos",
    "Contagem oficial usada pelo Guinness World Records, que reconhece o instrumento como o maior já construído.",
    "Levou cerca de três anos para ser construído, entre 1929 e 1932, e pesa mais de 150 toneladas.",
    { label: "Wikipédia · Boardwalk Hall Auditorium Organ", url: "https://en.wikipedia.org/wiki/Boardwalk_Hall_Auditorium_Organ" },
  ),
  number(
    "musica-stratocaster-trastes",
    "Música",
    "Quantos trastes tem o braço da guitarra Fender American Professional II Stratocaster, um dos modelos mais populares da marca?",
    "22 trastes",
    "Especificação de fábrica desse modelo específico da linha American Professional II.",
    "Modelos vintage da Stratocaster costumavam ter um traste a menos.",
    { label: "Reverb · especificações da Fender American Professional II Stratocaster", url: "https://reverb.com/p/fender-american-professional-ii-stratocaster" },
  ),
  number(
    "musica-eltonjohn-turne-faturamento",
    "Música",
    "Quantos dólares a turnê de despedida de Elton John, 'Farewell Yellow Brick Road' (2018-2023), arrecadou ao todo, tornando-se a turnê de maior bilheteria da história até então?",
    "US$ 939,1 milhões",
    "Faturamento total bruto da turnê, medido pela Billboard Boxscore ao longo de todas as datas.",
    "A turnê teve 330 shows ao longo de cinco anos, encerrando-se em Estocolmo.",
    { label: "Guinness World Records · turnê de Elton John", url: "https://www.guinnessworldrecords.com/news/2023/2/elton-john-going-out-with-a-bang-as-final-tour-becomes-highest-grossing-ever-737203" },
  ),
  number(
    "musica-eltonjohn-turne-ingressos",
    "Música",
    "Quantos ingressos foram vendidos ao todo durante a turnê de despedida de Elton John, 'Farewell Yellow Brick Road' (2018-2023)?",
    "6 milhões de ingressos",
    "Total de ingressos vendidos somando as 330 apresentações da turnê.",
    "Em receita, foi a turnê de maior bilheteria da história até ser superada pelo Coldplay.",
    { label: "Billboard · números finais da turnê de Elton John", url: "https://www.billboard.com/pro/elton-john-farewell-tour-ends-939-million/" },
  ),
  number(
    "musica-springsteen-show-mais-longo",
    "Música",
    "Quantas horas e minutos durou o show mais longo da carreira de Bruce Springsteen, tocado em Helsinque em 31 de julho de 2012?",
    "4 horas e 6 minutos",
    "Duração do show específico realizado no Estádio Olímpico de Helsinque, com a E Street Band.",
    "O repertório teve 33 músicas, incluindo um bloco acústico no início e covers de outros artistas.",
    { label: "Billboard · recorde de show mais longo de Bruce Springsteen", url: "https://www.billboard.com/music/music-news/bruce-springsteen-longest-concert-breaks-record-7502819" },
  ),
  number(
    "cine-logistics-duracao",
    "Cinema",
    "Quantas horas dura 'Logistics' (2012), o filme mais longo já feito segundo o Guinness World Records?",
    "857 horas",
    "Duração oficial reconhecida pelo Guinness World Records para uma obra com estreia pública.",
    "Isso equivale a 35 dias e 17 horas seguidas de projeção. O filme acompanha, em tempo real, a cadeia de produção de um relógio de pulso.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/69763-longest-film-made" },
  ),
  number(
    "cine-piratas-orcamento",
    "Cinema",
    "Qual foi o orçamento de produção de 'Piratas do Caribe: Navegando em Águas Misteriosas' (2011), considerado o filme mais caro já feito?",
    "US$ 379 milhões",
    "Orçamento de produção após créditos fiscais; o custo bruto antes dos créditos passou de US$ 410 milhões.",
    "O filme foi o primeiro da franquia gravado quase inteiramente em câmeras 3D, o que encareceu bastante a produção.",
    { label: "CBR", url: "https://www.cbr.com/pirates-of-the-caribbean-4-most-expensive-movie-ever/" },
  ),
  number(
    "cine-iluminado-retakes",
    "Cinema",
    "Quantas vezes a cena do 'shine' entre Dick Hallorann e Danny foi regravada em 'O Iluminado' (1980), recorde do Guinness?",
    "148 vezes",
    "Recorde Guinness de mais retakes para uma cena com diálogo falado.",
    "Stanley Kubrick era conhecido por exigir dezenas de takes de seus atores; o dado foi revelado pelo operador de Steadicam do filme, Garrett Brown.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/74583-most-retakes-for-one-scene-with-dialogue" },
  ),
  number(
    "cine-vingadores-ultimato-orcamento",
    "Cinema",
    "Qual foi o orçamento de produção de 'Vingadores: Ultimato' (2019), segundo o banco de dados The Numbers?",
    "US$ 400 milhões",
    "Orçamento de produção listado pelo The Numbers; outras fontes citam valores a partir de US$ 356 milhões.",
    "O valor não inclui os custos de marketing e divulgação do filme.",
    { label: "The Numbers", url: "https://www.the-numbers.com/movie/Avengers-Endgame-(2019)" },
  ),
  number(
    "cine-vingadores-ultimato-cinemas",
    "Cinema",
    "Em quantos cinemas dos Estados Unidos 'Vingadores: Ultimato' estreou em abril de 2019?",
    "4.662 cinemas",
    "Contagem de salas na estreia doméstica (EUA e Canadá); recorde de amplitude de lançamento na época.",
    "O filme também teve a maior média de bilheteria por sala já registrada em um lançamento amplo.",
    { label: "Box Office Pro", url: "https://www.boxofficepro.com/weekend-box-office-avengers-endgame-record/" },
  ),
  number(
    "cine-vingadores-ultimato-duracao",
    "Cinema",
    "Quantos minutos dura 'Vingadores: Ultimato' (2019)?",
    "181 minutos",
    "Duração da versão de exibição nos cinemas.",
    "Na época do lançamento, foi um dos filmes de super-heróis mais longos já produzidos.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Avengers:_Endgame" },
  ),
  number(
    "cine-streep-indicacoes",
    "Cinema",
    "Quantas indicações ao Oscar Meryl Streep já recebeu ao longo da carreira, recorde entre atores e atrizes?",
    "21 indicações",
    "Total de indicações em categorias de atuação até a mais recente contabilizada pelo Guinness World Records.",
    "Ela alcançou a marca de recordista em 2018, com a indicação por 'The Post'.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/news/2026/1/inside-meryl-streeps-iconic-record-breaking-career-as-most-nominated-oscars-actress-ever" },
  ),
  number(
    "cine-disney-oscars",
    "Cinema",
    "Quantos Oscars competitivos Walt Disney venceu ao longo da vida, o maior número já conquistado por uma pessoa?",
    "22 Oscars",
    "Contagem de prêmios competitivos, sem incluir os 4 Oscars honorários que ele também recebeu.",
    "Somando prêmios competitivos e honorários, o total sobe para 26 estatuetas, também recorde histórico.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_Academy_Awards_for_Walt_Disney" },
  ),
  number(
    "cine-hopkins-idade",
    "Cinema",
    "Com quantos anos Anthony Hopkins venceu o Oscar de Melhor Ator por 'O Pai' (2021), tornando-se o mais velho a ganhar na categoria?",
    "83 anos",
    "Idade no momento da cerimônia da 93ª edição do Oscar, em abril de 2021.",
    "Ele superou o recorde anterior, de Christopher Plummer, que tinha 82 anos ao vencer por 'Beginners'.",
    { label: "ITV News", url: "https://www.itv.com/news/wales/2021-04-26/sir-anthony-hopkins-83-scoops-up-historic-oscar-as-oldest-winner-of-best-actor-award-for-the-father" },
  ),
  number(
    "cine-tandy-idade",
    "Cinema",
    "Com quantos anos Jessica Tandy venceu o Oscar de Melhor Atriz por 'Dirigindo Miss Daisy' (1989), recorde da categoria?",
    "80 anos",
    "Idade exata registrada pelo Guinness era 80 anos e 295 dias, na cerimônia de março de 1990.",
    "Ela superou o recorde até então pertencente a Katharine Hepburn.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/oldest-oscar-winner-as-best-actress" },
  ),
  number(
    "cine-oneal-idade",
    "Cinema",
    "Com quantos anos Tatum O'Neal venceu o Oscar de Melhor Atriz Coadjuvante por 'Lua de Papel' (1973), tornando-se a mais jovem vencedora competitiva da história do Oscar?",
    "10 anos",
    "Idade no ano da premiação, em 1974; recorde de menor idade entre vencedores competitivos em qualquer categoria.",
    "Ela contracenou com o próprio pai, Ryan O'Neal, no filme.",
    { label: "Gold Derby", url: "https://www.goldderby.com/film/2024/oscars-tatum-o-neal-paper-moon-youngest-winner/" },
  ),
  number(
    "cine-titanic-indicacoes",
    "Cinema",
    "A quantas categorias do Oscar 'Titanic' (1997) foi indicado, empatando o recorde histórico da época?",
    "14 indicações",
    "Total de indicações na 70ª cerimônia do Oscar, em 1998.",
    "O filme converteu 11 dessas indicações em prêmios, incluindo Melhor Filme e Melhor Diretor.",
    { label: "Academy of Motion Picture Arts and Sciences", url: "https://www.oscars.org/collection-highlights/titanic" },
  ),
  number(
    "cine-titanic-orcamento",
    "Cinema",
    "Qual foi o orçamento de produção de 'Titanic' (1997), o mais caro do cinema até então?",
    "US$ 200 milhões",
    "Orçamento de produção declarado à época do lançamento.",
    "O estouro de orçamento chegou a colocar em risco a parceria entre os estúdios Paramount e 20th Century Fox.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Titanic_(1997_film)" },
  ),
  number(
    "cine-lalaland-indicacoes",
    "Cinema",
    "A quantas categorias do Oscar 'La La Land: Cantando Estações' (2016) foi indicado, igualando o recorde de 'Titanic' e 'A Malvada'?",
    "14 indicações",
    "Total de indicações anunciadas para a 89ª cerimônia do Oscar, em 2017.",
    "Apesar do recorde de indicações, o filme venceu em 6 categorias, não em todas.",
    { label: "The Hollywood Reporter", url: "https://www.hollywoodreporter.com/lists/oscar-nominations-2017-complete-list-nominees-960044/" },
  ),
  number(
    "cine-benhur-oscars",
    "Cinema",
    "Quantos Oscars 'Ben-Hur' (1959) venceu, tornando-se o primeiro filme a chegar a esse número recorde?",
    "11 Oscars",
    "Vitórias entre 12 indicações recebidas; recorde depois igualado por 'Titanic' e 'O Senhor dos Anéis: O Retorno do Rei'.",
    "A única categoria em que 'Ben-Hur' não venceu foi a de roteiro adaptado.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/most-oscars-won-by-a-film" },
  ),
  number(
    "cine-rotk-oscars",
    "Cinema",
    "A quantas categorias do Oscar 'O Senhor dos Anéis: O Retorno do Rei' (2003) foi indicado, vencendo em absolutamente todas elas?",
    "11 indicações",
    "Indicações na 76ª cerimônia do Oscar, em 2004; o filme venceu as 11, um aproveitamento de 100%.",
    "Foi a primeira vez que um filme de fantasia ou ficção científica venceu Melhor Filme.",
    { label: "NPR", url: "https://www.npr.org/2004/03/01/1724892/rings-sweeps-oscars-with-11-wins" },
  ),
  number(
    "cine-avatar-agua-vfx",
    "Cinema",
    "Quantos planos de efeitos visuais a Industrial Light & Magic entregou para 'Avatar: O Caminho da Água' (2022) nos meses finais de produção?",
    "48 planos",
    "Planos de efeitos visuais criados especificamente pela ILM, concentrados na sequência de abertura e no retorno dos humanos a Pandora.",
    "Todos foram classificados como planos 'únicos', ou seja, sequências complexas que não se repetiam em outras partes do filme.",
    { label: "befores & afters", url: "https://beforesandafters.com/2023/03/31/how-industrial-light-magic-managed-to-deliver-48-one-off-vfx-shots-for-avatar-the-way-of-water-in-the-last-few-months-of-production/" },
  ),
  number(
    "cine-hepburn-oscars",
    "Cinema",
    "Quantos Oscars de Melhor Atriz Katharine Hepburn venceu ao longo da carreira, recorde ainda invicto na categoria?",
    "4 Oscars",
    "Vitórias competitivas na categoria de Melhor Atriz, entre os filmes 'Glória Feita de Lágrimas', 'Adivinhe Quem Vem para Jantar', 'O Leão no Inverno' e 'Num Lago Dourado'.",
    "Nenhuma outra atriz alcançou esse número de estatuetas na categoria principal.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Katharine_Hepburn" },
  ),
  number(
    "cine-forceawakens-cinemas",
    "Cinema",
    "Em quantos cinemas dos Estados Unidos 'Star Wars: O Despertar da Força' estreou em dezembro de 2015, recorde de amplitude para o mês?",
    "4.134 cinemas",
    "Contagem de salas na estreia doméstica (EUA e Canadá).",
    "O recorde anterior de amplitude em dezembro pertencia a 'O Hobbit: Uma Jornada Inesperada', com 4.045 cinemas.",
    { label: "Box Office Mojo", url: "https://www.boxofficemojo.com/article/ed3244295172/" },
  ),
  number(
    "cine-avatar-orcamento",
    "Cinema",
    "Qual foi o orçamento de produção de 'Avatar' (2009), de James Cameron?",
    "US$ 237 milhões",
    "Orçamento de produção declarado, sem contar os custos de marketing e divulgação.",
    "O filme levou cerca de quatro anos entre pré-produção e finalização das imagens geradas por computador.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Avatar_(2009_film)" },
  ),
  number(
    "cine-godfather2-duracao",
    "Cinema",
    "Quantos minutos dura 'O Poderoso Chefão Parte II' (1974)?",
    "205 minutos",
    "Duração da versão de exibição nos cinemas.",
    "É o único caso em que uma continuação venceu o Oscar de Melhor Filme depois de o original também ter vencido a categoria.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/The_Godfather_Part_II" },
  ),
  number(
    "cine-gwtw-duracao",
    "Cinema",
    "Quantos minutos dura 'E o Vento Levou' (1939), sem contar abertura musical e intervalo?",
    "221 minutos",
    "Duração do filme propriamente dito; com abertura, intervalo e música de encerramento, o tempo total de exibição em cinemas passava de 230 minutos.",
    "Ele foi, por décadas, o filme de maior bilheteria da história ajustada pela inflação.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Gone_with_the_Wind_(film)" },
  ),
  number(
    "cine-jurassicpark-duracao",
    "Cinema",
    "Quantos minutos dura 'Jurassic Park' (1993), de Steven Spielberg?",
    "127 minutos",
    "Duração da versão de exibição nos cinemas.",
    "Apesar da fama dos dinossauros digitais, boa parte das cenas usou animatrônicos em tamanho real.",
    { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Jurassic_Park_(film)" },
  ),
  number(
    "ciencia-elementos-tabela",
    "Ciência",
    "Quantos elementos químicos são oficialmente reconhecidos na tabela periódica atual?",
    "118 elementos",
    "Contagem de elementos confirmados pela IUPAC; não inclui isótopos nem elementos ainda não sintetizados.",
    "Os quatro últimos elementos completaram a sétima linha da tabela em 2016.",
    { label: "IUPAC · elementos 113-118", url: "https://iupac.org/discovery-and-assignment-of-elements-with-atomic-numbers-113-115-117-and-118/" },
  ),
  number(
    "ciencia-velocidade-luz",
    "Ciência",
    "Qual é a velocidade da luz no vácuo, em metros por segundo?",
    "299.792.458 m/s",
    "Valor exato, definido pelo Sistema Internacional de Unidades.",
    "É a constante representada pela letra 'c' na física, usada na famosa equação E = mc².",
    { label: "NIST · velocidade da luz", url: "https://physics.nist.gov/cgi-bin/cuu/Value?c" },
  ),
  number(
    "ciencia-avogadro",
    "Ciência",
    "Qual é o valor da constante de Avogadro, em partículas por mol?",
    "6,02214076 × 10²³ por mol",
    "Valor exato, fixado na redefinição do SI de 2019.",
    "Representa quantas entidades elementares (átomos, moléculas etc.) existem em um mol de substância.",
    { label: "NIST · constante de Avogadro", url: "https://www.nist.gov/pml/owm/si-units-amount-substance" },
  ),
  number(
    "ciencia-gravidade-padrao",
    "Ciência",
    "Qual é o valor padrão da aceleração da gravidade na superfície da Terra, em m/s²?",
    "9,80665 m/s²",
    "Valor convencional definido internacionalmente, usado como referência.",
    "A gravidade real varia um pouco conforme a latitude e a altitude do local.",
    { label: "NIST · gravidade padrão", url: "https://physics.nist.gov/cgi-bin/cuu/Value?gn" },
  ),
  number(
    "ciencia-planck",
    "Ciência",
    "Qual é o valor da constante de Planck, em J·Hz⁻¹?",
    "6,62607015 × 10⁻³⁴ J·Hz⁻¹",
    "Valor exato, fixado na redefinição do SI de 2019.",
    "Essa constante é a base da mecânica quântica e relaciona a energia de um fóton à sua frequência.",
    { label: "NIST · constante de Planck", url: "https://physics.nist.gov/cgi-bin/cuu/Value?h" },
  ),
  number(
    "ciencia-boltzmann",
    "Ciência",
    "Qual é o valor da constante de Boltzmann, em J/K?",
    "1,380649 × 10⁻²³ J/K",
    "Valor exato, fixado na redefinição do SI de 2019.",
    "Ela conecta a energia média das partículas de um sistema à sua temperatura.",
    { label: "NIST · constante de Boltzmann", url: "https://physics.nist.gov/cgi-bin/cuu/Value?k" },
  ),
  number(
    "ciencia-constante-gravitacional",
    "Ciência",
    "Qual é o valor da constante gravitacional G, em m³·kg⁻¹·s⁻²?",
    "6,67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²",
    "Valor recomendado pelo CODATA; ainda não é uma constante definida com exatidão.",
    "É considerada a constante fundamental medida com menor precisão na física.",
    { label: "NIST · constante gravitacional", url: "https://physics.nist.gov/cgi-bin/cuu/Value?bg" },
  ),
  number(
    "ciencia-fusao-ferro",
    "Ciência",
    "Qual é a temperatura de fusão do ferro, em graus Celsius?",
    "1.538 °C",
    "Ponto de fusão à pressão atmosférica padrão.",
    "O ferro é o principal componente do núcleo da Terra, que fica em estado sólido apesar de temperaturas ainda mais altas.",
    { label: "Royal Society of Chemistry · ferro", url: "https://periodic-table.rsc.org/element/26/iron" },
  ),
  number(
    "ciencia-fusao-mercurio",
    "Ciência",
    "Qual é a temperatura de fusão do mercúrio, em graus Celsius?",
    "-38,83 °C",
    "Ponto de fusão à pressão atmosférica padrão.",
    "É o único metal que se mantém líquido à temperatura ambiente.",
    { label: "Royal Society of Chemistry · mercúrio", url: "https://periodic-table.rsc.org/element/80/mercury" },
  ),
  number(
    "ciencia-numero-atomico-ouro",
    "Ciência",
    "Qual é o número atômico do ouro?",
    "79",
    "Número de prótons no núcleo do átomo neutro.",
    "Seu símbolo químico, Au, vem do latim 'aurum'.",
    { label: "Royal Society of Chemistry · ouro", url: "https://periodic-table.rsc.org/element/79/gold" },
  ),
  number(
    "ciencia-ebulicao-nitrogenio",
    "Ciência",
    "Qual é a temperatura aproximada de ebulição do nitrogênio, em graus Celsius?",
    "Cerca de -196 °C",
    "Ponto de ebulição à pressão atmosférica padrão.",
    "O nitrogênio líquido nessa temperatura é usado para congelar amostras biológicas rapidamente.",
    { label: "Royal Society of Chemistry · nitrogênio", url: "https://periodic-table.rsc.org/element/7/nitrogen" },
  ),
  number(
    "ciencia-ebulicao-helio",
    "Ciência",
    "Qual é a temperatura aproximada de ebulição do hélio, em graus Celsius?",
    "Cerca de -269 °C",
    "Ponto de ebulição à pressão atmosférica padrão.",
    "Foi o último gás conhecido a ser liquefeito, no início do século 20.",
    { label: "Royal Society of Chemistry · hélio", url: "https://periodic-table.rsc.org/element/2/helium" },
  ),
  number(
    "ciencia-numero-atomico-uranio",
    "Ciência",
    "Qual é o número atômico do urânio?",
    "92",
    "Número de prótons no núcleo do átomo neutro.",
    "É o elemento mais pesado encontrado em quantidade significativa na natureza.",
    { label: "Royal Society of Chemistry · urânio", url: "https://periodic-table.rsc.org/element/92/uranium" },
  ),
  number(
    "ciencia-fusao-tungstenio",
    "Ciência",
    "Qual é a temperatura de fusão do tungstênio, em graus Celsius?",
    "3.414 °C",
    "Ponto de fusão à pressão atmosférica padrão.",
    "Tem o maior ponto de fusão entre todos os metais, por isso já foi muito usado em filamentos de lâmpadas.",
    { label: "Royal Society of Chemistry · tungstênio", url: "https://periodic-table.rsc.org/element/74/tungsten" },
  ),
  number(
    "ciencia-ebulicao-hidrogenio",
    "Ciência",
    "Qual é a temperatura aproximada de ebulição do hidrogênio, em graus Celsius?",
    "Cerca de -253 °C",
    "Ponto de ebulição à pressão atmosférica padrão.",
    "É o elemento mais leve e mais abundante do universo.",
    { label: "Royal Society of Chemistry · hidrogênio", url: "https://periodic-table.rsc.org/element/1/hydrogen" },
  ),
  number(
    "ciencia-ph-agua-pura",
    "Ciência",
    "Qual é o valor de pH da água pura, considerado neutro?",
    "pH 7",
    "Valor de referência na escala de pH, que vai de 0 a 14.",
    "Valores abaixo de 7 indicam substâncias ácidas e acima de 7, substâncias básicas.",
    { label: "EPA · escala de pH", url: "https://www3.epa.gov/acidrain/education/site_students/phscale.html" },
  ),
  number(
    "ciencia-cromossomos-humanos",
    "Ciência",
    "Quantos cromossomos tem, normalmente, uma célula humana?",
    "46 cromossomos",
    "Total em uma célula humana típica, organizados em 23 pares.",
    "Um dos 23 pares é o par de cromossomos sexuais, que difere entre homens e mulheres.",
    { label: "MedlinePlus Genetics · NIH", url: "https://medlineplus.gov/genetics/understanding/basics/howmanychromosomes/" },
  ),
  number(
    "ciencia-cromossomos-cao",
    "Ciência",
    "Quantos cromossomos tem, normalmente, uma célula de cachorro?",
    "78 cromossomos",
    "Total em uma célula típica de cão doméstico, organizados em 39 pares.",
    "É quase o dobro do número encontrado nas células humanas.",
    { label: "NHGRI · glossário genético", url: "https://www.genome.gov/genetics-glossary/Chromosome" },
  ),
  number(
    "ciencia-cromossomos-mosca-frutas",
    "Ciência",
    "Quantos cromossomos tem, normalmente, uma célula de mosca-das-frutas?",
    "8 cromossomos",
    "Total em uma célula típica da espécie Drosophila melanogaster, organizados em 4 pares.",
    "Essa mosca é um dos organismos mais usados em pesquisas de genética.",
    { label: "NHGRI · glossário genético", url: "https://www.genome.gov/genetics-glossary/Chromosome" },
  ),
  number(
    "ciencia-cromossomos-arroz",
    "Ciência",
    "Quantos cromossomos tem, normalmente, uma célula de uma planta de arroz?",
    "24 cromossomos",
    "Total em uma célula típica de arroz, organizados em 12 pares.",
    "O arroz é uma das plantas com genoma mais estudado entre os cereais.",
    { label: "NHGRI · glossário genético", url: "https://www.genome.gov/genetics-glossary/Chromosome" },
  ),
  number(
    "ciencia-vertebras-girafa",
    "Ciência",
    "Quantas vértebras cervicais (do pescoço) tem uma girafa?",
    "7 vértebras",
    "Contagem de vértebras do pescoço, independentemente do tamanho de cada uma.",
    "É o mesmo número de vértebras cervicais que um ser humano tem; a diferença é o tamanho de cada osso.",
    { label: "San Diego Zoo Wildlife Alliance · girafa", url: "https://animals.sandiegozoo.org/animals/giraffe" },
  ),
  number(
    "ciencia-planetas-sistema-solar",
    "Ciência",
    "Quantos planetas oficialmente reconhecidos existem no Sistema Solar?",
    "8 planetas",
    "Contagem segundo a definição de planeta adotada pela União Astronômica Internacional em 2006.",
    "Essa definição foi o que levou à reclassificação de Plutão como planeta anão.",
    { label: "NASA · planetas do Sistema Solar", url: "https://science.nasa.gov/solar-system/planets/" },
  ),
  number(
    "ciencia-primos-100",
    "Ciência",
    "Quantos números primos existem entre 1 e 100?",
    "25 números primos",
    "Contagem de primos no intervalo de 1 a 100, incluindo o 100 no limite.",
    "O primeiro é o 2 e o último nesse intervalo é o 97.",
    { label: "The Prime Pages · Universidade do Tennessee em Martin", url: "https://t5k.org/howmany.html" },
  ),
  number(
    "esporte-bolt-100m",
    "Esportes e recordes",
    "Qual foi o tempo do recorde mundial de Usain Bolt nos 100 metros rasos, em Berlim 2009?",
    "9,58 segundos",
    "Tempo eletrônico oficial da prova, com duas casas decimais.",
    "A marca foi cravada na final do Campeonato Mundial de Atletismo de 2009, com vento favorável de +0,9 m/s.",
    { label: "World Athletics · lista histórica dos 100m masculinos", url: "https://worldathletics.org/records/all-time-toplists/sprints/100-metres/outdoor/men/senior" },
  ),
  number(
    "esporte-bolt-200m",
    "Esportes e recordes",
    "Qual foi o tempo do recorde mundial de Usain Bolt nos 200 metros rasos, também em Berlim 2009?",
    "19,19 segundos",
    "Tempo eletrônico oficial da prova, com duas casas decimais.",
    "Foi quebrado poucos dias depois do recorde dos 100 metros, no mesmo Mundial de Atletismo.",
    { label: "World Athletics · lista histórica dos 200m masculinos", url: "https://worldathletics.org/records/all-time-toplists/sprints/200-metres/outdoor/men/senior" },
  ),
  number(
    "esporte-flojo-100m",
    "Esportes e recordes",
    "Quantos segundos levou Florence Griffith-Joyner para vencer os 100 metros rasos femininos em 1988, recorde mundial ainda vigente?",
    "10,49 segundos",
    "Tempo oficial nos Trials olímpicos dos Estados Unidos, em Indianápolis.",
    "É o recorde mundial feminino mais antigo ainda em vigor no atletismo em pista.",
    { label: "World Athletics · lista histórica dos 100m femininos", url: "https://worldathletics.org/records/all-time-toplists/sprints/100-metres/outdoor/women/senior" },
  ),
  number(
    "esporte-phelps-medalhas",
    "Esportes e recordes",
    "Quantas medalhas olímpicas no total Michael Phelps conquistou ao longo da carreira?",
    "28 medalhas",
    "Soma de ouros, pratas e bronzes em cinco edições dos Jogos Olímpicos, até 2016.",
    "Ele é o atleta mais condecorado da história dos Jogos Olímpicos, em qualquer modalidade.",
    { label: "Olympics.com · perfil de Michael Phelps", url: "https://www.olympics.com/en/athletes/michael-phelps-ii" },
  ),
  number(
    "esporte-phelps-ouros",
    "Esportes e recordes",
    "Quantas medalhas de ouro olímpicas Michael Phelps conquistou ao todo?",
    "23 medalhas de ouro",
    "Soma de ouros individuais e por equipe nas cinco edições em que competiu.",
    "Nenhum outro atleta olímpico chegou perto desse número de ouros somados.",
    { label: "Team USA · perfil de Michael Phelps", url: "https://www.teamusa.com/profiles/michael-phelps" },
  ),
  number(
    "esporte-isner-mahut",
    "Esportes e recordes",
    "Quantas horas e minutos durou a partida mais longa da história do tênis, entre John Isner e Nicolas Mahut em Wimbledon 2010?",
    "11 horas e 5 minutos",
    "Duração total do confronto, disputado ao longo de três dias.",
    "O quinto e decisivo set sozinho terminou 70 a 68 em games, somando 138 games só nele.",
    { label: "Olympics.com · a partida mais longa da história do tênis", url: "https://www.olympics.com/en/news/longest-tennis-match-history-grand-slam-record" },
  ),
  number(
    "esporte-chess-269",
    "Esportes e recordes",
    "Quantos lances teve a partida de xadrez com mais movimentos já registrada, disputada entre Ivan Nikolić e Goran Arsović em 1989?",
    "269 lances",
    "Contagem de lances até o empate, em partida oficial na Iugoslávia.",
    "Uma regra especial da época, que permitia até 100 lances sem captura em certos finais, tornou possível essa duração; foi revogada em 1992.",
    { label: "Chess.com · a partida mais longa da história", url: "https://www.chess.com/blog/Sawbonez/how-long-is-too-long-269-moves-20-hours" },
  ),
  number(
    "esporte-chamberlain-100",
    "Esportes e recordes",
    "Quantos pontos Wilt Chamberlain marcou na partida histórica da NBA em 1962, recorde que segue invicto?",
    "100 pontos",
    "Total de pontos marcados por um único jogador em uma partida oficial da NBA.",
    "O jogo foi contra o New York Knicks, com vitória do Philadelphia Warriors por 169 a 147.",
    { label: "Wikipedia · Wilt Chamberlain's 100-point game", url: "https://en.wikipedia.org/wiki/Wilt_Chamberlain%27s_100-point_game" },
  ),
  number(
    "esporte-sotomayor-altura",
    "Esportes e recordes",
    "Qual é o recorde mundial masculino de salto em altura, estabelecido por Javier Sotomayor em 1993?",
    "2,45 metros",
    "Salto ao ar livre; recorde ainda vigente em 2026.",
    "A marca foi batida em Salamanca, na Espanha, e é um dos recordes mais antigos do atletismo mundial.",
    { label: "World Athletics · lista histórica do salto em altura masculino", url: "https://worldathletics.org/records/all-time-toplists/jumps/high-jump/outdoor/men/senior" },
  ),
  number(
    "esporte-powell-distancia",
    "Esportes e recordes",
    "Qual é o recorde mundial masculino de salto em distância, batido por Mike Powell em 1991?",
    "8,95 metros",
    "Salto ao ar livre; recorde ainda vigente em 2026.",
    "Superou o recorde anterior de Bob Beamon, que durava desde 1968.",
    { label: "World Athletics · lista histórica do salto em distância masculino", url: "https://worldathletics.org/records/all-time-toplists/jumps/long-jump/outdoor/men/senior" },
  ),
  number(
    "esporte-zelezny-dardo",
    "Esportes e recordes",
    "Qual é o recorde mundial masculino de lançamento de dardo, de Jan Železný?",
    "98,48 metros",
    "Lançamento ao ar livre, estabelecido em 1996; ainda vigente em 2026.",
    "Foi conquistado em Jena, na Alemanha, e é um dos recordes mais duradouros dos lançamentos.",
    { label: "World Athletics · lista histórica do dardo masculino", url: "https://worldathletics.org/records/all-time-toplists/throws/javelin-throw/outdoor/men/senior" },
  ),
  number(
    "esporte-alekna-disco",
    "Esportes e recordes",
    "Qual é o recorde mundial masculino de lançamento de disco, batido por Mykolas Alekna em 2025?",
    "75,56 metros",
    "Lançamento ao ar livre; superou a marca anterior, que durava desde 1986.",
    "O recorde foi estabelecido nos Estados Unidos, em Oklahoma.",
    { label: "World Athletics · lista histórica do disco masculino", url: "https://worldathletics.org/records/all-time-toplists/throws/discus-throw/outdoor/men/senior" },
  ),
  number(
    "esporte-crouser-peso",
    "Esportes e recordes",
    "Qual é o recorde mundial masculino de arremesso de peso, de Ryan Crouser?",
    "23,56 metros",
    "Arremesso ao ar livre, estabelecido em 2023; ainda vigente em 2026.",
    "Foi o próprio Crouser quem superou seu recorde mundial anterior, de 2021.",
    { label: "World Athletics · lista histórica do arremesso de peso masculino", url: "https://worldathletics.org/records/all-time-toplists/throws/shot-put/outdoor/men/senior" },
  ),
  number(
    "esporte-duplantis-vara",
    "Esportes e recordes",
    "Qual é o recorde mundial masculino de salto com vara, batido por Armand Duplantis em março de 2026?",
    "6,31 metros",
    "Salto ao ar livre; foi a 15ª vez que o próprio atleta bateu o recorde mundial da prova.",
    "A marca foi estabelecida na Suécia, em evento batizado com o apelido do atleta.",
    { label: "World Athletics · lista histórica do salto com vara masculino", url: "https://worldathletics.org/records/all-time-toplists/jumps/pole-vault/outdoor/men/senior" },
  ),
  number(
    "esporte-natacao-100-livre",
    "Esportes e recordes",
    "Qual é o recorde mundial masculino dos 100 metros livre na natação, batido nos Jogos Olímpicos de Paris 2024?",
    "46,40 segundos",
    "Prova em piscina de 50 metros (curso longo).",
    "A marca foi estabelecida por um nadador chinês na final olímpica, superando o recorde anterior de Caeleb Dressel.",
    { label: "Wikipedia · recordes mundiais da natação", url: "https://en.wikipedia.org/wiki/List_of_world_records_in_swimming" },
  ),
  number(
    "esporte-ganna-hora",
    "Esportes e recordes",
    "Quantos quilômetros Filippo Ganna percorreu em uma hora para bater o Hour Record do ciclismo, em 2022?",
    "56,792 km",
    "Recorde da hora em pista coberta; distância total percorrida em 60 minutos.",
    "O recorde foi estabelecido no velódromo de Grenchen, na Suíça.",
    { label: "Wikipedia · Hour Record (ciclismo)", url: "https://en.wikipedia.org/wiki/Hour_record" },
  ),
  number(
    "esporte-f1-titulos",
    "Esportes e recordes",
    "Quantos títulos mundiais de pilotos da Fórmula 1 têm os recordistas Michael Schumacher e Lewis Hamilton?",
    "7 títulos",
    "Contagem de campeonatos mundiais de pilotos conquistados por cada um deles, individualmente.",
    "Os dois pilotos dividem o recorde; nenhum outro piloto da história chegou a esse número.",
    { label: "Wikipedia · lista de campeões mundiais de pilotos de F1", url: "https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions" },
  ),
  number(
    "esporte-lara-cricket",
    "Esportes e recordes",
    "Qual foi a maior pontuação individual da história do críquete em partidas de Test, feita por Brian Lara em 2004?",
    "400 runs, invicto",
    "Pontuação em uma única entrada (innings), em partida oficial de Test.",
    "Foi contra a Inglaterra, e é a única quádrupla centena da história do Test cricket.",
    { label: "Wikipedia · centuries de Brian Lara", url: "https://en.wikipedia.org/wiki/List_of_international_cricket_centuries_by_Brian_Lara" },
  ),
  number(
    "esporte-bonds-homeruns",
    "Esportes e recordes",
    "Quantos home runs Barry Bonds bateu na temporada de 2001, recorde histórico de uma única temporada da MLB?",
    "73 home runs",
    "Total de rebatidas para fora do campo em uma única temporada regular.",
    "O recorde segue vigente em 2026, mais de duas décadas depois.",
    { label: "Wikipedia · Barry Bonds", url: "https://en.wikipedia.org/wiki/Barry_Bonds" },
  ),
  number(
    "esporte-thompson-gols",
    "Esportes e recordes",
    "Quantos gols Archie Thompson marcou sozinho na goleada da Austrália sobre Samoa Americana, em 2001?",
    "13 gols",
    "Gols marcados por um único jogador em uma única partida internacional oficial.",
    "A partida terminou 31 a 0, também recorde de maior goleada da história do futebol internacional masculino.",
    { label: "Wikipedia · Austrália 31–0 Samoa Americana", url: "https://en.wikipedia.org/wiki/Australia_31%E2%80%930_American_Samoa" },
  ),
  number(
    "esporte-cam-little-fieldgoal",
    "Esportes e recordes",
    "Quantas jardas teve o field goal mais longo da história da NFL, marcado por Cam Little em novembro de 2025?",
    "68 jardas",
    "Chute oficial válido em jogo de temporada regular da NFL.",
    "Superou o recorde anterior de 66 jardas, que pertencia a Justin Tucker desde 2021.",
    { label: "Wikipedia · Cam Little", url: "https://en.wikipedia.org/wiki/Cam_Little" },
  ),
  number(
    "esporte-swahn-idade",
    "Esportes e recordes",
    "Com quantos anos completos o sueco Oscar Swahn conquistou seu último ouro olímpico, em 1912, tornando-se o medalhista de ouro mais velho da história?",
    "64 anos",
    "Idade completa no momento da conquista; conte apenas anos completos.",
    "Ele competiu no tiro esportivo e ainda ganhou uma medalha de prata em 1920, aos 72 anos.",
    { label: "Wikipedia · Oscar Swahn", url: "https://en.wikipedia.org/wiki/Oscar_Swahn" },
  ),
  number(
    "bizarro-hotdogs",
    "Curiosidades",
    "Quantos cachorros-quentes Joey Chestnut engoliu em 10 minutos para vencer o concurso de Nathan's Famous em 2021?",
    "76 cachorros-quentes",
    "Contagem oficial do concurso de comer cachorros-quentes de Nathan's Famous, em Coney Island, no dia 4 de julho de 2021 (categoria masculina).",
    "Isso inclui os pães. Fazendo as contas, dá quase um cachorro-quente inteiro a cada 8 segundos, sem parar.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/546576-most-hot-dogs-eaten-at-a-nathans-hot-dog-eating-contest-male" },
  ),
  number(
    "bizarro-unhas",
    "Curiosidades",
    "Quantos centímetros mediam, somadas, as cinco unhas da mão esquerda do indiano Shridhar Chillal, antes de ele finalmente cortá-las?",
    "909,6 centímetros",
    "Soma do comprimento das cinco unhas da mão esquerda, medida em 17 de novembro de 2014, poucos anos antes do corte definitivo.",
    "Ele parou de cortar as unhas em 1952, depois de ser castigado por um professor por causa de uma unha quebrada. Só a do polegar tinha quase 2 metros.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/67701-longest-fingernails-single-hand-ever" },
  ),
  number(
    "bizarro-pizza",
    "Curiosidades",
    "Qual é a área, em metros quadrados, da maior pizza já assada no mundo?",
    "1.296,72 m²",
    "Pizza feita em Los Angeles, nos EUA, em janeiro de 2023, medida e homologada pelo Guinness.",
    "Para cobri-la foram usados quase 4 toneladas de queijo e mais de 630 mil rodelas de pepperoni.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/largest-pizza" },
  ),
  number(
    "bizarro-thriller",
    "Curiosidades",
    "Quantas pessoas dançaram 'Thriller', de Michael Jackson, ao mesmo tempo para bater o recorde mundial na Cidade do México?",
    "13.597 pessoas",
    "Evento realizado no Monumento à Revolução, na Cidade do México, em 29 de agosto de 2009.",
    "Boa parte da multidão estava maquiada e vestida de zumbi, exatamente como no clipe original.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/largest-thriller-dance" },
  ),
  number(
    "bizarro-gato-dedos",
    "Curiosidades",
    "Quantos dedos no total tem o gato com mais dedos do mundo, somando as quatro patas?",
    "28 dedos",
    "Recorde de dedos (polidactilia) em um gato, com sete dedos em cada uma das quatro patas.",
    "Um gato comum tem 18 dedos no total. Esses 'gatos de Hemingway' nascem com dedos extras nas patas, parecendo que usam luvas de boxe.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/news/2026/6/nine-lives-10-extra-toes-paw-some-michigan-kitty-ties-record-for-the-most-toes-on-a-cat" },
  ),
  number(
    "bizarro-arroto",
    "Curiosidades",
    "Quantos decibéis atingiu o arroto mais alto já registrado por um homem?",
    "112,4 decibéis",
    "Recorde masculino, medido em Darwin, na Austrália, em 29 de julho de 2021.",
    "O recordista treinou o talento por mais de 45 anos antes de tentar oficialmente. O volume é comparável ao de uma motosserra ligada.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/80129-loudest-burp-male" },
  ),
  number(
    "bizarro-bigode",
    "Curiosidades",
    "Quantos centímetros mede o bigode mais longo entre pessoas vivas atualmente?",
    "63,5 centímetros",
    "Medido durante o Campeonato Nacional Norte-Americano de Barba e Bigode, em Casper, no Wyoming, em novembro de 2022.",
    "O dono do bigode levou 30 anos sem cortar um fio para chegar a esse tamanho.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/689505-longest-moustache-on-a-living-person-male" },
  ),
  number(
    "bizarro-tatuado",
    "Curiosidades",
    "Que porcentagem do corpo de Lucky Diamond Rich, o homem mais tatuado do mundo, está coberta de tinta?",
    "100% do corpo",
    "Cobertura total do corpo, incluindo dentro das orelhas, pálpebras e gengivas.",
    "Como ele já estava 100% coberto, continuou tatuando por cima: camadas de tinta preta, depois branca e colorida, sobre as tatuagens antigas.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/most-tattooed-person" },
  ),
  number(
    "bizarro-guerra-travesseiros",
    "Curiosidades",
    "Quantas pessoas participaram da maior guerra de travesseiros já registrada no mundo?",
    "7.681 pessoas",
    "Evento organizado pela empresa MyPillow em Minneapolis, Minnesota, EUA, em 18 de maio de 2018.",
    "A batalha de travesseiros aconteceu dentro de um festival cristão com até 60 mil pessoas presentes.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/largest-pillow-fight" },
  ),
  number(
    "bizarro-lingua",
    "Curiosidades",
    "Quantos centímetros mede a língua humana mais longa já registrada, do meio do lábio superior fechado até a ponta?",
    "10,1 centímetros",
    "Medição feita em Salinas, na Califórnia, EUA, em 27 de novembro de 2012.",
    "O dono do recorde afirma conseguir segurar cinco rosquinhas (donuts) empilhadas na língua ao mesmo tempo.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/longest-tongue" },
  ),
  number(
    "bizarro-carregar-esposa",
    "Curiosidades",
    "Em quantos segundos uma dupla completou o percurso mais rápido já registrado no Campeonato Mundial de Carregar a Esposa, na Finlândia?",
    "56,9 segundos",
    "Percurso oficial de 253,5 metros com obstáculos (incluindo um trecho na água), em Sonkajärvi, Finlândia, em 1º de julho de 2006.",
    "O prêmio para os vencedores da competição é o peso da 'esposa' carregada, em cerveja.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/68165-fastest-wife-carrying-championships" },
  ),
  number(
    "bizarro-bosta",
    "Curiosidades",
    "Qual é a maior distância já alcançada no lançamento de bosta de vaca seca, segundo o Guinness?",
    "81,1 metros",
    "Categoria 'sem esferificação, 100% orgânico'; recorde alcançado no Mountain Festival, em Tehachapi, Califórnia, EUA, em 14 de agosto de 1981.",
    "Ou seja: quase o tamanho de um campo de futebol inteiro, arremessado à mão.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/farthest-cow-pat-toss" },
  ),
  number(
    "bizarro-bambole",
    "Curiosidades",
    "Quantos bambolês uma única pessoa conseguiu girar ao mesmo tempo no corpo, batendo o recorde mundial?",
    "200 bambolês",
    "Recorde de bambolês girados simultaneamente por uma pessoa, em Los Angeles, EUA, em 25 de novembro de 2015.",
    "Foi a quarta vez que a mesma artista quebrou o próprio recorde mundial de bambolês.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/23744-most-hula-hoops-spun-simultaneously" },
  ),
  number(
    "bizarro-domino",
    "Curiosidades",
    "Quantas peças de dominó uma única pessoa conseguiu derrubar em sequência, sozinha, para bater o recorde mundial?",
    "321.197 peças",
    "Recorde individual (não em equipe), alcançado em Pequim, China, em 31 de dezembro de 2011.",
    "Uma peça errada no caminho e seria preciso montar tudo de novo — imagine a paciência necessária.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/most-dominoes-toppled-by-an-individual" },
  ),
  number(
    "bizarro-boneco-neve",
    "Curiosidades",
    "Quantos metros de altura tinha a maior figura de neve já construída no mundo (uma 'mulher de neve' batizada de Olympia)?",
    "37,21 metros",
    "Construída por moradores de Bethel e cidades vizinhas, no estado do Maine, EUA, concluída em 26 de fevereiro de 2008.",
    "Levou cerca de um mês inteiro de trabalho e toneladas de neve para ficar pronta.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/tallest-snowman" },
  ),
  number(
    "bizarro-superheroes",
    "Curiosidades",
    "Quantas pessoas se vestiram de super-heróis ao mesmo tempo em Los Angeles, em 2010, para bater um recorde mundial?",
    "1.580 pessoas",
    "Evento promocional do filme de animação 'Megamente' (Megamind), em Los Angeles, EUA, em 2 de outubro de 2010.",
    "A rua ficou cheia de capas e máscaras improvisadas, tudo para promover um filme sobre um supervilão.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/most-people-dressed-as-superheroes" },
  ),
  number(
    "bizarro-smurfs",
    "Curiosidades",
    "Quantas pessoas se pintaram e se vestiram de Smurfs ao mesmo tempo para o recorde mundial batido na França, em 2025?",
    "3.076 pessoas",
    "Evento na cidade de Landerneau, França, em 17 de maio de 2025.",
    "Foi a terceira tentativa da cidade: uma tinha sido cancelada por falta de provas e outra estragada pela chuva.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/most-people-dressed-as-smurfs" },
  ),
  number(
    "bizarro-vermes",
    "Curiosidades",
    "Quantas minhocas uma competidora conseguiu 'encantar' para saírem sozinhas da terra, em 30 minutos, no Mundial de Encantamento de Minhocas?",
    "567 minhocas",
    "Competidoras têm 30 minutos para atrair o máximo de minhocas de uma área de 3 m², sem usar produtos químicos nem escavar. Recorde de 27 de junho de 2009, no Reino Unido.",
    "A técnica vencedora costuma ser fincar um garfo de jardim na terra e fazê-lo vibrar, imitando o som da chuva.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/most-worms-charmed" },
  ),
  number(
    "bizarro-marshmallow",
    "Curiosidades",
    "Quantos marshmallows uma pessoa conseguiu pegar com a boca, lançados por um parceiro, em um único minuto?",
    "58 marshmallows",
    "Recorde estabelecido em Boise, Idaho, EUA, em 2 de outubro de 2021, com um marshmallow lançado por vez.",
    "Isso dá quase um marshmallow engolido por segundo, direto no ar, sem deixar cair.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/429833-most-marshmallows-caught-by-mouth-in-one-minute" },
  ),
  number(
    "bizarro-cachorro-velho",
    "Curiosidades",
    "Quantos anos viveu Bluey, a cadela australiana reconhecida pelo Guinness como o cão mais velho da história?",
    "29 anos e 5 meses",
    "Cadela da raça Australian Cattle Dog, que viveu entre 1910 e 1939, na Austrália.",
    "Ela recuperou o título em 2024, depois que outro cão, batizado Bobi, teve o recorde cassado por falta de provas sobre sua idade real.",
    { label: "ABC News (Austrália)", url: "https://www.abc.net.au/news/2024-03-03/bluey-rochester-dog-reclaims-guinness-world-record-as-oldest-dog/103513372" },
  ),
  number(
    "bizarro-caroco-cereja",
    "Curiosidades",
    "Qual é a maior distância já alcançada ao lançar, com a boca, um caroço de cereja em competição oficial?",
    "28,51 metros",
    "Recorde da modalidade oficial (sem estilo livre), no Campeonato Internacional de Lançamento de Caroço de Cereja, em Eau Claire, Michigan, EUA, em 2003.",
    "No mesmo dia, o mesmo competidor lançou um caroço ainda mais longe na categoria livre, mas essa marca não conta como recorde oficial.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/cherry-stone-spitting-greatest-distance" },
  ),
  number(
    "bizarro-queijo",
    "Curiosidades",
    "Quantas vezes o mesmo competidor já venceu a tradicional corrida de rolar queijo morro abaixo, em Cooper's Hill, na Inglaterra?",
    "23 vitórias",
    "Vitórias somadas por um único corredor entre 2005 e 2022, na disputa anual realizada em Gloucestershire, Reino Unido.",
    "Na corrida, uma roda de queijo é solta morro abaixo e os competidores correm atrás dela — o queijo pode passar de 60 km/h e atropelar gente pelo caminho.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/754825-most-wins-of-a-cheese-rolling-race" },
  ),
  number(
    "bizarro-papai-noel",
    "Curiosidades",
    "Quantas pessoas se vestiram de Papai Noel ao mesmo tempo no maior encontro do tipo já registrado, na Índia?",
    "18.112 pessoas",
    "Evento de Natal realizado em Thrissur, no estado de Kerala, Índia, em 27 de dezembro de 2014.",
    "A reunião de Papais Noeis foi organizada para arrecadar fundos de caridade para famílias carentes da região.",
    { label: "Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/largest-gathering-of-santa-claus" },
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
  ranking(
    "musica-spotify-musicas-mais-streamed",
    "Música",
    "Quais são as 10 músicas mais streamed da história no Spotify?",
    "Global · streams totais acumulados · lista consultada em 13/09/2026 no Kworb (dados públicos do Spotify)",
    "Contagem é de streams totais (não de ouvintes únicos) desde o lançamento. Ranking muda diariamente; retrato do dia da consulta.",
    { label: "Kworb (dados Spotify)", url: "https://kworb.net/spotify/songs.html" },
    `Blinding Lights — The Weeknd|5.588.509.723 streams
Shape of You — Ed Sheeran|5.093.326.024 streams
Sweater Weather — The Neighbourhood|4.871.791.287 streams
Starboy — The Weeknd|4.753.179.012 streams
As It Was — Harry Styles|4.620.964.432 streams
One Dance — Drake|4.463.928.269 streams
Sunflower — Post Malone|4.456.037.465 streams
Someone You Loved — Lewis Capaldi|4.434.425.131 streams
Perfect — Ed Sheeran|4.107.485.004 streams
STAY — The Kid LAROI|4.072.100.605 streams`,
  ),
  ranking(
    "musica-spotify-artistas-mais-streamed",
    "Música",
    "Quais são os 10 artistas mais streamed da história no Spotify?",
    "Global · streams totais acumulados de todas as faixas · lista consultada em 13/09/2026 no Kworb (dados públicos do Spotify)",
    "Soma os streams de todas as músicas do artista, incluindo features quando creditado. Ranking muda diariamente; retrato do dia da consulta.",
    { label: "Kworb (dados Spotify)", url: "https://kworb.net/spotify/artists.html" },
    `Drake|140.941,9 milhões de streams
Taylor Swift|130.353,3 milhões de streams
Bad Bunny|129.501,0 milhões de streams
The Weeknd|97.846,9 milhões de streams
Justin Bieber|80.018,7 milhões de streams
Ariana Grande|70.580,5 milhões de streams
Kanye West|66.618,9 milhões de streams
Travis Scott|66.365,0 milhões de streams
Eminem|65.750,9 milhões de streams
Ed Sheeran|65.491,9 milhões de streams`,
  ),
  ranking(
    "musica-spotify-albuns-mais-streamed",
    "Música",
    "Quais são os 10 álbuns mais streamed da história no Spotify?",
    "Global · streams totais acumulados das faixas do álbum · lista consultada em 13/09/2026 no Kworb (dados públicos do Spotify)",
    "Reedições, versões deluxe e turnês em áudio contam como itens separados do álbum original. Ranking muda diariamente; retrato do dia da consulta.",
    { label: "Kworb (dados Spotify)", url: "https://kworb.net/spotify/albums.html" },
    `÷ (Divide) — Ed Sheeran|37.433.237.815 streams
Un Verano Sin Ti — Bad Bunny|24.229.302.186 streams
Dua Lipa — Dua Lipa|20.228.259.348 streams
Starboy — The Weeknd|19.870.367.326 streams
÷ (Divide, edição original) — Ed Sheeran|18.616.636.860 streams
SOUR — Olivia Rodrigo|17.857.448.497 streams
Radical Optimism (edição turnê) — Dua Lipa|17.738.197.435 streams
SOS Deluxe: LANA — SZA|16.891.539.082 streams
After Hours — The Weeknd|16.834.595.674 streams
Hollywood's Bleeding — Post Malone|15.946.910.565 streams`,
  ),
  ranking(
    "musica-spotify-monthly-listeners",
    "Música",
    "Quais são os 10 artistas com mais ouvintes mensais no Spotify?",
    "Global · ouvintes mensais (monthly listeners) · lista consultada em 13/09/2026 no Kworb (dados públicos do Spotify)",
    "Ouvintes mensais é uma métrica de audiência (pessoas únicas nos últimos 28 dias), diferente de streams totais ou seguidores. Varia diariamente conforme lançamentos e picos de popularidade.",
    { label: "Kworb (dados Spotify)", url: "https://kworb.net/spotify/listeners.html" },
    `Bruno Mars|132.330.870 ouvintes
Justin Bieber|117.372.717 ouvintes
Rihanna|116.402.088 ouvintes
The Weeknd|114.584.246 ouvintes
Taylor Swift|100.466.571 ouvintes
Lady Gaga|99.232.701 ouvintes
Shakira|97.211.458 ouvintes
Bad Bunny|96.995.126 ouvintes
Ariana Grande|95.975.504 ouvintes
Drake|95.555.146 ouvintes`,
  ),
  ranking(
    "musica-mais-premios-grammy",
    "Música",
    "Quais são os 10 artistas com mais prêmios Grammy vencidos na história?",
    "Carreira inteira, todas as categorias · lista consultada em 13/09/2026",
    "Inclui vencedores em categorias clássicas e instrumentais, não só pop; por isso nomes como o maestro Georg Solti e o compositor de trilhas John Williams aparecem ao lado de artistas pop.",
    { label: "Recording Academy (Grammy.com)", url: "https://www.grammy.com/news/who-are-the-top-grammy-awards-winners-of-all-time/" },
    `Beyoncé|35 prêmios
Georg Solti|31 prêmios
Quincy Jones|28 prêmios
Chick Corea|28 prêmios
Kendrick Lamar|27 prêmios
Alison Krauss|27 prêmios
John Williams|26 prêmios
Pierre Boulez|26 prêmios
Vladimir Horowitz|25 prêmios
Stevie Wonder|25 prêmios`,
  ),
  ranking(
    "musica-mais-indicacoes-grammy",
    "Música",
    "Quais são os 10 artistas com mais indicações ao Grammy na história?",
    "Carreira inteira, todas as categorias · lista consultada em 13/09/2026",
    "Conta indicações recebidas, não vitórias — um artista pode ter muitas indicações e poucos prêmios. Inclui compositores e maestros de trilha, não só artistas pop.",
    { label: "Wikipedia (Grammy Award records, citando a Recording Academy)", url: "https://en.wikipedia.org/wiki/List_of_Grammy_Award_records" },
    `Beyoncé|99 indicações
Jay-Z|89 indicações
Paul McCartney|84 indicações
Quincy Jones|80 indicações
Chick Corea|79 indicações
John Williams|77 indicações
Kanye West|76 indicações
Stevie Wonder|75 indicações
Georg Solti|74 indicações
Henry Mancini|72 indicações`,
  ),
  ranking(
    "musica-albuns-mais-vendidos-mundo",
    "Música",
    "Quais são os 10 álbuns mais vendidos da história no mundo todo?",
    "Vendas mundiais estimadas (todas as edições) · lista consultada em 13/09/2026",
    "Números são vendas reivindicadas pelas gravadoras/artistas, não uma certificação única e auditada globalmente — por isso variam entre fontes. Álbuns de trilha sonora com vários artistas também entram na lista.",
    { label: "Wikipedia (List of best-selling albums)", url: "https://en.wikipedia.org/wiki/List_of_best-selling_albums" },
    `Thriller — Michael Jackson|70 milhões
Back in Black — AC/DC|50 milhões
The Bodyguard (trilha sonora) — Whitney Houston e outros|45 milhões
The Dark Side of the Moon — Pink Floyd|45 milhões
Their Greatest Hits (1971–1975) — Eagles|44 milhões
Hotel California — Eagles|42 milhões
Come On Over — Shania Twain|40 milhões
Rumours — Fleetwood Mac|40 milhões
Bat Out of Hell — Meat Loaf|40 milhões
Saturday Night Fever (trilha sonora) — Bee Gees e outros|40 milhões`,
  ),
  ranking(
    "musica-artistas-mais-vendidos-mundo",
    "Música",
    "Quais são os 10 artistas com mais discos vendidos na história no mundo todo?",
    "Vendas mundiais estimadas, carreira inteira · lista consultada em 13/09/2026",
    "Números são vendas reivindicadas, somando álbuns e singles físicos e digitais desde o início da carreira; não são certificações auditadas por um único órgão global.",
    { label: "Wikipedia (List of best-selling music artists)", url: "https://en.wikipedia.org/wiki/List_of_best-selling_music_artists" },
    `The Beatles|600 milhões
Michael Jackson|500 milhões
Elvis Presley|500 milhões
Madonna|400 milhões
Elton John|300 milhões
Queen|300 milhões
Led Zeppelin|300 milhões
Pink Floyd|250 milhões
Rihanna|250 milhões
Eminem|220 milhões`,
  ),
  ranking(
    "musica-riaa-artistas-mais-certificados-eua",
    "Música",
    "Quais são os 10 artistas com mais unidades certificadas pela RIAA nos EUA?",
    "Estados Unidos · unidades certificadas equivalentes a álbum (vendas + streaming convertido) · até 30/11/2025",
    "'Unidades equivalentes a álbum' soma vendas físicas, downloads e uma conversão de streams — não é o mesmo que cópias físicas vendidas. É uma certificação só dos EUA, não mundial.",
    { label: "Wikipedia (citando certificações RIAA)", url: "https://en.wikipedia.org/wiki/List_of_highest-certified_music_artists_in_the_United_States" },
    `Garth Brooks|200 milhões de unidades
The Beatles|183 milhões de unidades
Elvis Presley|146,5 milhões de unidades
Eagles|120 milhões de unidades
Led Zeppelin|112,5 milhões de unidades
Taylor Swift|110 milhões de unidades
Michael Jackson|90 milhões de unidades
Billy Joel|89 milhões de unidades
AC/DC|84 milhões de unidades
Elton John|81 milhões de unidades`,
  ),
  ranking(
    "musica-riaa-singles-digitais-mais-certificados",
    "Música",
    "Quais são as 10 músicas com a maior certificação digital da RIAA nos EUA?",
    "Estados Unidos · nível de certificação digital (equivalente a vendas em unidades) · lista consultada em 13/09/2026",
    "Certificação digital soma vendas de download e uma conversão de streams em 'unidades', por faixas de multiplicador de Platina — por isso várias músicas empatam no mesmo patamar (ex.: 18x Platina).",
    { label: "Wikipedia (citando certificações RIAA)", url: "https://en.wikipedia.org/wiki/List_of_highest-certified_digital_singles_in_the_United_States" },
    `Just the Way You Are — Bruno Mars|21x Platina (210 milhões de unidades)
Tennessee Whiskey — Chris Stapleton|20x Platina (200 milhões de unidades)
Sunflower — Post Malone e Swae Lee|20x Platina (200 milhões de unidades)
Thinking Out Loud — Ed Sheeran|18x Platina (180 milhões de unidades)
Don't Stop Believin' — Journey|18x Platina (180 milhões de unidades)
All I Want for Christmas Is You — Mariah Carey|18x Platina (180 milhões de unidades)
Counting Stars — OneRepublic|18x Platina (180 milhões de unidades)
Closer — The Chainsmokers com Halsey|18x Platina (180 milhões de unidades)
Somebody That I Used to Know — Gotye com Kimbra|17x Platina (170 milhões de unidades)
Radioactive — Imagine Dragons|17x Platina (170 milhões de unidades)`,
  ),
  ranking(
    "musica-riaa-albuns-mais-certificados-eua",
    "Música",
    "Quais são os 10 álbuns individuais mais certificados pela RIAA nos Estados Unidos?",
    "Estados Unidos · unidades certificadas (vendas físicas e digitais) · lista consultada em 13/09/2026",
    "Ranking de álbuns individuais (não soma a carreira do artista). Diferente da lista mundial de vendas: aqui só conta certificação oficial da RIAA para o mercado americano.",
    { label: "Wikipedia (citando certificações RIAA)", url: "https://en.wikipedia.org/wiki/List_of_best-selling_albums_in_the_United_States" },
    `Their Greatest Hits (1971–1975) — Eagles|40 milhões de unidades
Thriller — Michael Jackson|34 milhões de unidades
Hotel California — Eagles|28 milhões de unidades
Back in Black — AC/DC|27 milhões de unidades
Led Zeppelin IV — Led Zeppelin|24 milhões de unidades
Rumours — Fleetwood Mac|21 milhões de unidades
Legend — Bob Marley and the Wailers|18 milhões de unidades
Appetite for Destruction — Guns N' Roses|18 milhões de unidades
Greatest Hits — Journey|18 milhões de unidades
No Fences — Garth Brooks|18 milhões de unidades`,
  ),
  ranking(
    "musica-mais-american-music-awards",
    "Música",
    "Quais são os 10 artistas com mais prêmios American Music Awards (AMA) vencidos?",
    "Carreira inteira, todas as categorias · lista consultada em 13/09/2026",
    "Conta o total de troféus vencidos ao longo da carreira, incluindo prêmios de gêneros específicos (country, R&B etc.), não só as categorias gerais mais divulgadas.",
    { label: "Wikipedia (citando recordes do American Music Awards)", url: "https://en.wikipedia.org/wiki/American_Music_Awards" },
    `Taylor Swift|40 prêmios
Michael Jackson|26 prêmios
Whitney Houston|22 prêmios
Kenny Rogers|19 prêmios
Justin Bieber|19 prêmios
Alabama|18 prêmios
Carrie Underwood|17 prêmios
Garth Brooks|17 prêmios
Bruno Mars|17 prêmios
Reba McEntire|14 prêmios`,
  ),
  ranking(
    "musica-billboard200-mais-numero-um",
    "Música",
    "Quais são os 10 artistas com mais álbuns número 1 na Billboard 200?",
    "Estados Unidos · parada Billboard 200 · lista consultada em 13/09/2026",
    "Conta álbuns creditados ao artista ou grupo como está na parada; não soma trabalhos solo com trabalhos de banda (ex.: Beatles não inclui os números 1 solo de Paul McCartney).",
    { label: "Wikipedia (Billboard 200)", url: "https://en.wikipedia.org/wiki/Billboard_200" },
    `The Beatles|19 álbuns número 1
Drake|15 álbuns número 1
Taylor Swift|15 álbuns número 1
Jay-Z|14 álbuns número 1
Future|12 álbuns número 1
Barbra Streisand|11 álbuns número 1
Bruce Springsteen|11 álbuns número 1
Eminem|11 álbuns número 1
Kanye West|11 álbuns número 1
Elvis Presley|10 álbuns número 1`,
  ),
  ranking(
    "musica-hot100-mais-semanas-numero-um",
    "Música",
    "Quais são as 10 músicas que mais tempo ficaram no topo da Billboard Hot 100?",
    "Estados Unidos · semanas consecutivas ou não no número 1 · lista consultada em 13/09/2026",
    "Semanas não precisam ser consecutivas (algumas músicas de Natal voltam ao topo todo ano e somam semanas ao longo dos anos). Existem várias músicas empatadas logo abaixo do top 10 mostrado aqui.",
    { label: "Wikipedia (Billboard Hot 100 chart achievements and milestones)", url: "https://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_chart_achievements_and_milestones" },
    `All I Want for Christmas Is You — Mariah Carey|22 semanas
Choosin' Texas — Ella Langley|21 semanas
Old Town Road — Lil Nas X com Billy Ray Cyrus|19 semanas
A Bar Song (Tipsy) — Shaboozey|19 semanas
One Sweet Day — Mariah Carey e Boyz II Men|16 semanas
Despacito — Luis Fonsi e Daddy Yankee com Justin Bieber|16 semanas
Last Night — Morgan Wallen|16 semanas
As It Was — Harry Styles|15 semanas
I Will Always Love You — Whitney Houston|14 semanas
I'll Make Love to You — Boyz II Men|14 semanas`,
  ),
  ranking(
    "musica-mais-latin-grammy",
    "Música",
    "Quais são os 10 artistas/produtores com mais prêmios Latin Grammy vencidos?",
    "Carreira inteira, apenas categorias competitivas · lista consultada em 13/09/2026",
    "Não conta prêmios honorários (como Pessoa do Ano). Compositores e produtores aparecem ao lado de artistas; Residente e Eduardo Cabra somam os prêmios ganhos como dupla Calle 13.",
    { label: "Wikipedia (Latin Grammy Award records)", url: "https://en.wikipedia.org/wiki/Latin_Grammy_Award_records" },
    `Edgar Barrera|29 prêmios
Residente|29 prêmios
Juan Luis Guerra|28 prêmios
Juanes|25 prêmios
Eduardo Cabra (Cabra)|24 prêmios
Alejandro Sanz|24 prêmios
Calle 13|22 prêmios
Allan Leschhorn|21 prêmios
Rafael Arcaute|21 prêmios
Natalia Lafourcade|20 prêmios`,
  ),
  ranking(
    "musica-singles-mais-vendidos-reino-unido",
    "Música",
    "Quais são os 10 singles mais vendidos da história no Reino Unido?",
    "Reino Unido · vendas físicas e digitais certificadas · lista consultada em 13/09/2026",
    "Conta vendas no mercado britânico (BPI/Official Charts), não streaming nem vendas mundiais. Vários lançamentos têm lado B ou dupla-face contado junto (ex.: Elton John, Queen, Wings).",
    { label: "Wikipedia (citando BPI/Official Charts Company)", url: "https://en.wikipedia.org/wiki/List_of_best-selling_singles_in_the_United_Kingdom" },
    `Something About the Way You Look Tonight / Candle in the Wind 1997 — Elton John|4.940.000 cópias
Do They Know It's Christmas? — Band Aid|3.830.000 cópias
Bohemian Rhapsody / These Are the Days of Our Lives — Queen|2.630.000 cópias
Mull of Kintyre / Girls' School — Wings|2.100.000 cópias
You're the One That I Want — John Travolta e Olivia Newton-John|2.080.000 cópias
Relax — Frankie Goes to Hollywood|2.066.230 cópias
Rivers of Babylon / Brown Girl in the Ring — Boney M.|2.032.656 cópias
Last Christmas / Everything She Wants — Wham!|1.931.000 cópias
Happy — Pharrell Williams|1.930.000 cópias
She Loves You — The Beatles|1.930.000 cópias`,
  ),
  ranking(
    "musica-albuns-mais-vendidos-reino-unido",
    "Música",
    "Quais são os 10 álbuns mais vendidos da história no Reino Unido?",
    "Reino Unido · vendas certificadas · lista consultada em 13/09/2026",
    "Conta vendas no mercado britânico (BPI/Official Charts), não vendas mundiais nem streaming. Coletâneas de grandes sucessos (greatest hits) contam como um álbum.",
    { label: "Wikipedia (citando BPI/Official Charts Company)", url: "https://en.wikipedia.org/wiki/List_of_best-selling_albums_in_the_United_Kingdom" },
    `Greatest Hits — Queen|7,8 milhões de cópias
Gold: Greatest Hits — ABBA|7,1 milhões de cópias
(What's the Story) Morning Glory? — Oasis|6,2 milhões de cópias
21 — Adele|5,7 milhões de cópias
Sgt. Pepper's Lonely Hearts Club Band — The Beatles|5,6 milhões de cópias
Rumours — Fleetwood Mac|5,1 milhões de cópias
The Dark Side of the Moon — Pink Floyd|5,0 milhões de cópias
Thriller — Michael Jackson|4,6 milhões de cópias
Legend — Bob Marley and the Wailers|4,6 milhões de cópias
Brothers in Arms — Dire Straits|4,6 milhões de cópias`,
  ),
  ranking(
    "musica-albuns-mais-vendidos-brasil",
    "Música",
    "Quais são os 10 álbuns mais vendidos da história no Brasil?",
    "Brasil · unidades certificadas pela Pro-Música Brasil · lista consultada em 13/09/2026",
    "Certificação brasileira é dada em faixas (cada Diamante = 250 mil unidades), por isso vários álbuns aparecem empatados no mesmo número redondo de cópias. Artistas nacionais dominam por causa do histórico forte de vendas físicas no país.",
    { label: "Wikipedia (citando certificações Pro-Música Brasil)", url: "https://en.wikipedia.org/wiki/List_of_best-selling_albums_in_Brazil" },
    `Roberto Carlos (1981) — Roberto Carlos|3.600.000 cópias
Xou da Xuxa 3 — Xuxa|3.000.000 cópias
Em Ritmo de Aventura (1967) — Roberto Carlos|3.000.000 cópias
Só Pra Contrariar (1997) — Só Pra Contrariar|3.000.000 cópias
Músicas para Louvar ao Senhor — Padre Marcelo Rossi|3.000.000 cópias
Um Sonhador — Leandro & Leonardo|3.000.000 cópias
Leandro & Leonardo (1990) — Leandro & Leonardo|3.000.000 cópias
Xegundo Xou da Xuxa — Xuxa|2.000.000 cópias
4º Xou da Xuxa — Xuxa|2.000.000 cópias
Xou da Xuxa — Xuxa|2.000.000 cópias`,
  ),
  ranking(
    "game-mais-vendidos-geral",
    "Games",
    "Quais são os 10 jogos mais vendidos de todos os tempos, somando todas as plataformas?",
    "Vendas vitalícias acumuladas em todas as plataformas · retrato consultado em 13/09/2026",
    "Tetris aparece em 1º somando todas as versões e plataformas desde 1988, incluindo celular; a Guinness World Records rejeita essa soma e credita o 1º lugar ao Minecraft. Mario Kart 8/Deluxe soma as versões de Wii U e Switch.",
    { label: "Wikipedia · jogos mais vendidos", url: "https://en.wikipedia.org/wiki/List_of_best-selling_video_games" },
    `Tetris|520 milhões
Minecraft|400 milhões
Grand Theft Auto V|230 milhões
Wii Sports|82,9 milhões
Mario Kart 8 / Deluxe|79,99 milhões
PUBG: Battlegrounds|75 milhões
Terraria|70 milhões
The Elder Scrolls V: Skyrim|65 milhões
The Witcher 3: Wild Hunt|65 milhões
Super Mario Bros.|58 milhões`,
  ),
  ranking(
    "game-consoles-mais-vendidos",
    "Games",
    "Quais são os 10 consoles de videogame mais vendidos da história?",
    "Unidades vendidas no mundo todo, consoles domésticos e portáteis juntos · retrato consultado em 13/09/2026",
    "Nintendo Switch e PlayStation 5 ainda estão em linha de produção e podem subir de posição. Game Boy e Game Boy Color são somados como uma só linha.",
    { label: "Wikipedia · consoles mais vendidos", url: "https://en.wikipedia.org/wiki/List_of_best-selling_game_consoles" },
    `PlayStation 2|160 milhões
Nintendo Switch|156,59 milhões
Nintendo DS|154,02 milhões
Game Boy / Game Boy Color|118,69 milhões
PlayStation 4|117,2 milhões
PlayStation (PS1)|102,49 milhões
Wii|101,63 milhões
PlayStation 5|95,3 milhões
PlayStation 3|87,4 milhões
Xbox 360|84 milhões`,
  ),
  ranking(
    "game-ps5-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do PlayStation 5?",
    "Cópias vendidas em todas as versões (física e digital) · somente PS5 · retrato consultado em 13/09/2026",
    "Jogos ainda à venda podem subir de posição. Números incluem versões cross-gen quando vendidas como SKU de PS5.",
    { label: "Wikipedia · mais vendidos de PS5", url: "https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_5_video_games" },
    `Marvel's Spider-Man 2|17 milhões
Gran Turismo 7|8,91 milhões
EA Sports FC 26|7,04 milhões
Resident Evil 4|6,968 milhões
Black Myth: Wukong|6 milhões
Helldivers 2|5,6 milhões
Forza Horizon 5|5,3 milhões
God of War Ragnarök|4,182 milhões
Ghost of Yōtei|4 milhões
Ratchet & Clank: Rift Apart|3,97 milhões`,
  ),
  ranking(
    "game-switch-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do Nintendo Switch?",
    "Unidades vendidas no mundo todo, vitalícias · somente Switch · dados oficiais da Nintendo em 30/06/2026",
    "Fonte oficial do fabricante. Jogos ainda em vendas ativas, como Mario Kart 8 Deluxe e os Pokémon recentes, tendem a continuar subindo.",
    { label: "Nintendo · dados financeiros de software", url: "https://www.nintendo.co.jp/ir/en/finance/software/switch.html" },
    `Mario Kart 8 Deluxe|71,53 milhões
Animal Crossing: New Horizons|50,29 milhões
Super Smash Bros. Ultimate|38,14 milhões
The Legend of Zelda: Breath of the Wild|34,06 milhões
Super Mario Odyssey|30,80 milhões
Pokémon Scarlet/Violet|28,46 milhões
Pokémon Sword/Shield|27,26 milhões
The Legend of Zelda: Tears of the Kingdom|22,71 milhões
Super Mario Party|21,36 milhões
New Super Mario Bros. U Deluxe|19,10 milhões`,
  ),
  ranking(
    "game-ps4-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do PlayStation 4?",
    "Cópias vendidas apenas na versão de PS4 · retrato consultado em 13/09/2026",
    "Conta só a SKU de PS4; vendas do mesmo jogo em outras plataformas não entram na conta.",
    { label: "Wikipedia · mais vendidos de PS4", url: "https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_4_video_games" },
    `Grand Theft Auto V|29,52 milhões
Marvel's Spider-Man|22,68 milhões
God of War|21,02 milhões
Horizon Zero Dawn|19,29 milhões
Uncharted 4: A Thief's End|18,65 milhões
The Last of Us Remastered|18,2 milhões
Minecraft: PlayStation 4 Edition|17 milhões
Call of Duty: Black Ops III|15 milhões
Call of Duty: WWII|13,4 milhões
Gran Turismo Sport|12,72 milhões`,
  ),
  ranking(
    "game-ps3-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do PlayStation 3?",
    "Cópias vendidas apenas na versão de PS3 · retrato consultado em 13/09/2026",
    "Conta só a SKU de PS3; a mesma franquia pode ter versões de PS3 e PS4 contadas separadamente em outros rankings.",
    { label: "Wikipedia · mais vendidos de PS3", url: "https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_3_video_games" },
    `Grand Theft Auto V|24,66 milhões
Gran Turismo 5|11,95 milhões
Uncharted 3: Drake's Deception|9 milhões
The Last of Us|8,4 milhões
Uncharted 2: Among Thieves|6,5 milhões
Metal Gear Solid 4: Guns of the Patriots|6 milhões
Batman: Arkham City|5,48 milhões
Gran Turismo 5 Prologue|5,35 milhões
Gran Turismo 6|5,22 milhões
God of War III|5,18 milhões`,
  ),
  ranking(
    "game-ps2-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do PlayStation 2?",
    "Cópias vendidas apenas na versão de PS2 · retrato consultado em 13/09/2026",
    "Console mais vendido da história; conta só a SKU de PS2.",
    { label: "Wikipedia · mais vendidos de PS2", url: "https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_2_video_games" },
    `Grand Theft Auto: San Andreas|17,33 milhões
Gran Turismo 3: A-Spec|14,89 milhões
Grand Theft Auto: Vice City|14,2 milhões
Gran Turismo 4|11,76 milhões
Grand Theft Auto III|11,6 milhões
Tekken 5|9,43 milhões
Final Fantasy X|8,60 milhões
Metal Gear Solid 2: Sons of Liberty|7,03 milhões
Final Fantasy XII|6,40 milhões
Kingdom Hearts|6,30 milhões`,
  ),
  ranking(
    "game-ps1-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do PlayStation original (PS1)?",
    "Cópias vendidas apenas na versão de PS1 · retrato consultado em 13/09/2026",
    "Conta só a SKU do PlayStation original, lançado em 1994.",
    { label: "Wikipedia · mais vendidos de PS1", url: "https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_video_games" },
    `Gran Turismo|10,85 milhões
Final Fantasy VII|10,02 milhões
Gran Turismo 2|9,37 milhões
Final Fantasy VIII|8,6 milhões
Tekken 3|8,3 milhões
Harry Potter and the Philosopher's Stone|8 milhões
Crash Bandicoot 2: Cortex Strikes Back|7,58 milhões
Crash Bandicoot: Warped|7,13 milhões
Tomb Raider|7,1 milhões
Metal Gear Solid|7 milhões`,
  ),
  ranking(
    "game-xbox360-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do Xbox 360?",
    "Cópias vendidas apenas na versão de Xbox 360 · retrato consultado em 13/09/2026",
    "Kinect Adventures! liderava porque vinha empacotado junto com o acessório Kinect.",
    { label: "Wikipedia · mais vendidos de Xbox 360", url: "https://en.wikipedia.org/wiki/List_of_best-selling_Xbox_360_video_games" },
    `Kinect Adventures!|24 milhões
Grand Theft Auto V|22,95 milhões
Minecraft: Xbox 360 Edition|22 milhões
Call of Duty: Modern Warfare 3|14,72 milhões
Call of Duty: Black Ops|14,55 milhões
Halo 3|14,5 milhões
Call of Duty: Black Ops II|13,7 milhões
The Elder Scrolls V: Skyrim|13,7 milhões
Grand Theft Auto IV|11,01 milhões
Call of Duty: Ghosts|10,16 milhões`,
  ),
  ranking(
    "game-xboxone-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do Xbox One?",
    "Cópias vendidas apenas na versão de Xbox One · retrato consultado em 13/09/2026",
    "A Microsoft divulga poucos números oficiais; a lista reúne as melhores estimativas públicas disponíveis.",
    { label: "Wikipedia · mais vendidos de Xbox One", url: "https://en.wikipedia.org/wiki/List_of_best-selling_Xbox_One_video_games" },
    `Grand Theft Auto V|10,98 milhões
Forza Horizon 4|10 milhões
PUBG: Battlegrounds|9 milhões
Call of Duty: Black Ops III|7,37 milhões
Call of Duty: WWII|6,23 milhões
Call of Duty: Advanced Warfare|5,22 milhões
Halo 5: Guardians|5 milhões
Call of Duty: Infinite Warfare|4,79 milhões
The Witcher 3: Wild Hunt|4,3 milhões
Dead Rising 3|4,1 milhões`,
  ),
  ranking(
    "game-wii-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do Nintendo Wii?",
    "Cópias vendidas apenas na versão de Wii · retrato consultado em 13/09/2026",
    "Wii Sports vinha empacotado com o console em quase todos os mercados, o que explica boa parte do seu volume.",
    { label: "Wikipedia · mais vendidos de Wii", url: "https://en.wikipedia.org/wiki/List_of_best-selling_Wii_video_games" },
    `Wii Sports|82,90 milhões
Mario Kart Wii|37,38 milhões
Wii Sports Resort|33,14 milhões
New Super Mario Bros. Wii|30,32 milhões
Wii Play|28,02 milhões
Wii Fit|22,67 milhões
Wii Fit Plus|21,13 milhões
Super Smash Bros. Brawl|13,32 milhões
Super Mario Galaxy|12,80 milhões
Just Dance 3|9,92 milhões`,
  ),
  ranking(
    "game-gamecube-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do Nintendo GameCube?",
    "Cópias vendidas apenas na versão de GameCube · retrato consultado em 13/09/2026",
    "Console de 2001 com catálogo pequeno perto de Wii e Switch, então os números totais são bem menores.",
    { label: "Wikipedia · mais vendidos de GameCube", url: "https://en.wikipedia.org/wiki/List_of_best-selling_GameCube_video_games" },
    `Super Smash Bros. Melee|7,41 milhões
Mario Kart: Double Dash!!|6,88 milhões
Super Mario Sunshine|5,91 milhões
The Legend of Zelda: The Wind Waker|4,43 milhões
Luigi's Mansion|3,33 milhões
Metroid Prime|2,84 milhões
Animal Crossing|2,7 milhões
Mario Party 4|2,46 milhões
Pokémon Colosseum|2,41 milhões
Mario Party 5|2,17 milhões`,
  ),
  ranking(
    "game-nds-mais-vendidos",
    "Games",
    "Quais são os 10 jogos mais vendidos do Nintendo DS?",
    "Cópias vendidas apenas na versão de Nintendo DS · retrato consultado em 13/09/2026",
    "Nintendogs soma todas as versões (raças) do jogo lançadas no portátil.",
    { label: "Wikipedia · mais vendidos de Nintendo DS", url: "https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_DS_video_games" },
    `New Super Mario Bros.|30,80 milhões
Nintendogs (todas as versões)|23,96 milhões
Mario Kart DS|23,60 milhões
Brain Age: Train Your Brain in Minutes a Day!|19,01 milhões
Pokémon Diamond/Pearl|17,67 milhões
Pokémon Black/White|15,64 milhões
Brain Age 2: More Training in Minutes a Day!|14,88 milhões
Pokémon HeartGold/SoulSilver|12,72 milhões
Animal Crossing: Wild World|11,75 milhões
Super Mario 64 DS|11,06 milhões`,
  ),
  ranking(
    "game-pc-mais-vendidos",
    "Games",
    "Quais são os 10 jogos de PC mais vendidos de todos os tempos?",
    "Cópias vendidas/distribuídas apenas para computador (Windows/macOS/Linux) · retrato consultado em 13/09/2026",
    "Jogos com componente forte de assinatura ou free-to-play contam só as cópias vendidas, não contas ativas. Nem toda editora divulga números de PC, então a lista reflete o que é publicamente auditável.",
    { label: "Wikipedia · mais vendidos de PC", url: "https://en.wikipedia.org/wiki/List_of_best-selling_PC_video_games" },
    `PUBG: Battlegrounds|41 milhões
Minecraft|33 milhões
Terraria|32 milhões
Stardew Valley|26 milhões
Garry's Mod|25,4 milhões
Euro Truck Simulator 2|22 milhões
Phasmophobia|21 milhões
Diablo III|20 milhões
Meccha Chameleon|20 milhões
Rust|20 milhões`,
  ),
  ranking(
    "game-franquias-mais-vendidas",
    "Games",
    "Quais são as 10 franquias de games que mais venderam na história?",
    "Unidades vendidas somando todos os jogos da franquia, todas as plataformas · retrato consultado em 13/09/2026",
    "Franquias com jogos mobile free-to-play (como Pokémon Go) costumam ter esse número somado ao total da franquia por algumas fontes.",
    { label: "Wikipedia · franquias mais vendidas", url: "https://en.wikipedia.org/wiki/List_of_best-selling_video_game_franchises" },
    `Mario|893,5 milhões
Tetris|520 milhões
Pokémon|515 milhões
Call of Duty|500 milhões
Grand Theft Auto|475 milhões
Minecraft|400 milhões
FIFA / EA Sports FC|325 milhões
Assassin's Creed|250 milhões
Resident Evil|213 milhões
Final Fantasy|212 milhões`,
  ),
  ranking(
    "game-esports-torneios-premiacao",
    "Games",
    "Quais foram os 10 torneios de eSports com a maior premiação total da história?",
    "Prize pool de uma única edição de torneio, em dólares · retrato consultado em 13/09/2026",
    "The International (Dota 2) financia boa parte do prêmio com a venda de itens do Battle Pass pela comunidade, o que explica seu domínio na lista.",
    { label: "Esports Earnings · maiores torneios", url: "https://www.esportsearnings.com/tournaments" },
    `The International 2021 (Dota 2)|US$ 40,02 milhões
The International 2019 (Dota 2)|US$ 34,33 milhões
The International 2018 (Dota 2)|US$ 25,53 milhões
The International 2017 (Dota 2)|US$ 24,69 milhões
The International 2016 (Dota 2)|US$ 20,77 milhões
The International 2022 (Dota 2)|US$ 18,93 milhões
The International 2015 (Dota 2)|US$ 18,43 milhões
Fortnite World Cup 2019 — Solo|US$ 15,29 milhões
Riyadh Masters 2023 (Dota 2)|US$ 15,12 milhões
Fortnite World Cup 2019 — Dupla|US$ 15,10 milhões`,
  ),
  ranking(
    "game-esports-jogos-premiacao",
    "Games",
    "Quais são os 10 jogos com a maior premiação total acumulada em eSports?",
    "Soma de todos os prize pools de torneios já registrados por jogo, em dólares · retrato consultado em 13/09/2026",
    "Total histórico acumulado, não o valor de um único torneio. Dota 2 lidera por causa da série The International.",
    { label: "Esports Earnings · jogos", url: "https://www.esportsearnings.com/games" },
    `Dota 2|US$ 382,28 milhões
Fortnite|US$ 209,11 milhões
Counter-Strike: Global Offensive|US$ 162,77 milhões
League of Legends|US$ 122,03 milhões
Arena of Valor|US$ 111,51 milhões
PUBG Mobile|US$ 89,79 milhões
PUBG: Battlegrounds|US$ 67,04 milhões
Rocket League|US$ 58,22 milhões
Counter-Strike 2|US$ 57,31 milhões
Rainbow Six Siege|US$ 49,89 milhões`,
  ),
  ranking(
    "game-esports-jogadores-premiados",
    "Games",
    "Quais são os 10 jogadores de eSports que mais ganharam em premiações na carreira?",
    "Soma de premiações em torneios ao longo da carreira, em dólares · retrato consultado em 13/09/2026",
    "Os 10 primeiros do ranking geral jogam ou jogaram Dota 2 profissionalmente, reflexo direto dos prize pools gigantes do The International.",
    { label: "Esports Earnings · jogadores", url: "https://www.esportsearnings.com/players" },
    `N0tail (Dota 2)|US$ 7,18 milhões
JerAx (Dota 2)|US$ 6,49 milhões
Miposhka (Dota 2)|US$ 6,25 milhões
ana (Dota 2)|US$ 6,02 milhões
Yatoro (Dota 2)|US$ 5,99 milhões
Collapse (Dota 2)|US$ 5,99 milhões
Ceb (Dota 2)|US$ 5,95 milhões
Topson (Dota 2)|US$ 5,90 milhões
Mira (Dota 2)|US$ 5,66 milhões
KuroKy (Dota 2)|US$ 5,30 milhões`,
  ),
  ranking(
    "game-metacritic-melhores",
    "Games",
    "Quais são os 10 jogos mais bem avaliados da história no Metacritic?",
    "Metascore (média ponderada de crítica) · retrato consultado em 13/09/2026",
    "Várias posições empatam na mesma nota; a ordem entre empatados segue a apresentada pelo próprio site no momento da consulta.",
    { label: "Metacritic · melhores de todos os tempos", url: "https://www.metacritic.com/browse/game/" },
    `The Legend of Zelda: Ocarina of Time|99
SoulCalibur|98
Super Mario Galaxy 2|98
Grand Theft Auto IV|98
Super Mario Galaxy|97
The Legend of Zelda: Breath of the Wild|97
Perfect Dark|97
Tony Hawk's Pro Skater 3|97
Red Dead Redemption 2|97
Grand Theft Auto V|97`,
  ),
  ranking(
    "empresa-fortune-global-500",
    "Empresas",
    "Quais são as 10 empresas com maior receita anual do mundo, segundo a Fortune Global 500?",
    "Mundo · receita do ano fiscal de 2025 · lista Fortune Global 500 divulgada em 28/07/2026",
    "Ranking por receita total (faturamento), não lucro nem valor de mercado. Estatais chinesas e a Saudi Aramco entram por esse critério mesmo sem ações negociadas nos EUA.",
    { label: "Fortune Global 500 2026", url: "https://fortune.com/ranking/global500/" },
    `Amazon|US$ 716,92 bilhões
Walmart|US$ 713,16 bilhões
State Grid|US$ 555,37 bilhões
UnitedHealth Group|US$ 447,57 bilhões
Saudi Aramco|US$ 445,53 bilhões
Apple|US$ 416,16 bilhões
McKesson|US$ 403,43 bilhões
Alphabet|US$ 402,84 bilhões
CVS Health|US$ 402,07 bilhões
China National Petroleum|US$ 401,93 bilhões`,
  ),
  ranking(
    "empresa-bilionarios-mundo",
    "Empresas",
    "Quem são as 10 pessoas mais ricas do mundo?",
    "Mundo · patrimônio líquido estimado no retrato desta rodada · Forbes Real-Time Billionaires consultado em 13/09/2026",
    "Patrimônio estimado por participações societárias e outros ativos; oscila diariamente com o preço das ações. Vale este retrato salvo, não o valor de agora.",
    { label: "Forbes Real-Time Billionaires", url: "https://www.forbes.com/real-time-billionaires/" },
    `Elon Musk|US$ 929,4 bilhões
Larry Page|US$ 277,9 bilhões
Michael Dell|US$ 276,5 bilhões
Jeff Bezos|US$ 273 bilhões
Sergey Brin|US$ 255,8 bilhões
Mark Zuckerberg|US$ 222,6 bilhões
Larry Ellison|US$ 195,4 bilhões
Jensen Huang|US$ 189,1 bilhões
Steve Ballmer|US$ 155 bilhões
Warren Buffett|US$ 145,1 bilhões`,
  ),
  ranking(
    "empresa-marcas-valiosas",
    "Empresas",
    "Quais são as 10 marcas mais valiosas do mundo?",
    "Mundo · valor de marca no relatório Best Global Brands 2025 da Interbrand, divulgado em outubro de 2025",
    "Valor de marca (ativo intangível calculado pela metodologia da Interbrand), não valor de mercado da empresa nem receita.",
    { label: "Interbrand · Best Global Brands 2025", url: "https://interbrand.com/best-global-brands/" },
    `Apple|US$ 470,9 bilhões
Microsoft|US$ 388,5 bilhões
Amazon|US$ 319,9 bilhões
Google|US$ 317,1 bilhões
Samsung|US$ 90,5 bilhões
Toyota|US$ 74,2 bilhões
Coca-Cola|US$ 60,1 bilhões
Instagram|US$ 57,3 bilhões
McDonald's|US$ 53 bilhões
Mercedes-Benz|US$ 50,1 bilhões`,
  ),
  ranking(
    "empresa-bancos-ativos",
    "Empresas",
    "Quais são os 10 maiores bancos do mundo por total de ativos?",
    "Mundo · ativos totais reportados · ranking da S&P Global Market Intelligence de abril de 2026",
    "Ativos totais no balanço, não valor de mercado. O critério não ajusta diferenças contábeis entre países, o que favorece bancos chineses e europeus sobre os americanos.",
    { label: "S&P Global Market Intelligence · maiores bancos do mundo", url: "https://www.spglobal.com/market-intelligence/en/news-insights/research/the-worlds-largest-banks" },
    `Industrial and Commercial Bank of China|US$ 7,65 trilhões
Agricultural Bank of China|US$ 6,97 trilhões
China Construction Bank|US$ 6,52 trilhões
Bank of China|US$ 5,48 trilhões
JPMorgan Chase|US$ 4,42 trilhões
HSBC|US$ 3,44 trilhões
Bank of America|US$ 3,41 trilhões
BNP Paribas|US$ 3,28 trilhões
Crédit Agricole|US$ 3,15 trilhões
Postal Savings Bank of China|US$ 2,67 trilhões`,
  ),
  ranking(
    "empresa-tech-funcionarios",
    "Empresas",
    "Quais são as 10 empresas de tecnologia com mais funcionários no mundo?",
    "Mundo · número de funcionários reportado · dados consolidados em 2025",
    "Definição ampla de 'tecnologia': inclui manufatura eletrônica (Foxconn), conglomerados industriais (Hitachi, Panasonic), telecom (Huawei, Deutsche Telekom), e-commerce (Jingdong/JD.com) e consultoria de TI (Accenture), não só empresas de software.",
    { label: "Wikipedia · List of largest technology companies by revenue", url: "https://en.wikipedia.org/wiki/List_of_largest_technology_companies_by_revenue" },
    `Accenture|774.000 funcionários
Foxconn|767.062 funcionários
Jingdong (JD.com)|620.000 funcionários
Hitachi|322.525 funcionários
Samsung Electronics|270.372 funcionários
IBM|270.300 funcionários
Panasonic|228.420 funcionários
Microsoft|228.000 funcionários
Huawei|208.000 funcionários
Deutsche Telekom|205.000 funcionários`,
  ),
  ranking(
    "empresa-fabricantes-carros",
    "Empresas",
    "Quais são os 10 maiores fabricantes de carros do mundo por vendas?",
    "Mundo · veículos vendidos no ano-calendário de 2025 · dados consultados em 13/09/2026",
    "Vendas de veículos (não produção); grupos com várias marcas (Volkswagen, Hyundai-Kia, Stellantis) são contados como um único fabricante.",
    { label: "Wikipedia · List of manufacturers by motor vehicle production", url: "https://en.wikipedia.org/wiki/List_of_manufacturers_by_motor_vehicle_production" },
    `Toyota|11.322.575 veículos
Volkswagen Group|8.983.978 veículos
Hyundai Motor Group|7.272.453 veículos
General Motors|6.183.928 veículos
Stellantis|5.600.000 veículos
BYD Auto|4.602.436 veículos
SAIC Motor|4.507.500 veículos
Ford|4.400.000 veículos
Geely|4.116.321 veículos
Honda|3.521.905 veículos`,
  ),
  ranking(
    "empresa-varejistas-mundo",
    "Empresas",
    "Quais são as 10 maiores varejistas do mundo por receita?",
    "Mundo · receita de operações de varejo no ano fiscal de 2023 · relatório Global Powers of Retailing, da Deloitte",
    "Conta só a receita de varejo (exclui outras unidades de negócio, como a nuvem da Amazon). O ranking mais recente disponível é o de 2023, publicado em 2025.",
    { label: "Deloitte · Global Powers of Retailing (via Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_largest_retail_companies" },
    `Walmart|US$ 648,13 bilhões
Amazon|US$ 251,90 bilhões
Costco|US$ 242,29 bilhões
Schwarz Gruppe|US$ 177,01 bilhões
The Home Depot|US$ 152,67 bilhões
The Kroger Company|US$ 148,91 bilhões
Aldi|US$ 123,61 bilhões
JD.com|US$ 122,88 bilhões
Walgreens Boots Alliance|US$ 121,19 bilhões
CVS Health|US$ 116,76 bilhões`,
  ),
  ranking(
    "empresa-brasil-valor-mercado",
    "Empresas",
    "Quais são as 10 empresas brasileiras mais valiosas por valor de mercado?",
    "Empresas de origem brasileira · valor de mercado no retrato desta rodada · consulta em 13/09/2026",
    "Valor de mercado, não receita. Inclui empresas de origem/controle brasileiro com ações negociadas fora da B3, como a Nu Holdings (Nubank), listada na Bolsa de Nova York.",
    { label: "companiesmarketcap.com · maiores empresas do Brasil", url: "https://companiesmarketcap.com/brazil/largest-companies-in-brazil-by-market-cap/" },
    `Petrobras|US$ 136,62 bilhões
Itaú Unibanco|US$ 91,81 bilhões
Nu Holdings (Nubank)|US$ 70,62 bilhões
Vale|US$ 64,81 bilhões
BTG Pactual|US$ 53,57 bilhões
Ambev|US$ 46,55 bilhões
JBS|US$ 46,24 bilhões
Banco Santander Brasil|US$ 45,07 bilhões
WEG|US$ 42,16 bilhões
Banco Bradesco|US$ 38,12 bilhões`,
  ),
  ranking(
    "empresa-unicornios-valiosos",
    "Empresas",
    "Quais são os 10 unicórnios (startups privadas) mais valiosos do mundo?",
    "Mundo · valuation da rodada de investimento mais recente conhecida até 13/09/2026",
    "Empresas de capital fechado (ainda sem IPO); o valuation vem da última rodada de investimento anunciada, não de negociação em bolsa.",
    { label: "Wikipedia · List of unicorn startup companies", url: "https://en.wikipedia.org/wiki/List_of_unicorn_startup_companies" },
    `Anthropic|US$ 965 bilhões
OpenAI|US$ 852 bilhões
ByteDance|US$ 600 bilhões
Databricks|US$ 190 bilhões
Stripe|US$ 159 bilhões
Binance|US$ 85 bilhões
Revolut|US$ 75 bilhões
Anduril Industries|US$ 61 bilhões
Cognition AI|US$ 48 bilhões
Canva|US$ 42 bilhões`,
  ),
  ranking(
    "empresa-petroleiras-receita",
    "Empresas",
    "Quais são as 10 maiores petroleiras do mundo por receita?",
    "Mundo · receita no ano fiscal de 2023 · dados consolidados",
    "Petrolíferas estatais (Aramco, Sinopec, CNPC, Pemex, entre outras) dominam por esse critério ser só receita, não valor de mercado — a maioria não tem ações listadas em bolsa.",
    { label: "Wikipedia · List of largest oil and gas companies by revenue", url: "https://en.wikipedia.org/wiki/List_of_largest_oil_and_gas_companies_by_revenue" },
    `Saudi Aramco|US$ 604,3 bilhões
Sinopec|US$ 478,5 bilhões
China National Petroleum Corporation|US$ 435,1 bilhões
Equinor|US$ 150,8 bilhões
Petrobras|US$ 124,4 bilhões
Reliance Industries|US$ 124 bilhões
Pemex|US$ 122,7 bilhões
Indian Oil Corporation|US$ 119,5 bilhões
Eneos Holdings|US$ 115,6 bilhões
Iraq National Oil Company|US$ 115 bilhões`,
  ),
  ranking(
    "empresa-bilionarios-brasil",
    "Empresas",
    "Quem são os 10 brasileiros mais ricos do mundo?",
    "Mundo · patrimônio líquido estimado · lista consolidada em 06/09/2026, com base em avaliações da Forbes",
    "Eduardo Saverin (cofundador do Facebook) é contado como brasileiro por nascimento e cidadania, mesmo residindo fora do país.",
    { label: "Forbes / Wikipedia · List of Brazilians by net worth", url: "https://en.wikipedia.org/wiki/List_of_Brazilians_by_net_worth" },
    `Eduardo Saverin|US$ 35,9 bilhões
André Esteves|US$ 20,2 bilhões
Jorge Paulo Lemann|US$ 19,8 bilhões
Fernando Roberto Moreira Salles|US$ 9,9 bilhões
Pedro Moreira Salles|US$ 8,7 bilhões
Irmãos Safra|US$ 7,1 bilhões
Alex Behring|US$ 7 bilhões
Dulce Pugliese de Godoy Bueno|US$ 6 bilhões
Alceu Elias Feldmann|US$ 5,4 bilhões
Luiza Helena Trajano|US$ 5,3 bilhões`,
  ),
  ranking(
    "empresa-gestoras-ativos-aum",
    "Empresas",
    "Quais são as 10 maiores gestoras de ativos do mundo por patrimônio administrado?",
    "Mundo · assets under management (AUM) · dados de 2025",
    "AUM é o patrimônio de terceiros sob gestão, não o valor de mercado da própria gestora.",
    { label: "Wikipedia · List of asset management firms", url: "https://en.wikipedia.org/wiki/List_of_asset_management_firms" },
    `BlackRock|US$ 11,5 trilhões
Vanguard Group|US$ 10,1 trilhões
Fidelity Investments|US$ 5,5 trilhões
State Street Global Advisors|US$ 4,7 trilhões
JPMorgan Chase|US$ 4 trilhões
Goldman Sachs|US$ 3,1 trilhões
Capital Group|US$ 2,8 trilhões
UBS|US$ 2,8 trilhões
Allianz|US$ 2,5 trilhões
Amundi|US$ 2,3 trilhões`,
  ),
  ranking(
    "empresa-companhias-aereas-passageiros",
    "Empresas",
    "Quais são as 10 maiores companhias aéreas do mundo por passageiros transportados?",
    "Mundo · passageiros transportados no ano-calendário de 2024",
    "Conta o grupo aéreo inteiro, incluindo subsidiárias regionais (ex.: American Eagle dentro da American Airlines Group).",
    { label: "Wikipedia · List of largest airlines", url: "https://en.wikipedia.org/wiki/List_of_largest_airlines" },
    `American Airlines Group|225 milhões de passageiros
Delta Air Lines|200 milhões de passageiros
Ryanair Holdings|184 milhões de passageiros
United Airlines|174 milhões de passageiros
Southwest Airlines|140 milhões de passageiros
Lufthansa Group|131 milhões de passageiros
International Airlines Group|122 milhões de passageiros
IndiGo|119 milhões de passageiros
Air France–KLM|98 milhões de passageiros
Turkish Airlines|83 milhões de passageiros`,
  ),
  ranking(
    "empresa-farmaceuticas-valor-mercado",
    "Empresas",
    "Quais são as 10 farmacêuticas mais valiosas do mundo por valor de mercado?",
    "Mundo · valor de mercado no retrato desta rodada · consulta em 13/09/2026",
    "Valor de mercado, não receita nem gastos em pesquisa e desenvolvimento.",
    { label: "companiesmarketcap.com · maiores farmacêuticas", url: "https://companiesmarketcap.com/pharmaceuticals/largest-pharmaceutical-companies-by-market-cap/" },
    `Eli Lilly|US$ 994,91 bilhões
Johnson & Johnson|US$ 640,02 bilhões
AbbVie|US$ 454,36 bilhões
Merck|US$ 355,10 bilhões
Roche|US$ 344,17 bilhões
Novartis|US$ 260,70 bilhões
AstraZeneca|US$ 248,40 bilhões
Amgen|US$ 204 bilhões
Novo Nordisk|US$ 190,32 bilhões
Gilead Sciences|US$ 178,20 bilhões`,
  ),
  ranking(
    "empresa-seguradoras-ativos",
    "Empresas",
    "Quais são as 10 maiores seguradoras do mundo por total de ativos?",
    "Mundo · ativos não bancários · relatório AM Best de 2025, referente ao ano fiscal de 2024",
    "Ativos totais no balanço, não valor de mercado nem prêmios emitidos.",
    { label: "AM Best (via Wikipedia) · List of largest insurance companies", url: "https://en.wikipedia.org/wiki/List_of_largest_insurance_companies" },
    `Allianz|US$ 1.085,2 bilhões
Berkshire Hathaway|US$ 1.069,9 bilhões
China Life Insurance|US$ 957,8 bilhões
Ping An Insurance|US$ 848,1 bilhões
Prudential Financial|US$ 721,1 bilhões
Axa|US$ 711,3 bilhões
MetLife|US$ 687,5 bilhões
Legal & General|US$ 664,7 bilhões
Assicurazioni Generali|US$ 663,9 bilhões
Manulife Financial|US$ 660,9 bilhões`,
  ),
  ranking(
    "empresa-midia-streaming-valor-mercado",
    "Empresas",
    "Quais são as 10 empresas de mídia e entretenimento mais valiosas por valor de mercado?",
    "Mundo · valor de mercado no retrato desta rodada · consulta em 13/09/2026",
    "Valor de mercado, não receita nem número de assinantes.",
    { label: "companiesmarketcap.com · maiores empresas de entretenimento", url: "https://companiesmarketcap.com/entertainment/largest-entertainment-companies-by-market-cap/" },
    `Netflix|US$ 322,28 bilhões
Walt Disney|US$ 183,97 bilhões
Sony|US$ 139,62 bilhões
Spotify|US$ 108,08 bilhões
Comcast|US$ 89,42 bilhões
NetEase|US$ 74,01 bilhões
Warner Bros. Discovery|US$ 70,30 bilhões
Sea Limited|US$ 65,07 bilhões
Nintendo|US$ 61,51 bilhões
Take-Two Interactive|US$ 40,28 bilhões`,
  ),
  ranking(
    "empresa-mais-lucrativas-mundo",
    "Empresas",
    "Quais são as 10 empresas mais lucrativas do mundo por lucro líquido anual?",
    "Mundo · lucro líquido do ano fiscal de 2024-2025",
    "Lucro líquido (o que sobra depois de todos os custos), não receita nem valor de mercado.",
    { label: "Wikipedia · List of largest companies by revenue (coluna de lucro)", url: "https://en.wikipedia.org/wiki/List_of_largest_companies_by_revenue" },
    `Alphabet|US$ 132 bilhões
Nvidia|US$ 120 bilhões
Apple|US$ 112 bilhões
Saudi Aramco|US$ 106 bilhões
Microsoft|US$ 101 bilhões
Berkshire Hathaway|US$ 88,9 bilhões
Meta Platforms|US$ 62,3 bilhões
JPMorgan Chase|US$ 49,5 bilhões
China Construction Bank|US$ 46,9 bilhões
ExxonMobil|US$ 36 bilhões`,
  ),
  ranking(
    "natureza-rios-mais-longos",
    "Natureza e geografia",
    "Quais são os 10 rios mais longos do mundo?",
    "Comprimento total do curso principal, em quilômetros · sistema fluvial conforme definição da fonte",
    "A ordem entre Nilo e Amazonas é debatida entre cientistas, pois depende de qual afluente é considerado a nascente principal de cada rio; aqui segue a medição tradicional mais citada.",
    { label: "Wikipedia · Rios mais longos do mundo", url: "https://en.wikipedia.org/wiki/List_of_rivers_by_length" },
    `Nilo|6.650 km
Amazonas|6.400 km
Yangtzé|6.300 km
Mississippi-Missouri|6.275 km
Ienissei|5.539 km
Rio Amarelo (Huang He)|5.464 km
Óbi-Irtysh|5.410 km
Rio da Prata-Paraná|4.880 km
Congo|4.700 km
Amur|4.444 km`,
  ),
  ranking(
    "natureza-rios-caudalosos",
    "Natureza e geografia",
    "Quais são os 10 rios mais caudalosos do mundo (maior vazão média)?",
    "Vazão média (descarga) em metros cúbicos por segundo, medida no trecho de referência da fonte",
    "Vazão é o volume de água escoado, não o comprimento do rio; por isso a ordem é bem diferente da lista dos rios mais longos.",
    { label: "Wikipedia · Rios por vazão", url: "https://en.wikipedia.org/wiki/List_of_rivers_by_discharge" },
    `Amazonas|209.000 m³/s
Congo|41.400 m³/s
Orinoco|39.000 m³/s
Yangtzé|31.900 m³/s
Rio Negro|30.641 m³/s
Madeira|30.173 m³/s
Brahmaputra|22.182 m³/s
Mississippi|21.300 m³/s
Ienissei|20.200 m³/s
Paraná|19.706 m³/s`,
  ),
  ranking(
    "natureza-montanhas-mais-altas",
    "Natureza e geografia",
    "Quais são as 10 montanhas mais altas do mundo?",
    "Altitude acima do nível do mar, em metros · picos independentes, não subpicos de uma mesma montanha",
    "Todas ficam no Himalaia ou no Karakoram, na Ásia; a distinção entre 'montanha' e 'subpico' segue os critérios usuais de proeminência topográfica.",
    { label: "Wikipedia · Montanhas mais altas da Terra", url: "https://en.wikipedia.org/wiki/List_of_highest_mountains_on_Earth" },
    `Everest|8.849 m
K2|8.611 m
Kangchenjunga|8.586 m
Lhotse|8.516 m
Makalu|8.485 m
Cho Oyu|8.188 m
Dhaulagiri I|8.167 m
Manaslu|8.163 m
Nanga Parbat|8.126 m
Annapurna I|8.091 m`,
  ),
  ranking(
    "natureza-vulcoes-mais-altos",
    "Natureza e geografia",
    "Quais são os 10 vulcões mais altos do mundo?",
    "Altitude acima do nível do mar, em metros · apenas formações vulcânicas",
    "Todos os dez ficam na Cordilheira dos Andes, entre Argentina, Chile e Bolívia; nem todos têm erupções históricas registradas.",
    { label: "Wikipedia · Vulcões por elevação", url: "https://en.wikipedia.org/wiki/List_of_volcanoes_by_elevation" },
    `Ojos del Salado|6.893 m
Monte Pissis|6.793 m
Nevado Tres Cruces|6.748 m
Llullaillaco|6.739 m
Tipas|6.660 m
Nevado Tres Cruces Central|6.629 m
Incahuasi|6.621 m
Tupungato|6.570 m
Nevado Sajama|6.542 m
Ata|6.501 m`,
  ),
  ranking(
    "natureza-maiores-desertos",
    "Natureza e geografia",
    "Quais são os 10 maiores desertos do mundo?",
    "Área total em km² · inclui desertos polares (Antártica e Ártico), considerando apenas desertos com mais de 50 mil km²",
    "Deserto aqui é definido por baixa precipitação, não por calor: os dois maiores do mundo são desertos gelados, não quentes.",
    { label: "Wikipedia · Desertos por área", url: "https://en.wikipedia.org/wiki/List_of_deserts_by_area" },
    `Deserto Antártico|14.200.000 km²
Deserto Ártico|13.900.000 km²
Saara|9.200.000 km²
Deserto da Arábia|2.330.000 km²
Grande Deserto Australiano|1.371.000 km²
Deserto de Gobi|1.295.000 km²
Deserto do Kalahari|900.000 km²
Deserto da Patagônia|673.000 km²
Deserto da Síria|500.000 km²
Grande Bacia (Great Basin)|492.000 km²`,
  ),
  ranking(
    "natureza-maiores-lagos",
    "Natureza e geografia",
    "Quais são os 10 maiores lagos do mundo por área?",
    "Área da superfície em km²",
    "O Mar Cáspio é convencionalmente tratado como o maior lago do mundo, embora geologicamente lembre um pequeno oceano por ter se formado sobre uma bacia oceânica.",
    { label: "Wikipedia · Lagos por área", url: "https://en.wikipedia.org/wiki/List_of_lakes_by_area" },
    `Mar Cáspio|389.000 km²
Lago Superior|82.100 km²
Lago Vitória|59.940 km²
Lago Huron|59.570 km²
Lago Michigan|57.800 km²
Lago Tanganica|32.900 km²
Lago Baikal|31.722 km²
Great Bear Lake|31.153 km²
Lago Malawi (Niassa)|29.600 km²
Great Slave Lake|27.200 km²`,
  ),
  ranking(
    "natureza-maiores-ilhas",
    "Natureza e geografia",
    "Quais são as 10 maiores ilhas do mundo por área?",
    "Área total em km² · ilhas cercadas por água, excluindo massas continentais",
    "A Groenlândia é quase três vezes maior que a segunda colocada, Nova Guiné.",
    { label: "Wikipedia · Ilhas por área", url: "https://en.wikipedia.org/wiki/List_of_islands_by_area" },
    `Groenlândia|2.108.460 km²
Nova Guiné|773.751 km²
Bornéu|723.154 km²
Madagáscar|592.521 km²
Ilha de Baffin|507.205 km²
Sumatra|428.134 km²
Honshu|228.296 km²
Ilha Victoria|219.191 km²
Grã-Bretanha|218.635 km²
Ilha Ellesmere|197.790 km²`,
  ),
  ranking(
    "natureza-cidades-mais-populosas",
    "Natureza e geografia",
    "Quais são as 10 aglomerações urbanas mais populosas do mundo?",
    "População estimada para 2025 · aglomeração urbana (mancha urbana contínua), não apenas o município central",
    "A definição de 'aglomeração urbana' da ONU inclui toda a mancha urbana contígua e pode diferir bastante dos limites administrativos oficiais de cada cidade.",
    { label: "ONU · World Urbanization Prospects (via Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_urban_agglomerations_by_population" },
    `Jacarta|41.913.860
Daca|36.585.479
Tóquio|33.412.512
Déli|30.222.405
Xangai|29.558.908
Guangzhou|27.563.372
Cairo|25.566.102
Manila|24.735.305
Calcutá|22.549.738
Seul|22.490.482`,
  ),
  ranking(
    "natureza-paises-mais-extensos",
    "Natureza e geografia",
    "Quais são os 10 países mais extensos do mundo?",
    "Área total (terra e água) em km²",
    "A Rússia sozinha é maior que os Estados Unidos e o Canadá somados.",
    { label: "Wikipedia · Países por área", url: "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area" },
    `Rússia|17.098.246 km²
Canadá|9.984.670 km²
China|9.596.960 km²
Estados Unidos|9.525.067 km²
Brasil|8.510.346 km²
Austrália|7.741.220 km²
Índia|3.287.263 km²
Argentina|2.780.400 km²
Cazaquistão|2.724.910 km²
Argélia|2.381.741 km²`,
  ),
  ranking(
    "natureza-paises-mais-populosos",
    "Natureza e geografia",
    "Quais são os 10 países mais populosos do mundo?",
    "População estimada pela ONU em 1º de julho de 2023",
    "Em 2023, a Índia ultrapassou a China e se tornou o país mais populoso do mundo.",
    { label: "ONU · World Population Prospects (via Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)" },
    `Índia|1.438.069.596
China|1.422.584.933
Estados Unidos|343.477.335
Indonésia|281.190.067
Paquistão|247.504.495
Nigéria|227.882.945
Brasil|211.140.729
Bangladesh|171.466.990
Rússia|145.440.500
México|129.739.759`,
  ),
  ranking(
    "natureza-cachoeiras-mais-altas",
    "Natureza e geografia",
    "Quais são as 10 cachoeiras mais altas do mundo?",
    "Altura total em metros (queda cumulativa, somando quedas em múltiplos estágios)",
    "Não existe um método padronizado de medir a altura de uma cachoeira, então essa lista deve ser vista como aproximada.",
    { label: "Wikipedia · Cachoeiras por altura", url: "https://en.wikipedia.org/wiki/List_of_waterfalls_by_height" },
    `Salto Ángel (Venezuela)|979 m
Tugela Falls (África do Sul)|947 m
Tres Hermanas (Peru)|914 m
Olo'upena Falls (EUA, Havaí)|900 m
Yumbilla Falls (Peru)|896 m
Skorga (Noruega)|875 m
Balåifossen (Noruega)|850 m
Vinnufossen (Noruega)|845 m
Mattenbachfall (Suíça)|840 m
Pu'uka'oku Falls (EUA, Havaí)|840 m`,
  ),
  ranking(
    "natureza-trincheiras-oceanicas",
    "Natureza e geografia",
    "Quais são as 10 fossas oceânicas mais profundas do mundo?",
    "Profundidade máxima registrada, em metros abaixo do nível do mar",
    "A Fossa das Marianas contém o ponto mais profundo conhecido dos oceanos, o Challenger Deep, no Oceano Pacífico.",
    { label: "Wikipedia · Fossa oceânica", url: "https://en.wikipedia.org/wiki/Oceanic_trench" },
    `Fossa das Marianas|10.925 m
Fossa de Tonga|10.820 m
Fossa Curilo-Kamchatka|10.542 m
Fossa das Filipinas|10.540 m
Fossa de Kermadec|10.047 m
Fossa de Izu-Ogasawara|9.810 m
Fossa da Nova Bretanha|9.140 m
Fossa do Japão|8.412 m
Fossa de Porto Rico|8.376 m
Fossa das Sandwich do Sul|8.266 m`,
  ),
  ranking(
    "natureza-paises-maior-floresta",
    "Natureza e geografia",
    "Quais são os 10 países com maior área de floresta?",
    "Área florestal em km² · Avaliação dos Recursos Florestais Mundiais da FAO",
    "Segundo a FAO, esses cinco primeiros países concentram mais da metade de toda a área florestal do planeta.",
    { label: "FAO · Global Forest Resources Assessment (via Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_countries_by_forest_area" },
    `Rússia|8.153.116 km²
Brasil|4.941.960 km²
Canadá|3.468.541 km²
Estados Unidos|3.097.950 km²
China|2.237.373 km²
Austrália|1.340.051 km²
República Democrática do Congo|1.239.525 km²
Indonésia|909.221 km²
Índia|726.928 km²
Peru|719.847 km²`,
  ),
  ranking(
    "natureza-paises-mais-mamiferos",
    "Natureza e geografia",
    "Quais são os 10 países com mais espécies de mamíferos?",
    "Número de espécies de mamíferos terrestres e marinhos registradas por país",
    "Países tropicais megadiversos concentram a maior riqueza de mamíferos do planeta.",
    { label: "Mongabay/WCMC · Biodiversidade por país", url: "https://worldrainforests.com/03highest_biodiversity.htm" },
    `Indonésia|777 espécies
Brasil|776 espécies
China|710 espécies
México|582 espécies
Peru|567 espécies
Colômbia|525 espécies
República Democrática do Congo|508 espécies
Estados Unidos|444 espécies
Equador|441 espécies
Índia|436 espécies`,
  ),
  ranking(
    "natureza-paises-mais-aves",
    "Natureza e geografia",
    "Quais são os 10 países com mais espécies de aves?",
    "Número de espécies de aves registradas por país",
    "A Colômbia é o país com a maior diversidade de aves do mundo, favorecida por sua variedade de altitudes e biomas.",
    { label: "Mongabay/WCMC · Biodiversidade por país", url: "https://worldrainforests.com/03highest_biodiversity.htm" },
    `Colômbia|1.917 espécies
Peru|1.892 espécies
Brasil|1.864 espécies
Indonésia|1.791 espécies
Equador|1.684 espécies
Bolívia|1.446 espécies
Venezuela|1.420 espécies
China|1.330 espécies
Índia|1.271 espécies
México|1.137 espécies`,
  ),
  ranking(
    "natureza-animais-terrestres-mais-pesados",
    "Natureza e geografia",
    "Quais são os 10 animais terrestres mais pesados?",
    "Maior peso corporal confiavelmente registrado para a espécie, em quilogramas · animais terrestres, excluindo os marinhos",
    "São recordes individuais de cada espécie, não médias; por isso a distância entre o 1º e o 2º colocado é tão grande.",
    { label: "Wikipedia · páginas de cada espécie", url: "https://en.wikipedia.org/wiki/African_bush_elephant" },
    `Elefante-africano-de-savana|10.400 kg
Elefante-asiático|7.000 kg
Rinoceronte-branco|3.600 kg
Hipopótamo|2.660 kg
Gauro|1.500 kg
Bisão-americano|1.270 kg
Búfalo-de-água selvagem|1.200 kg
Girafa|1.192 kg
Urso-polar|1.002 kg
Alce (moose)|820 kg`,
  ),
  ranking(
    "natureza-animais-terrestres-mais-rapidos",
    "Natureza e geografia",
    "Quais são os 10 animais terrestres mais rápidos?",
    "Velocidade máxima registrada em km/h · somente animais selvagens, sem raças domesticadas",
    "A chita atinge sua velocidade máxima apenas em disparadas curtas de 20 a 30 segundos, não de forma sustentada.",
    { label: "Wikipedia · Animais mais rápidos", url: "https://en.wikipedia.org/wiki/Fastest_animals" },
    `Chita|120,7 km/h
Pronghorn (antílope-americano)|88,5 km/h
Springbok|88 km/h
Nhu-azul (wildebeest)|80,5 km/h
Gazela-de-thomson|80,5 km/h
Leão|80 km/h
Cão-selvagem-africano|71 km/h
Avestruz|70 km/h
Coiote|69 km/h
Varano-perentie|40,2 km/h`,
  ),
  ranking(
    "natureza-maiores-mares",
    "Natureza e geografia",
    "Quais são os 10 maiores mares do mundo por área?",
    "Área em km² · mares com nome próprio, não os cinco oceanos",
    "Alguns desses mares, como o Mar do Caribe e o Golfo da Guiné, são tecnicamente braços de oceanos, mas têm nome e limites próprios.",
    { label: "Wikipedia · Lista de mares", url: "https://en.wikipedia.org/wiki/List_of_seas" },
    `Mar das Filipinas|5.695.000 km²
Mar de Coral|4.791.000 km²
Mar Mediterrâneo Americano (Caribe e Golfo do México)|4.200.000 km²
Mar da Arábia|3.862.000 km²
Mar dos Sargaços|3.500.000 km²
Mar da China Meridional|3.500.000 km²
Mar de Weddell|2.800.000 km²
Mar do Caribe|2.754.000 km²
Mar Mediterrâneo|2.510.000 km²
Golfo da Guiné|2.350.000 km²`,
  ),
  ranking(
    "natureza-paises-maior-litoral",
    "Natureza e geografia",
    "Quais são os 10 países com o litoral mais extenso do mundo?",
    "Comprimento da linha de costa em km, segundo o CIA World Factbook",
    "A medição do litoral depende muito da escala do mapa usada (o chamado 'paradoxo da linha de costa'); por isso o Canadá aparece tão acima dos demais, por causa de suas inúmeras ilhas e fiordes.",
    { label: "CIA World Factbook (via Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline" },
    `Canadá|202.080 km
Noruega|83.281 km
Indonésia|54.716 km
Rússia|37.653 km
Filipinas|36.289 km
Japão|29.751 km
Austrália|25.760 km
Estados Unidos|19.924 km
Nova Zelândia|15.134 km
China|14.500 km`,
  ),
  ranking(
    "livro-autores-ficcao-mais-vendidos",
    "Livros",
    "Quais são os 10 autores de ficção mais vendidos de todos os tempos?",
    "Estimativas de vendas mundiais acumuladas de toda a obra de ficção de cada autor (não um único livro) · valor máximo de cada faixa estimada · consulta em 13/09/2026",
    "Números aproximados e não oficiais, repetidos por diferentes fontes jornalísticas ao longo dos anos; é quase impossível ter uma contagem exata. Inclui Shakespeare (peças e poesia) ao lado de romancistas. Autores de HQ/mangá só entram quando publicados em formato de livro.",
    { label: "Wikipedia · List of best-selling fiction authors", url: "https://en.wikipedia.org/wiki/List_of_best-selling_fiction_authors" },
    `William Shakespeare|4 bilhões
Agatha Christie|4 bilhões
Barbara Cartland|1 bilhão
Danielle Steel|800 milhões
Harold Robbins|750 milhões
Georges Simenon|700 milhões
J.K. Rowling|650 milhões
Eiichiro Oda|600 milhões
Enid Blyton|600 milhões
Jackie Collins|500 milhões`,
  ),
  ranking(
    "livro-mais-vendidos-individuais",
    "Livros",
    "Quais são os 10 livros individuais (não religiosos) mais vendidos da história?",
    "Obras avulsas, excluindo textos religiosos e séries/coleções · estimativas de vendas mundiais acumuladas · consulta em 13/09/2026",
    "Vários títulos empatam em '100 milhões'; a ordem entre empates segue a apresentação da fonte, não uma medição mais precisa. Livros infantis e best-sellers de gêneros diferentes competem juntos aqui.",
    { label: "Wikipedia · List of best-selling books", url: "https://en.wikipedia.org/wiki/List_of_best-selling_books" },
    `Um Conto de Duas Cidades|>200 milhões
O Pequeno Príncipe|200 milhões
O Alquimista|150 milhões
Harry Potter e a Pedra Filosofal|120 milhões
E Não Sobrou Nenhum|100 milhões
Sonho da Câmara Vermelha (Honglou Meng)|100 milhões
O Hobbit|100 milhões
Alice no País das Maravilhas|100 milhões
She: A History of Adventure|83 milhões
O Código Da Vinci|80 milhões`,
  ),
  ranking(
    "livro-series-mais-vendidas",
    "Livros",
    "Quais são as 10 séries de livros mais vendidas da história?",
    "Coleções/séries completas · estimativas de vendas mundiais acumuladas de todos os volumes · consulta em 13/09/2026",
    "Números vêm de diferentes anos e fontes, não diretamente comparáveis entre si. Contam a série inteira (todos os volumes somados), não um único livro.",
    { label: "Wikipedia · List of best-selling books (séries)", url: "https://en.wikipedia.org/wiki/List_of_best-selling_books#List_of_best-selling_book_series" },
    `Harry Potter|600 milhões
One Piece|600 milhões
Goosebumps (Arrepio)|400 milhões
Perry Mason|300 milhões
Diary of a Wimpy Kid (Diário de um Banana)|300 milhões
Choose Your Own Adventure (Escolha sua Aventura)|270 milhões
Berenstain Bears (Ursinhos Berenstain)|260 milhões
Mr. Men and Little Miss|250 milhões
Sweet Valley High|250 milhões
Noddy|250 milhões`,
  ),
  ranking(
    "livro-manga-mais-vendido",
    "Livros",
    "Quais são os 10 mangás mais vendidos da história?",
    "Volumes tankōbon (coletâneas em livro) de mangás japoneses · cópias vendidas ou em circulação/impressas, conforme a fonte · consulta em 13/09/2026",
    "Alguns números são cópias em circulação/impressas, não necessariamente vendidas ao consumidor final; um deles inclui vendas digitais. Não conta a circulação nas revistas semanais, só os volumes em livro.",
    { label: "Wikipedia · List of best-selling manga", url: "https://en.wikipedia.org/wiki/List_of_best-selling_manga" },
    `One Piece|600 milhões
Doraemon|300 milhões
Golgo 13|300 milhões
Detetive Conan (Case Closed)|270 milhões
Dragon Ball|260 milhões
Naruto|250 milhões
Demon Slayer: Kimetsu no Yaiba|220 milhões
Slam Dunk|185 milhões
KochiKame|157,2 milhões
Jujutsu Kaisen|150 milhões`,
  ),
  ranking(
    "livro-nobel-literatura-paises",
    "Livros",
    "Quais são os 10 países com mais vencedores do Prêmio Nobel de Literatura?",
    "Nacionalidade atribuída pela Fundação Nobel, prêmios de 1901 a 2025 · consulta em 13/09/2026",
    "O país é o registrado por nobelprize.org, que nem sempre reflete o local de nascimento ou a cidadania atual do laureado (há países que deixaram de existir, como a URSS). Autores com dupla nacionalidade contam uma vez, no país indicado pela fonte.",
    { label: "Wikipedia · List of Nobel laureates in Literature", url: "https://en.wikipedia.org/wiki/List_of_Nobel_laureates_in_Literature" },
    `França|16
Reino Unido|13
Estados Unidos|12
Alemanha|9
Suécia|8
Polônia|6
Espanha|6
Itália|6
Rússia/URSS|5
Irlanda|4`,
  ),
  ranking(
    "livro-nobel-literatura-idiomas",
    "Livros",
    "Quais são os 10 idiomas mais premiados pelo Nobel de Literatura?",
    "Idioma da obra premiada, laureados de 1901 a 2025 · consulta em 13/09/2026",
    "Alguns laureados escreveram em mais de um idioma e são contados apenas no idioma principal indicado pela fonte oficial do Nobel.",
    { label: "Wikipedia · List of Nobel laureates in Literature", url: "https://en.wikipedia.org/wiki/List_of_Nobel_laureates_in_Literature" },
    `Inglês|29
Francês|16
Alemão|14
Espanhol|11
Sueco|7
Italiano|6
Russo|6
Polonês|5
Norueguês|4
Dinamarquês|3`,
  ),
  ranking(
    "livro-mais-traduzidos",
    "Livros",
    "Quais são os 10 livros de ficção/literatura (não religiosos) mais traduzidos do mundo?",
    "Número de idiomas para os quais a obra já foi traduzida por editoras estabelecidas · consulta em 13/09/2026",
    "Exclui de propósito escrituras religiosas (Bíblia, Alcorão, Livro de Mórmon) e textos político-ideológicos ou catecismos (O Capital, Manifesto Comunista, catecismo de Lutero), que também aparecem na lista-fonte com contagens ainda maiores. Contagens vêm de fontes variadas (editoras, museus, associações de fãs) e nem sempre são diretamente comparáveis.",
    { label: "Wikipedia · List of literary works by number of translations", url: "https://en.wikipedia.org/wiki/List_of_literary_works_by_number_of_translations" },
    `O Pequeno Príncipe|610 idiomas
As Aventuras de Pinóquio|240 a 260 idiomas
Alice no País das Maravilhas|174 idiomas
Contos de Fadas dos Irmãos Grimm|170 idiomas
Dom Quixote|>140 idiomas
Contos de Andersen|129 idiomas
Asterix|115 idiomas
O Profeta|108 idiomas
As Aventuras de Tintim|96 idiomas
Harry Potter|85 idiomas`,
  ),
  ranking(
    "livro-mais-censurados-eua-2025",
    "Livros",
    "Quais foram os 10 livros mais contestados (challenged) em bibliotecas e escolas dos EUA em 2025?",
    "Estados Unidos · relatório anual da American Library Association (ALA), ano de 2025 · consulta em 13/09/2026",
    "'Contestado' significa que houve uma tentativa formal, documentada, de remover ou restringir o acesso ao livro numa biblioteca ou escola; o número é a quantidade de contestações registradas pela ALA, não é medida de vendas nem de popularidade.",
    { label: "American Library Association (ALA)", url: "https://www.ala.org/bbooks/frequentlychallengedbooks/top10" },
    `Sold|36 contestações
The Perks of Being a Wallflower|33 contestações
Gender Queer|25 contestações
Empire of Storms|24 contestações
Last Night at the Telegraph Club|23 contestações
Tricks|23 contestações
A Court of Thorns and Roses|22 contestações
A Clockwork Orange|21 contestações
Identical|21 contestações
Looking for Alaska|21 contestações`,
  ),
  ranking(
    "social-instagram-geral",
    "Redes sociais",
    "Quais são as 10 contas com mais seguidores no Instagram?",
    "Contas de qualquer tipo (pessoas, marcas e organizações) · retrato consultado em 13/09/2026",
    "Contagem ao vivo que muda a cada minuto; vale apenas este retrato salvo. A própria conta @instagram lidera por ser a conta oficial da plataforma.",
    { label: "Wikipedia · List of most-followed Instagram accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Instagram_accounts" },
    `Instagram (@instagram)|685 milhões
Cristiano Ronaldo (@cristiano)|678 milhões
Lionel Messi (@leomessi)|515 milhões
Selena Gomez (@selenagomez)|404 milhões
Dwayne Johnson (@therock)|382 milhões
Kylie Jenner (@kyliejenner)|382 milhões
Ariana Grande (@arianagrande)|363 milhões
Kim Kardashian (@kimkardashian)|344 milhões
Beyoncé (@beyonce)|300 milhões
Khloé Kardashian (@khloekardashian)|292 milhões`,
  ),
  ranking(
    "social-instagram-pessoas",
    "Redes sociais",
    "Quais são as 10 pessoas físicas (excluindo contas de marcas) com mais seguidores no Instagram?",
    "Somente contas de pessoas, sem contas institucionais como @instagram ou @nike · retrato consultado em 13/09/2026",
    "Ranking filtrado a partir da lista geral do Instagram, removendo contas de marcas/organizações. Os números mudam o tempo todo; vale este retrato salvo.",
    { label: "Wikipedia · List of most-followed Instagram accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Instagram_accounts" },
    `Cristiano Ronaldo (@cristiano)|678 milhões
Lionel Messi (@leomessi)|515 milhões
Selena Gomez (@selenagomez)|404 milhões
Dwayne Johnson (@therock)|382 milhões
Kylie Jenner (@kyliejenner)|382 milhões
Ariana Grande (@arianagrande)|363 milhões
Kim Kardashian (@kimkardashian)|344 milhões
Beyoncé (@beyonce)|300 milhões
Khloé Kardashian (@khloekardashian)|292 milhões
Justin Bieber (@lilbieber)|286 milhões`,
  ),
  ranking(
    "social-x-geral",
    "Redes sociais",
    "Quais são as 10 contas com mais seguidores no X (antigo Twitter)?",
    "Contas de qualquer tipo · retrato consultado em 13/09/2026, com base em levantamento de 27/08/2026",
    "Números arredondados pela fonte para baixo, na centena de milhar mais próxima; o ranking muda constantemente.",
    { label: "Wikipedia · List of most-followed Twitter accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Twitter_accounts" },
    `Elon Musk (@elonmusk)|241,6 milhões
Barack Obama (@BarackObama)|119,0 milhões
Cristiano Ronaldo (@Cristiano)|114,2 milhões
Donald Trump (@realDonaldTrump)|111,7 milhões
Narendra Modi (@narendramodi)|107,1 milhões
Rihanna (@rihanna)|98,6 milhões
NASA (@NASA)|92,3 milhões
Justin Bieber (@justinbieber)|91,7 milhões
Katy Perry (@katyperry)|89,6 milhões
Taylor Swift (@taylorswift13)|83,5 milhões`,
  ),
  ranking(
    "social-x-pessoas",
    "Redes sociais",
    "Quais são as 10 pessoas físicas com mais seguidores no X, excluindo contas de marcas e instituições?",
    "Exclui contas institucionais como @NASA · retrato consultado em 13/09/2026, base 27/08/2026",
    "A NASA apareceria em 7º lugar no ranking geral do X; aqui ela é removida por não ser pessoa física.",
    { label: "Wikipedia · List of most-followed Twitter accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Twitter_accounts" },
    `Elon Musk (@elonmusk)|241,6 milhões
Barack Obama (@BarackObama)|119,0 milhões
Cristiano Ronaldo (@Cristiano)|114,2 milhões
Donald Trump (@realDonaldTrump)|111,7 milhões
Narendra Modi (@narendramodi)|107,1 milhões
Rihanna (@rihanna)|98,6 milhões
Justin Bieber (@justinbieber)|91,7 milhões
Katy Perry (@katyperry)|89,6 milhões
Taylor Swift (@taylorswift13)|83,5 milhões
Lady Gaga (@ladygaga)|75,0 milhões`,
  ),
  ranking(
    "social-x-marcas",
    "Redes sociais",
    "Quais são as 10 contas de marcas e organizações (não-pessoas) com mais seguidores no X?",
    "Somente contas institucionais/de marca, como veículos de mídia, ligas esportivas e empresas · retrato consultado em 13/09/2026, base 27/08/2026",
    "Ranking derivado da tabela geral do X, filtrando apenas as contas marcadas como institucionais pela fonte.",
    { label: "Wikipedia · List of most-followed Twitter accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Twitter_accounts" },
    `NASA (@NASA)|92,3 milhões
YouTube (@YouTube)|68,8 milhões
CNN (@CNN)|61,8 milhões
X (@X)|60,7 milhões
CNN Breaking News (@cnnbrk)|60,0 milhões
ESPN (@espn)|58,6 milhões
PMO India (@PMOIndia)|58,3 milhões
The New York Times (@nytimes)|53,8 milhões
UEFA Champions League (@ChampionsLeague)|53,0 milhões
BBC Breaking News (@BBCBreaking)|50,1 milhões`,
  ),
  ranking(
    "social-tiktok-geral",
    "Redes sociais",
    "Quais são as 10 contas com mais seguidores no TikTok?",
    "Contas de qualquer tipo · retrato consultado em 13/09/2026, base 07/09/2026",
    "Khaby Lame lidera desde junho de 2022; a disputa com Charli D'Amelio pelo topo está bem apertada.",
    { label: "Wikipedia · List of most-followed TikTok accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_TikTok_accounts" },
    `Khaby Lame (@khaby.lame)|162,8 milhões
Charli D'Amelio (@charlidamelio)|159,3 milhões
MrBeast (@mrbeast)|140,1 milhões
TikTok (@tiktok)|95,6 milhões
Bella Poarch (@bellapoarch)|91,7 milhões
Addison Rae (@addisonre)|87,8 milhões
Willie Salim (@williesalim)|87 milhões
Zach King (@zachking)|86,9 milhões
FIFA World Cup (@fifaworldcup)|85,8 milhões
Kimberly Loaiza (@kimberly.loaiza)|83,4 milhões`,
  ),
  ranking(
    "social-tiktok-criadores",
    "Redes sociais",
    "Quais são os 10 criadores individuais (excluindo marcas e organizações) com mais seguidores no TikTok?",
    "Exclui contas institucionais como @tiktok e @fifaworldcup · retrato consultado em 13/09/2026, base 07/09/2026",
    "Ranking filtrado a partir da lista geral do TikTok, mantendo apenas pessoas físicas.",
    { label: "Wikipedia · List of most-followed TikTok accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_TikTok_accounts" },
    `Khaby Lame (@khaby.lame)|162,8 milhões
Charli D'Amelio (@charlidamelio)|159,3 milhões
MrBeast (@mrbeast)|140,1 milhões
Bella Poarch (@bellapoarch)|91,7 milhões
Addison Rae (@addisonre)|87,8 milhões
Willie Salim (@williesalim)|87 milhões
Zach King (@zachking)|86,9 milhões
Kimberly Loaiza (@kimberly.loaiza)|83,4 milhões
Dwayne Johnson (@therock)|79,7 milhões
Will Smith (@willsmith)|78,2 milhões`,
  ),
  ranking(
    "social-tiktok-marcas",
    "Redes sociais",
    "Quais são as 10 contas de marcas e organizações (não-pessoas) com mais seguidores no TikTok?",
    "Somente contas institucionais/de marca, incluindo clubes de futebol e grupos musicais · retrato consultado em 13/09/2026, base 07/09/2026",
    "Ranking derivado da tabela geral do TikTok, filtrando apenas as contas marcadas como institucionais pela fonte.",
    { label: "Wikipedia · List of most-followed TikTok accounts", url: "https://en.wikipedia.org/wiki/List_of_most-followed_TikTok_accounts" },
    `TikTok (@tiktok)|95,6 milhões
FIFA World Cup (@fifaworldcup)|85,8 milhões
BTS (@bts_official_bighit)|80,8 milhões
Real Madrid CF (@realmadrid)|76,8 milhões
FC Barcelona (@fcbarcelona)|72 milhões
ESPN (@espn)|60,7 milhões
UEFA Champions League (@championsleague)|58,6 milhões
Paris Saint-Germain (@psg)|56,2 milhões
Netflix (@netflix)|53,6 milhões
Blackpink (@bp_tiktok)|52,6 milhões`,
  ),
  ranking(
    "social-facebook-geral",
    "Redes sociais",
    "Quais são as 10 páginas com mais seguidores no Facebook?",
    "Páginas de qualquer tipo (pessoas, marcas e organizações) · retrato consultado em 13/09/2026, base 28/08/2026",
    "A Netflix lidera o ranking geral; Cristiano Ronaldo é a única pessoa física entre as três primeiras posições.",
    { label: "Wikipedia · List of most-followed Facebook pages", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Facebook_pages" },
    `Netflix|205 milhões
Cristiano Ronaldo|174 milhões
Samsung|162 milhões
Facebook|154 milhões
5-Minute Crafts|147 milhões
Mr. Bean|141 milhões
Real Madrid C.F.|135 milhões
FC Barcelona|128 milhões
Shakira|126 milhões
CGTN|125 milhões`,
  ),
  ranking(
    "social-facebook-pessoas",
    "Redes sociais",
    "Quais são as 10 pessoas físicas com mais seguidores no Facebook?",
    "Exclui marcas, personagens fictícios (como Mr. Bean) e veículos de mídia · retrato consultado em 13/09/2026, base 28/08/2026",
    "Ranking filtrado a partir da lista geral do Facebook, mantendo apenas seres humanos reais.",
    { label: "Wikipedia · List of most-followed Facebook pages", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Facebook_pages" },
    `Cristiano Ronaldo|174 milhões
Shakira|126 milhões
Lionel Messi|118 milhões
Will Smith|113 milhões
Rihanna|102 milhões
Vin Diesel|102 milhões
Eminem|92 milhões
Neymar|92 milhões
Justin Bieber|88 milhões
Selena Gomez|84 milhões`,
  ),
  ranking(
    "social-facebook-marcas",
    "Redes sociais",
    "Quais são as 10 páginas de marcas, mídias e organizações (não-pessoas) com mais seguidores no Facebook?",
    "Exclui pessoas físicas e personagens fictícios · retrato consultado em 13/09/2026, base 28/08/2026",
    "Mistura marcas de consumo, veículos de mídia estatais e plataformas de tecnologia.",
    { label: "Wikipedia · List of most-followed Facebook pages", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Facebook_pages" },
    `Samsung|162 milhões
Facebook|154 milhões
5-Minute Crafts|147 milhões
CGTN|125 milhões
YouTube|108 milhões
Coca-Cola|107 milhões
Meta|106 milhões
Xinhua News Agency|103 milhões
Tasty|101 milhões
UEFA Champions League|95 milhões`,
  ),
  ranking(
    "social-twitch-seguidores",
    "Redes sociais",
    "Quais são os 10 canais com mais seguidores na Twitch?",
    "Seguidores acumulados, não espectadores simultâneos · retrato consultado em 13/09/2026, base 02/08/2026",
    "Kai Cenat foi o primeiro canal a ultrapassar 20 milhões de seguidores na plataforma.",
    { label: "Wikipedia · List of most-followed Twitch channels", url: "https://en.wikipedia.org/wiki/List_of_most-followed_Twitch_channels" },
    `Kai Cenat|21,4 milhões
Ibai|20,4 milhões
Ninja|19,3 milhões
Auronplay|17 milhões
Rubius|16,5 milhões
xQc|12,5 milhões
EasyLiker|12,3 milhões
TheGrefg|12,3 milhões
Juansguarnizo|11,7 milhões
Tfue|11,5 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-geral",
    "YouTube",
    "Quais são os 10 canais do YouTube com mais inscritos no mundo?",
    "Mundo · todas as categorias · retrato consultado em 13/09/2026",
    "Contagem de inscritos ao vivo, não é visualização nem receita. Números mudam constantemente; vale este retrato salvo.",
    { label: "Wikipedia · List of most-subscribed YouTube channels", url: "https://en.wikipedia.org/wiki/List_of_most-subscribed_YouTube_channels" },
    `MrBeast|516 milhões
T-Series|315 milhões
Cocomelon - Nursery Rhymes|202 milhões
SET India|190 milhões
Vlad and Niki|150 milhões
Stokes Twins|146 milhões
Kids Diana Show|138 milhões
김프로KIMPRO|135 milhões
Like Nastya|133 milhões
Zee Music Company|123 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-musica",
    "YouTube",
    "Quais são os 10 canais de música com mais inscritos no YouTube?",
    "Mundo · canais classificados como Música pela própria lista · retrato consultado em 13/09/2026",
    "Recorte dos canais de música dentro do ranking geral de mais inscritos. Selos, artistas e canais de clipes contam juntos.",
    { label: "Wikipedia · List of most-subscribed YouTube channels", url: "https://en.wikipedia.org/wiki/List_of_most-subscribed_YouTube_channels" },
    `T-Series|315 milhões
Zee Music Company|123 milhões
BLACKPINK|101 milhões
BANGTANTV|85,9 milhões
T-Series Bhakti Sagar|82,8 milhões
HYBE LABELS|82,7 milhões
Justin Bieber|79,3 milhões
Shemaroo Filmi Gaane|75 milhões
Sony Music India|72,8 milhões
YRF|72,7 milhões`,
  ),
  ranking(
    "youtube-mais-visualizacoes-canais",
    "YouTube",
    "Quais são os 10 canais do YouTube com mais visualizações acumuladas na história?",
    "Mundo · visualizações totais acumuladas desde a criação do canal · retrato consultado em 13/09/2026",
    "Visualizações somadas de todos os vídeos do canal, não inscritos. T-Series lidera desde 2017. Retrato salvo; o contador ao vivo segue subindo.",
    { label: "Wikipedia · List of most-viewed YouTube channels", url: "https://en.wikipedia.org/wiki/List_of_most-viewed_YouTube_channels" },
    `T-Series|350 bilhões
Cocomelon - Nursery Rhymes|222,4 bilhões
SET India|188,8 bilhões
김프로KIMPRO|144,1 bilhões
Sony SAB|143,7 bilhões
MrBeast|137,2 bilhões
Kids Diana Show|124,5 bilhões
Vlad and Niki|121,2 bilhões
Like Nastya|121 bilhões
Toys and Colors|119 bilhões`,
  ),
  ranking(
    "youtube-videos-mais-vistos",
    "YouTube",
    "Quais são os 10 vídeos mais vistos da história do YouTube?",
    "Mundo · visualizações totais acumuladas de qualquer tipo de vídeo · retrato consultado em 13/09/2026",
    "Mistura clipes musicais, canções infantis e até um anúncio: a 4ª posição é um vídeo publicitário do Facebook que acumulou bilhões de visualizações pagas, não orgânicas. Retrato salvo; a contagem ao vivo muda sempre.",
    { label: "Wikipedia · List of most-viewed YouTube videos", url: "https://en.wikipedia.org/wiki/List_of_most-viewed_YouTube_videos" },
    `Baby Shark Dance (Pinkfong)|17,28 bilhões
Wheels on the Bus (Cocomelon)|9,34 bilhões
Despacito (Luis Fonsi ft. Daddy Yankee)|9,11 bilhões
Anúncio em vídeo do Facebook|8,02 bilhões
Bath Song (Cocomelon)|7,61 bilhões
Johny Johny Yes Papa (LooLoo Kids)|7,24 bilhões
Phonics Song with Two Words (ChuChu TV)|7,08 bilhões
See You Again (Wiz Khalifa ft. Charlie Puth)|7,08 bilhões
Shape of You (Ed Sheeran)|6,79 bilhões
Axel F (Crazy Frog)|6,14 bilhões`,
  ),
  ranking(
    "youtube-videos-musicais-mais-vistos",
    "YouTube",
    "Quais são os 10 videoclipes musicais mais vistos do YouTube?",
    "Mundo · somente vídeos musicais · retrato consultado em 13/09/2026",
    "Conta só clipes musicais oficiais, sem vídeos infantis ou de outra natureza. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "Kworb · YouTube most viewed music videos", url: "https://kworb.net/youtube/topvideos.html" },
    `Despacito — Luis Fonsi ft. Daddy Yankee|9.120.630.514
See You Again — Wiz Khalifa ft. Charlie Puth|7.084.691.946
Shape of You — Ed Sheeran|6.803.750.563
Axel F — Crazy Frog|6.167.900.115
Gangnam Style — PSY|6.060.853.734
Uptown Funk — Mark Ronson ft. Bruno Mars|5.898.035.535
Hanuman Chalisa — Gulshan Kumar/Hariharan|5.700.623.702
Dame Tu Cosita — El Chombo & Dancing Green Alien|5.621.699.083
Waka Waka (This Time for Africa) — Shakira|4.750.678.237
Counting Stars — OneRepublic|4.505.669.924`,
  ),
  ranking(
    "youtube-videos-mais-curtidos",
    "YouTube",
    "Quais são os 10 vídeos mais curtidos (likes) da história do YouTube?",
    "Mundo · contagem de likes acumulados · retrato consultado em 13/09/2026",
    "Likes, não visualizações. MrBeast domina a lista com metade das posições. Retrato salvo; a contagem ao vivo muda sempre.",
    { label: "Wikipedia · List of most-liked YouTube videos", url: "https://en.wikipedia.org/wiki/List_of_most-liked_YouTube_videos" },
    `Would You Fly to Paris for a Baguette? (MrBeast)|58,70 milhões de likes
Despacito (Luis Fonsi ft. Daddy Yankee)|56,62 milhões de likes
See You Again (Wiz Khalifa ft. Charlie Puth)|46,94 milhões de likes
Baby Shark Dance (Pinkfong)|46,92 milhões de likes
Our MOST INTENSE Balloon Popping Race (How Ridiculous)|43,09 milhões de likes
Giving iPhones Instead Of Candy on Halloween (MrBeast)|42,93 milhões de likes
Dynamite (BTS)|39,58 milhões de likes
If Cleaning Was a Timed Sport. Part 2 (Daniel LaBelle)|38,81 milhões de likes
Katana Vs Bullet (MrBeast)|38,56 milhões de likes
The Rock Vs MrBeast For $100,000 (MrBeast)|36,46 milhões de likes`,
  ),
  ranking(
    "youtube-mais-inscritos-infantil",
    "YouTube",
    "Quais são os 10 canais infantis (músicas de ninar, desenhos e brinquedos) com mais inscritos no YouTube?",
    "Mundo · canais de conteúdo infantil selecionados dentro do ranking geral de mais inscritos · retrato consultado em 13/09/2026",
    "O YouTube/Wikipedia não usa uma categoria oficial 'Kids'; esta lista reúne os canais de músicas infantis, brinquedos e desenhos dentro do ranking geral de mais inscritos, na mesma ordem em que aparecem nele.",
    { label: "Wikipedia · List of most-subscribed YouTube channels", url: "https://en.wikipedia.org/wiki/List_of_most-subscribed_YouTube_channels" },
    `Cocomelon - Nursery Rhymes|202 milhões
Kids Diana Show|138 milhões
Like Nastya|133 milhões
ChuChu TV Nursery Rhymes & Kids Songs|98,2 milhões
Baby Shark - Pinkfong Kids' Songs & Stories|85,1 milhões
Toys and Colors|83 milhões
Infobells - Hindi|72,7 milhões
El Reino Infantil|71,5 milhões
LooLoo Kids - Nursery Rhymes and Children's Songs|62,5 milhões
Billion Surprise Toys|57,7 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-brasil",
    "YouTube",
    "Quais são os 10 canais brasileiros com mais inscritos no YouTube?",
    "Canais associados ao Brasil · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in Brazil", url: "https://hypeauditor.com/top-youtube-brazil/" },
    `Bispo Bruno Leonardo|76,7 milhões
Canal KondZilla|68,2 milhões
LUCCAS NETO|53,6 milhões
Maria Clara & JP|50,6 milhões
Natan por Aí|50 milhões
Enaldinho|48,2 milhões
Felipe Neto|48,2 milhões
Você Sabia?|47,4 milhões
whinderssonnunes|44,6 milhões
GR6 EXPLODE|43,1 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-eua",
    "YouTube",
    "Quais são os 10 canais associados aos Estados Unidos com mais inscritos no YouTube?",
    "Canais associados aos Estados Unidos · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in United States", url: "https://hypeauditor.com/top-youtube-all-united-states/" },
    `Cocomelon - Nursery Rhymes|202,5 milhões
Vlad and Niki|150,5 milhões
Stokes Twins|146,6 milhões
Kids Diana Show|138,5 milhões
Like Nastya|133,5 milhões
WWE|114,5 milhões
Topper Guild|94,7 milhões
Baby Shark - Pinkfong Kids' Songs & Stories|85,2 milhões
Toys and Colors|83 milhões
HYBE LABELS|82,8 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-mexico",
    "YouTube",
    "Quais são os 10 canais associados ao México com mais inscritos no YouTube?",
    "Canais associados ao México · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in Mexico", url: "https://hypeauditor.com/top-youtube-all-mexico/" },
    `Fede Vigevani|78,5 milhões
YOLO AVENTURAS|70,9 milhões
JuegaGerman|56,7 milhões
Juan De Dios Pantoja|56 milhões
Karla Bustillos|52,6 milhões
Fernanfloo|50,6 milhões
Ricky Limon|49,4 milhões
Badabun|47,6 milhões
Mariano Razo|47,3 milhões
Masha y el Oso|46,7 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-japao",
    "YouTube",
    "Quais são os 10 canais associados ao Japão com mais inscritos no YouTube?",
    "Canais associados ao Japão · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in Japan", url: "https://hypeauditor.com/top-youtube-all-japan/" },
    `Pokémon Kids TV|44,8 milhões
TOYOTA GAZOO Racing|38,1 milhões
HikakinTV|19,9 milhões
はじめしゃちょー（hajime）|16,4 milhões
Kimagure Cook|15,4 milhões
Alina & Amelia|13 milhões
THE FIRST TAKE|12,3 milhões
Sen, Momo, Ai & Syy's Channel|11,2 milhões
Yoshipapa|11,1 milhões
SUSHI RAMEN【Riku】|10 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-argentina",
    "YouTube",
    "Quais são os 10 canais associados à Argentina com mais inscritos no YouTube?",
    "Canais associados à Argentina · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in Argentina", url: "https://hypeauditor.com/top-youtube-all-argentina/" },
    `La Granja de Zenón|46,2 milhões
Ian Lucas|38,3 milhões
El Payaso Plim Plim|35 milhões
Disney Jr. Latinoamérica|31,2 milhões
Rubén Tuesta oficial|29,2 milhões
BigChungus|28,7 milhões
benja calero|28,6 milhões
Lyna|25,7 milhões
Paulo Londra|23,5 milhões
Bizarrap|23,1 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-reino-unido",
    "YouTube",
    "Quais são os 10 canais associados ao Reino Unido com mais inscritos no YouTube?",
    "Canais associados ao Reino Unido · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in United Kingdom", url: "https://hypeauditor.com/top-youtube-all-united-kingdom/" },
    `Sidemen|23,5 milhões
Futcrunch|23,1 milhões
Britain's Got Talent|21,3 milhões
BBC News|20,1 milhões
The Diary Of A CEO|19,5 milhões
John Nellis|16 milhões
BBC|15,6 milhões
Jamie Nyland|15,6 milhões
Pro Football Academy|13,8 milhões
Deji|12,8 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-alemanha",
    "YouTube",
    "Quais são os 10 canais associados à Alemanha com mais inscritos no YouTube?",
    "Canais associados à Alemanha · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in Germany", url: "https://hypeauditor.com/top-youtube-all-germany/" },
    `Secret Vlog|17,2 milhões
The Voice Kids|13,2 milhões
Sham Drama شام دراما|7,7 milhões
Moussallı|7,1 milhões
Mascha und der Bär|7 milhões
Kontor.TV|6,4 milhões
laserluca|5,8 milhões
FC Bayern Munich|5,7 milhões
Hussam Alhalapi|5,6 milhões
Gronkh|5 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-franca",
    "YouTube",
    "Quais são os 10 canais associados à França com mais inscritos no YouTube?",
    "Canais associados à França · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in France", url: "https://hypeauditor.com/top-youtube-all-france/" },
    `Tibo InShape|27 milhões
SQUEEZIE|20,3 milhões
YouTube Presents|19 milhões
Zig & Sharko|16,7 milhões
GIMS|15,2 milhões
Grizzy & the Lemmings|13 milhões
Masha et Michka|12,2 milhões
Kidi Fun|11,5 milhões
Norman|11,2 milhões
Furious Jumper|11 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-russia",
    "YouTube",
    "Quais são os 10 canais associados à Rússia com mais inscritos no YouTube?",
    "Canais associados à Rússia · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in Russia", url: "https://hypeauditor.com/top-youtube-all-russia/" },
    `Маша и Медведь|60,4 milhões
Get Movies|57,1 milhões
BRUNO|44,8 milhões
Chapitosiki|35,9 milhões
Аришнев|34,4 milhões
Eva Bravo Play|26,4 milhões
Miss Katy|25,7 milhões
Mister Max|25,3 milhões
ГЛЕНТ|24,9 milhões
ARGEN|23,3 milhões`,
  ),
  ranking(
    "youtube-mais-inscritos-indonesia",
    "YouTube",
    "Quais são os 10 canais associados à Indonésia com mais inscritos no YouTube?",
    "Canais associados à Indonésia · retrato consultado em 13/09/2026",
    "Ranking por inscritos, não por visualizações. Números ao vivo mudam continuamente; vale este retrato salvo.",
    { label: "HypeAuditor · Top YouTube channels in Indonesia", url: "https://hypeauditor.com/top-youtube-all-indonesia/" },
    `Jess No Limit|54,7 milhões
Ricis Official|50,1 milhões
Frost Diamond|48,2 milhões
Willie Salim|39,4 milhões
Indosiar|35,7 milhões
BabyBus - Cerita & Lagu Anak-anak|28,8 milhões
Koray Zeynep|28 milhões
TRANS7 OFFICIAL|28 milhões
Tayo Bus Kecil - Tayo Bahasa Indonesia|27 milhões
Rans Entertainment|26,8 milhões`,
  ),
];
