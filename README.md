# Entrelinhas

Jogo cooperativo de pistas e intuição para **2–8 pessoas**, em português, com identidade visual própria. Cada pessoa recebe um número secreto, traduz sua intensidade em uma resposta ao tema e ajuda o grupo a ordenar as pistas de 1 a 100.

React + Vite + TypeScript estrito + Tailwind CSS, Firebase Anonymous Authentication e Cloud Firestore. Aplicação estática com HashRouter e deploy automático no GitHub Pages. Não usa servidor de aplicação, Functions, Admin SDK, service account nem infraestrutura paga obrigatória. Ferramentas Node e Java são usadas somente no desenvolvimento/testes.

## Começar localmente

Requisitos: Node.js 22.12+ (ou 24), npm, conta Google para Firebase e conta GitHub. Para os testes de regras, instale também **Java 21+** e deixe `java` no PATH.

```sh
npm install
```

Copie `.env.example` para `.env` e preencha as seis variáveis com os dados do Web App Firebase. No PowerShell:

```powershell
Copy-Item .env.example .env
npm.cmd run dev
```

Em outros terminais, `npm run dev`. Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. Se o PowerShell bloquear `npm.ps1`, use `npm.cmd`, sem mudar a política de execução do computador.

Sem configuração Firebase, a página inicial abre e mostra a orientação de configuração, mas criar/entrar em salas fica desabilitado. Não há multiplayer simulado apresentado como real.

## Configurar Firebase, passo a passo

1. Acesse [Firebase Console](https://console.firebase.google.com/) e clique em **Adicionar projeto**. Escolha um nome; Google Analytics é opcional e não é usado pelo jogo.
2. Mantenha o plano **Spark**, sem ativar faturamento. O jogo depende das cotas gratuitas disponíveis; não promete uso ilimitado.
3. Na visão geral do projeto, clique no ícone **Web (`</>`)**, registre um app, por exemplo `Entrelinhas Web`. Não é necessário ativar Firebase Hosting.
4. Copie os valores do objeto `firebaseConfig` para `.env`:

   | Campo do Firebase | Variável |
   |---|---|
   | apiKey | VITE_FIREBASE_API_KEY |
   | authDomain | VITE_FIREBASE_AUTH_DOMAIN |
   | projectId | VITE_FIREBASE_PROJECT_ID |
   | storageBucket | VITE_FIREBASE_STORAGE_BUCKET |
   | messagingSenderId | VITE_FIREBASE_MESSAGING_SENDER_ID |
   | appId | VITE_FIREBASE_APP_ID |

5. Em **Build → Authentication → Começar → Método de login**, habilite **Anônimo / Anonymous** e salve.
6. Em **Authentication → Configurações → Domínios autorizados**, inclua `localhost` para desenvolvimento e `SEU_USUARIO.github.io` para publicação, sem protocolo nem caminho. Não presuma que localhost já foi cadastrado.
7. Em **Build → Firestore Database → Criar banco de dados**, crie o banco **`(default)`**, escolha uma região apropriada e comece em **modo produção**.
8. Na aba **Regras**, substitua o conteúdo pelo arquivo `firestore.rules` deste repositório e clique em **Publicar**. Não use modo de teste nem regras abertas.
9. Alternativamente, com as dependências instaladas: `npx firebase login`, depois `npx firebase deploy --only firestore:rules --project SEU_PROJECT_ID`. Essa operação publica apenas as regras; revise o ID antes de executar.
10. Reinicie `npm run dev` depois de alterar `.env`. Crie uma sala e confirme o ingresso em outro perfil de navegador.

O `firebaseConfig` é configuração pública, incorporada no JavaScript pelo Vite. A segurança está nas Rules e na identidade autenticada. **Nunca** coloque chaves privadas, JSON de service account ou credenciais Admin no projeto.

## Configurar GitHub e publicar

1. Crie um repositório GitHub, preferencialmente público para usar Pages gratuito na conta pessoal. Envie estes arquivos para a branch `main`, incluindo `package-lock.json`. Não envie `.env`.
2. Em **Settings → Secrets and variables → Actions → New repository secret**, cadastre separadamente os seis nomes `VITE_FIREBASE_*` da tabela acima, usando os mesmos valores do `.env`.
3. Não configure `VITE_USE_EMULATORS=true` no GitHub. O workflow de produção não utiliza emuladores.
4. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
5. Faça push para `main` ou execute **Actions → Publicar Entrelinhas → Run workflow**.
6. O workflow instala Node 22, executa `npm ci`, lint, testes unitários, build e publica `dist` usando as actions oficiais `configure-pages@v5`, `upload-pages-artifact@v3` e `deploy-pages@v4`.
7. Aguarde os jobs `build` e `deploy` ficarem verdes. Acesse a URL exibida no deploy: `https://SEU_USUARIO.github.io/SEU_REPOSITORIO/`.
8. Confira o domínio autorizado no Firebase e faça uma partida de teste com amigos.
9. Ao mudar os secrets do GitHub, execute um novo build/deploy: as variáveis são inseridas durante a compilação, não em tempo de execução.

O workflow tem permissões `contents: read`, `pages: write`, `id-token: write` e environment `github-pages`. **Ele não publica as regras Firebase**: publique-as separadamente antes de disponibilizar a aplicação, inclusive quando as regras forem alteradas.

O Vite usa `base: './'`. O HashRouter produz rotas como `/SEU_REPOSITORIO/#/room/ABCDE`, que sobrevivem à atualização no Pages sem precisar de fallback `404.html`. Não há dependência de assets hospedados na raiz.

## Como jogar

1. Informe um nome de até 24 caracteres. A autenticação anônima acontece automaticamente.
2. Crie uma sala ou entre com um código de cinco caracteres, sem `0`, `O`, `1` ou `I`. Maiúsculas e minúsculas são equivalentes.
3. Compartilhe o código. O criador é o anfitrião e inicia a rodada quando houver 2–8 participantes.
4. O anfitrião escreve o tema e, opcionalmente, os extremos. Campos vazios usam “Pouco” e “Muito”.
5. Cada cliente sorteia seu próprio número e o grava uma única vez no documento privado. Um marcador público informa somente que o número está pronto.
6. Quando todos estiverem prontos, o cliente do anfitrião embaralha a ordem de apresentação, independentemente dos números.
7. Cada jogador envia uma resposta na sua vez. Ela fica pública e não pode ser editada. O anfitrião avança automaticamente após a confirmação e pode pular o jogador atual.
8. O grupo conversa por chamada, voz ou pessoalmente. Na ordenação, o anfitrião arrasta cards ou usa as setas acessíveis; todos acompanham em tempo real.
9. O anfitrião confirma a ordem e depois clica em **Mostrar resultado**. Somente a segunda ação permite ler os números alheios.
10. As duas listas mostram a ordem escolhida e a real, com revelação progressiva e botão **Revelar tudo**. Acertos usam texto/símbolos além da cor. Empates são aceitos: uma posição é correta se contém o mesmo valor da posição ordenada, independentemente da pessoa empatada.
11. **Próxima rodada** mantém a sala e os jogadores, incrementa o número da rodada e cria documentos novos sem respostas nem números herdados.

## Estados e estrutura

Sala: `LOBBY → PLAYING → CLOSED`. Rodada:

```text
WAITING_FOR_THEME → DISTRIBUTING_NUMBERS → PRESENTING
→ ORDERING → READY_FOR_RESULT → RESULT
```

```text
rooms/{CODIGO}
  code, hostId, status, roundNo, currentRoundId, createdAt
  players/{uid}
    uid, name, connected, joinedAt
  rounds/{numero}
    state, theme, lowLabel, highLabel, playerIds,
    presentationOrder, currentPresentationIndex, groupOrder, createdAt
    secrets/{uid}  → playerId, number
    ready/{uid}    → uid
    answers/{uid}  → playerId, playerName, answer, skipped
```

`hostId` é a única fonte de autoridade; não existe um `isHost` editável no perfil. Cada rodada congela a lista de participantes. Ingressos novos e remoções só são permitidos no lobby para preservar a sequência durante uma rodada. A lista de pessoas no lobby pode passar de oito em ingressos simultâneos; o início é bloqueado até o anfitrião remover excedentes. As regras limitam a rodada a oito participantes únicos.

Listeners `onSnapshot` recebem sala, jogadores, rodada, respostas, prontidão e o número próprio. A coleção de números **só recebe listener na tela RESULT**. Cada hook cancela o listener ao trocar caminho ou desmontar; não há polling. As coleções são pequenas e não exigem índices compostos.

## Segurança: o que as regras garantem

| Operação | Permissão |
|---|---|
| Consultar sala por código exato | Usuário autenticado; necessário para ingresso |
| Listar todas as salas | Ninguém |
| Ler jogadores, rodada e respostas | Membro da sala |
| Entrar | Próprio UID, sala em lobby |
| Atualizar presença | Apenas próprio UID; sem alterar nome/identidade |
| Criar tema, avançar, ordenar, confirmar e revelar | Apenas anfitrião, em transições válidas |
| Escrever número | Dono, na distribuição, inteiro entre 1–100, somente criação |
| Sobrescrever número ou resposta | Ninguém pelo SDK cliente |
| Apagar dados da rodada anterior | Anfitrião, somente depois de RESULT e ao trocar de rodada |
| Ler número próprio | Membro, rodada atual e sala ativa |
| Ler número alheio ou listar números | Membro, rodada atual em RESULT |
| Escrever resposta | Dono na vez correta, ou anfitrião com texto fixo de pulo |
| Remover jogador | Anfitrião, no lobby, exceto ele próprio |
| Encerrar sala | Anfitrião |

O marcador de prontidão usa `getAfter` para exigir que o número privado exista, inclusive no mesmo commit atômico. O avanço para apresentação verifica todos os marcadores (até oito). As listas de apresentação e ordenação precisam ser permutações da lista congelada. O índice avança uma posição por vez e exige uma resposta existente. As Rules impedem reescrever tema após o sorteio, pular direto para resultado e alterar a ordem após confirmação.

Conceitualmente: um jogador que abre o console e tenta ler o segredo alheio, listar secrets, forjar anfitrião, alterar a ordem ou revelar recebe `permission-denied`, mesmo que mude toda a interface. Um anfitrião também não pode ler números alheios antes de RESULT. Uma conta fora da sala não lê segredos nem após RESULT. O teste de regras exercita essas fronteiras com identidades independentes.

## Limitações explícitas da arquitetura

- **Sorteio no cliente:** um cliente adulterado pode escolher seu primeiro número em vez de sortear. As regras impedem alterações posteriores, mas não provam aleatoriedade. Números repetidos são aceitos.
- **Anfitrião controla o ritmo:** pode ordenar como quiser, pular participantes e encerrar. Sua conexão é necessária para os avanços automáticos. Se desconectar, a partida aguarda seu retorno. Não há transferência automática de anfitrião.
- **Distribuição exige todos conectados:** quem ainda não criou seu segredo precisa retornar. Se isso não for possível, o anfitrião encerra e cria outra sala. Não se inventa número para um participante ausente.
- **Presença aproximada:** eventos online/offline/pagehide atualizam `connected` quando possível. Fechamentos abruptos podem deixar presença antiga. Não há garantia de presença instantânea ou heartbeat; Firestore não oferece `onDisconnect` como o Realtime Database.
- **Sessão:** Firebase persiste a identidade no navegador; localStorage guarda nome e última sala. Ao reabrir o site, a última sala é recuperada automaticamente; o início também oferece “Voltar à última sala”. Sair explicitamente limpa essa referência. Limpar dados, trocar dispositivo ou usar outro perfil cria outra identidade. Várias abas do mesmo perfil compartilham UID e não são jogadores diferentes.
- **Limpeza:** a próxima rodada apaga números, respostas e marcadores de prontidão anteriores no mesmo commit que cria a rodada vazia. Os metadados das rodadas ficam arquivados. As regras também bloqueiam a leitura de secrets fora da rodada atual. Nada consegue “desver” números já revelados. Salas abandonadas ou encerradas não têm expiração automática; exclua-as e suas subcoleções pelo Console quando necessário. Excluir só o documento pai não apaga subcoleções.
- **Privacidade por código:** códigos são convites, não senhas de alta segurança. Usuários autenticados podem consultar um código exato; a listagem é bloqueada. Sem backend/App Check/rate limit confiável, não há proteção completa contra tentativa de códigos, spam de contas ou consumo de quota. Não armazene dados sensíveis.
- **Cotas gratuitas:** leituras, escritas, conexões e autenticações obedecem ao plano Firebase. Listeners e avaliação de regras podem consumir leituras. Ao atingir cotas, operações podem falhar. Sem faturamento ativado, o serviço não vira ilimitado.
- O anfitrião pode adulterar a seleção de IDs no cliente; só membros conseguem criar seus próprios secrets e a apresentação exige todos prontos. Isso pode travar a partida, mas não concede acesso antecipado aos números.
- Não há chat, áudio, matchmaking público, bots ou moderação. O canal de conversa é externo.

## Testes e validação

```sh
npm run build
npm run lint
npm test
npm run test:rules
```

`npm test` executa testes de sorteio e pula os testes de regras se não houver emulador; **um teste pulado não valida segurança**. `npm run test:rules` sobe o emulador com projeto fictício, executa os testes reais e encerra-o. Requer Java 21+ e download inicial do emulador. Não toca seu banco de produção.

### Multiplayer local sem projeto real

1. Copie `.env.example` para `.env` e use `VITE_FIREBASE_API_KEY=demo-key`, `VITE_FIREBASE_PROJECT_ID=demo-entrelinhas`, `VITE_FIREBASE_APP_ID=demo-app`, `VITE_FIREBASE_AUTH_DOMAIN=localhost` e `VITE_USE_EMULATORS=true`.
2. Execute `npx firebase emulators:start --only auth,firestore --project demo-entrelinhas` em um terminal.
3. Em outro, `npm run dev`.
4. Abra quatro perfis/contextos de navegador independentes. Janelas anônimas do mesmo navegador podem compartilhar a sessão entre si: confirme UIDs diferentes na interface do emulador.
5. Para teste em celulares na rede, use Firebase real com seu `.env`: os endereços de emulador no código apontam para `127.0.0.1`, apropriado apenas ao computador local.

### Checklist manual de aceite

- [ ] A cria sala; B, C e D entram com identidades distintas; todos veem os mesmos nomes.
- [ ] A define tema; cada um recebe apenas seu número; esconder/mostrar funciona.
- [ ] Ordem de apresentação aparece igual nos quatro navegadores.
- [ ] Apenas o jogador da vez responde; resposta enviada fica bloqueada; próximo avança.
- [ ] A consegue pular participante; todos acompanham as pistas sem números.
- [ ] Arraste e setas alteram ordem para todos; setas funcionam em celular e teclado.
- [ ] Só A confirma e vê Mostrar resultado. B tenta alteração direta e recebe permission-denied.
- [ ] Mesmo A não consegue ler segredo de B antes do resultado (coberto também por teste de regras).
- [ ] A revela; aparecem ambas as sequências com nome, pista, número e indicador textual.
- [ ] Revelação gradual e Revelar tudo funcionam; preferência de movimento reduzido é respeitada.
- [ ] Próxima rodada incrementa contador, limpa tela e mantém participantes.
- [ ] Atualizar página preserva jogador, número e resposta; sair e voltar recupera sessão.
- [ ] Código inexistente e sala encerrada produzem mensagem útil.
- [ ] Abrir e atualizar `/<repositorio>/#/room/<codigo>` no Pages não dá 404.

Os testes de regras simulam quatro jogadores, incluindo início de apresentação, respostas, ordenação, resultado e nova rodada. O checklist visual/manual deve ser executado com um navegador disponível e Firebase configurado; veja `VALIDATION.md` para o que foi realmente executado nesta entrega.

## Arquivos principais

```text
.github/workflows/deploy.yml
.env.example
.gitignore
firebase.json
firestore.rules
index.html
package.json / package-lock.json
tsconfig.json / vite.config.ts / eslint.config.js
src/
  main.tsx / styles.css
  components/ UI.tsx, Ordering.tsx, Result.tsx, RoundContent.tsx,
              ThemeForm.tsx, Presentation.tsx
  pages/ Home.tsx, Room.tsx
  hooks/ useAuth.ts, useFirestore.ts
  services/ game.ts
  types/ game.ts
  lib/ firebase.ts
  utils/ game.ts
tests/
  game.test.ts
  rules.test.ts
README.md
VALIDATION.md
```

## Referências oficiais

- [Condições e operações atômicas nas Rules](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Autenticação anônima Web](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Cotas gratuitas do Firestore](https://firebase.google.com/docs/firestore/quotas)
- [Workflow customizado do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
