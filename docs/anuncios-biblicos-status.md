# Anúncios dos Tempos Bíblicos — implementação em andamento

O card, as rotas por hash e o lobby foram adicionados. A sala usa autenticação anônima e Cloud Firestore, com coleções próprias `adsInvites` e `adsRooms`. O ingresso é transacional, limitado a oito pessoas, e membros podem recuperar a vaga com a mesma identidade. No presencial, o anfitrião pode selecionar dois ou três vendedores quando há cinco ou mais pessoas. O início de partida está intencionalmente indisponível.

O catálogo `src/data/biblicalAds.json` contém 15 itens com fonte oficial aberta e conferida. Os resumos são próprios. `npm run validate:anuncios` verifica quantidade, campos, IDs, nomes e domínio; atualmente falha de propósito porque ainda faltam 45 itens para o mínimo de 60. A validação automatizada não substitui a conferência de cada referência.

As regras incluem estruturas iniciais para estilos privados, anúncios anônimos e votos separados por apresentação. Os testes do Emulator verificam leituras e escritas isoladas, mas usam estados de rodada preparados com regras desabilitadas. A criação e a transição de rodadas continuam proibidas: ainda não existe partida jogável. Também há funções puras para distribuição de papéis e apuração, que não substituem autorização no Firestore.

Faltam implementar as rodadas escritas e presenciais, os estilos e anúncios na interface, o relógio de 40 segundos, a revelação anônima, as transições e a apuração confiáveis, reconexão durante a rodada, saída e transferência de anfitrião, e testes de partidas completas. A privacidade precisa ser verificada também no fluxo integrado, inclusive contra correlação de publicações. Não publicar como jogo concluído.
