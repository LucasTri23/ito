# Validação da entrega

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
