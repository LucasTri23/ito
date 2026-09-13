# Catálogo de Quem sou eu

Atualizado em 13/09/2026. São 251 personagens de animações/quadrinhos, 297 filmes e séries e 323 identidades bíblicas. Cada opção possui três pistas próprias, ordenadas de menos explícita a mais explícita. A dificuldade é editorial: depende do conhecimento do grupo.

## Fontes bíblicas

- [Meu Livro de Histórias Bíblicas](https://www.jw.org/pt/biblioteca/livros/historias-biblicas/): os relatos orientam a seleção, de Adão e Eva até os primeiros cristãos, incluindo opositores e personagens secundários.
- [Ande Corajosamente com Deus](https://www.jw.org/pt/biblioteca/livros/ande-corajosamente-com-deus/): todos os protagonistas de seus 54 capítulos foram incluídos. Capítulos sobre a mesma pessoa não geram cartas duplicadas. Capítulos coletivos dão uma carta a cada pessoa identificada.
- [Bíblia de Estudo](https://www.jw.org/pt/biblioteca/biblia/biblia-de-estudo/livros/): cada linha de `src/data/identities/bible.ts` termina com o livro/capítulo, usado para construir o link exibido na carta. Os capítulos podem conter notas de estudo e referências complementares.

Os textos são resumos próprios; o aplicativo não incorpora os livros, suas imagens nem trechos integrais. Pessoas contemporâneas mencionadas em exemplos, autores citados e créditos de imagens dos livros não integram a categoria bíblica. Grupos anônimos, cidades e animais não foram transformados artificialmente em pessoas para aumentar a contagem.

## Cobertura de Ande Corajosamente com Deus

| Capítulos | Pessoas incluídas                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1–8       | Enoque, Noé, Sara, Abraão, Rebeca, Jacó, José (filho de Jacó)                                                                  |
| 9         | Sifrá, Puá, Anrão, Joquebede, Miriã                                                                                            |
| 10–14     | Moisés, Calebe, Josué, Raabe                                                                                                   |
| 15–20     | Noemi, Rute, Baraque, Débora, Jael, Gideão, Jefté, filha de Jefté, Sansão                                                      |
| 21–28     | Samuel, Jonatã, Davi, Abigail, Natã, Mefibosete, Asa                                                                           |
| 29–36     | Elias, viúva de Sarefá, menina israelita, Eliseu, Jeoiada, Ezequias, Manassés, Josias                                          |
| 37–40     | Daniel, Sadraque, Mesaque, Abede-Nego, Ester, Neemias                                                                          |
| 41–47     | Zacarias, Elisabete, Maria (mãe de Jesus), José (marido de Maria), João Batista, Pedro, Maria Madalena, Maria (irmã de Lázaro) |
| 48–54     | Estêvão, Pedro, Paulo, Barnabé, Marcos, João (apóstolo)                                                                        |

O teste `tests/whoAmI.test.ts` exige essa relação, os nomes solicitados pelo usuário e o mínimo de 200 opções em cada categoria.

## Nomes e cuidados editoriais

- Paulo/Saulo, Sadraque/Hananias, Mesaque/Misael e Abede-Nego/Azarias são uma carta por pessoa. Homônimos são diferenciados: os dois Josés, os diferentes Zacarias, Ananias, Tiagos e Marias, por exemplo.
- A filha de Jefté, a menina israelita e outras pessoas sem nome registrado usam uma identificação pelo relato. Nenhum nome foi inventado para elas.
- O servo enviado buscar Rebeca não recebe um nome como certeza: o livro o identifica como **provavelmente** Eliézer. Eliézer de Damasco tem uma referência própria em Gênesis 15, distinta da carta sobre a missão do servo em Gênesis 24; a possível identificação não é afirmada como fato.
- Há personagens fiéis, infiéis e que mudaram de atitude. Manassés, por exemplo, tem dicas sobre seu arrependimento; não há classificação permanente de todas as pessoas como boas ou más.
- Matias é quem substituiu Judas Iscariotes (Atos 1). Zaqueu é o cobrador de impostos que subiu numa árvore (Lucas 19).
- Para algumas pessoas pouco conhecidas, as pistas distinguem parentesco e contexto; não foram inventadas ações para lhes dar aventuras inexistentes.

## Manutenção

Formato: `nome|dica difícil|dica média|dica fácil|livro/capítulo`. Nas outras duas categorias, o último campo é omitido. Não inserir `|` dentro de uma pista. Os identificadores derivam de categoria e nome, não da posição da linha; reorganizar o catálogo não troca a identidade das cartas salvas.

Antes de acrescentar uma identidade, verificar homônimos, aliases, as três pistas e a fonte. Executar `npm test`, `npm run lint` e `npm run build`.
