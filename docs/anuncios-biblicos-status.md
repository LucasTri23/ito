# Anúncios dos Tempos Bíblicos — concluído

O jogo está jogável de ponta a ponta, nos modos online (anúncios escritos e votação anônima) e presencial (apresentações ao vivo e votação “Compro” / “Não compro”), para 2 a 8 pessoas, cada uma no próprio aparelho.

## Como foi implementado

- Usa a mesma infraestrutura de salas de Plano B, Manual Desmontado e Feira de Invenções (coleções `mesaInvites` e `mesas`, jogo `ads`): convite por código e link, limite de 8 vagas, presença, saída e troca de anfitrião.
- A partida roda no motor compartilhado da Feira (`src/pages/PitchGame.tsx` e `src/services/feira.ts`): um objeto bíblico para todos, um estilo secreto diferente para cada vendedor, 40 segundos de criação, votação e placar de 5 rodadas.
- Online: com 2 pessoas, os anúncios aparecem lado a lado sem votação; com 3, uma pessoa compra e duas vendem (alternando); com 4 a 8, todos vendem e votam (nunca no próprio anúncio — garantido pelas regras).
- Presencial: 2 vendedores (até 4 pessoas) ou 2/3 à escolha do anfitrião (5 a 8); plateia vota “Compro” ou “Não compro” por apresentação, 20 s cada.
- Catálogo: `src/data/biblicalAds.json` com 87 objetos, cada um com resumo próprio, referência e link oficial do capítulo no jw.org (validação: `npm run validate:anuncios`). Os 8 estilos estão em `src/utils/biblicalAds.ts`.
- Regras: o mesmo bloco das mesas, com `game in ['feira','ads']` e o tempo da rodada (`secs`) fixado na criação (40 s para os Anúncios). Testes em `tests/mesa.rules.test.ts`.

## Verificado

- Partidas completas com sessões independentes no Emulator: online com 2, 3 e 8 pessoas e presencial com 5 (3 vendedores).
- Regras: estilo secreto legível só pelo dono até o resultado; anúncio anônimo durante a votação; voto único e nunca no próprio anúncio; tempo de 40 s.

## Observação

As coleções antigas `adsRooms`/`adsInvites` (primeira versão do lobby) não são mais usadas pelo site. As regras e testes delas continuam no repositório e podem ser removidos numa limpeza futura.
