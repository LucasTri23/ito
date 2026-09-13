# Validação da entrega

## Atualização: Nem a pato! e Top 10 — 13/09/2026

- Duas rotas e atalhos no menu; 24 perguntas e 12 rankings pesquisados, com fontes e recortes temporais explícitos.
- Modos Geral joga (revelação por botão) e Temos ADM (resposta aberta), filtro de assunto e sorteio sem repetição. A troca de jogo remonta o estado para evitar transportar respostas abertas ou IDs entre jogos.
- `npm test`: 16 testes passaram, incluindo seis novos testes dos jogos. Seis testes de regras ignorados sem emulador; nenhuma regra ou operação de Firestore foi alterada nesta entrega.
- Lint e build de produção verificados. Testes de marcação validam respostas escondidas e ordem do Top 10; não substituem cliques reais ou inspeção visual, que permanece pendente sem navegador conectado.
- Rankings estáticos, consultados em 13/09/2026; fontes e critérios documentados em `docs/jogos-de-palpites.md`.

## Atualização: catálogo ampliado e dicas — 13/09/2026

- 871 cartas: 251 personagens, 297 filmes/séries e 323 identidades bíblicas; cada uma tem três dicas distintas (difícil, média e fácil).
- Botão revela uma dica por vez e fica desabilitado após a terceira. O componente reinicia ao mudar a carta/categoria; a explicação fica em um painel expansível.
- Testes verificam mínimo de 200 por categoria, nomes e IDs únicos, integridade das dicas, todos os protagonistas dos 54 capítulos de Ande Corajosamente com Deus, nomes pedidos, fontes e ciclos sem repetição.
- `npm test`: 10 testes passaram; 6 testes de regras foram ignorados porque o emulador não estava ativo. Esta alteração não modifica regras ou operações do Firestore.
- `npm run lint` e build TypeScript/Vite passaram. As restrições de leitura do ambiente exigiram executar Vite fora do sandbox.
- 186 URLs de capítulos bíblicos consultadas com resposta HTTP 200; os índices e relatos dos dois livros também foram consultados. A conferência de links é diferente de uma garantia automática de precisão editorial de cada pista.
- O navegador não estava disponível (`No browser is available`; descoberta retornou lista vazia). Conferência visual e interação real de cliques continuam pendentes; os testes automatizados acima cobrem dados e sorteio.
- IDs têm prefixo de versão para não reaproveitar IDs numéricos antigos, inclusive quando o título é um número, como o filme 300.

## Atualização: pré-lobby e Quem sou eu — 13/09/2026

- Página inicial com seleção de jogos e aba de sorteio presencial em um aparelho, sem autenticação ou banco para Quem sou eu.
- Catálogo de 30 nomes; fontes bíblicas consultadas no jw.org e vinculadas em cada carta.
- Testes acrescentados para isolamento de categorias, ausência de repetição durante o ciclo, reinício sem repetir imediatamente e presença de fontes nas cartas bíblicas.
- Nenhuma mudança em Firestore Rules. Inspeção visual em navegador permanece pendente nesta sessão.

## Atualização: modo presencial — 11/09/2026

- Modo presencial separado, distribuição ao entrar, carta grande com giro e toque para esconder/mostrar; único controle de jogo do anfitrião: reenviar cartas.
- Seis testes de aplicação passaram e seis testes de regras passaram no emulador. O teste presencial cobre criação da sala, ingresso tardio, leitura privada inclusive contra o anfitrião, imutabilidade durante a distribuição, proibição de reenvio por jogador comum e recebimento na nova distribuição.
- Build TypeScript/Vite e lint verificados. A animação ainda depende de validação visual em navegador; os testes de regras não verificam a renderização.
- Publicar as novas regras no banco configurado antes de disponibilizar esta versão do site.

Executada em 7 de setembro de 2026, Windows, Node 24.15.0.

## Executado

- `npm install`: concluído; lockfile gerado.
- `npm run build`: TypeScript estrito e build Vite concluídos.
- `npm run lint`: concluído sem erros.
- `npm test`: 3 testes unitários passaram; a suíte de regras é ignorada nesse comando sem emulador.
- `npm run test:rules`: **5 testes reais passaram** no Firestore Emulator 1.22.0 usando Java 21 portátil. Projeto fictício `demo-entrelinhas`, sem banco de produção.
- A suíte confirma: número próprio legível; número alheio bloqueado inclusive ao anfitrião; listagem antecipada bloqueada; sobrescrita e valor fora de 1–100 bloqueados; não membros e usuários sem autenticação bloqueados; jogador comum impedido de ordenar/revelar; anfitrião impedido de pular estados; resposta fora de vez e edição bloqueadas; resultado libera leitura somente aos membros; próxima rodada apaga dados anteriores; até oito marcadores de prontidão respeitam o limite de acessos das regras.
- Cenário automatizado de quatro identidades percorreu distribuição, apresentação, respostas, ordenação, confirmação, resultado e criação da próxima rodada.
- Revisão do Pages: assets relativos (`base: './'`), HashRouter, branch main, `npm ci`, build de dist, permissões e actions oficiais.
- `npm audit --omit=dev`: zero vulnerabilidades. Auditoria completa: nove alertas moderados em dependências transitivas das ferramentas de desenvolvimento (Firebase CLI e dependências). `npm audit fix` não resolveu os alertas restantes; não foi usado `--force`, que sugeria downgrade incompatível da CLI. Essas ferramentas não são incluídas no bundle do navegador.

## Não executado / depende de configuração externa

- Inspeção visual e partida manual em quatro navegadores: a ferramenta de navegador não encontrou nenhum navegador conectado. O checklist completo está no README; teste automatizado de Rules não substitui validação visual da interface e dos listeners.
- Autenticação anônima e multiplayer contra Firebase real: não foram fornecidos dados de projeto. Nenhum `.env` real foi criado.
- Publicação do Firestore e GitHub Pages: dependem do projeto Firebase e do repositório GitHub do usuário; nenhum deploy remoto foi realizado.

## Particularidades do ambiente

O PowerShell bloqueia `npm.ps1`; foi usado `npm.cmd`. O sandbox inicial impediu o esbuild de acessar diretórios ancestrais; build e testes foram executados com a permissão do ambiente. Foi baixado Java 21 portátil em `.tools/java21` porque o Java do sistema é 8. A pasta `.tools` é ignorada pelo Git e não é parte da aplicação.
