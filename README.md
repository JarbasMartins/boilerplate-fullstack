# Monorepo Starter — Base técnica para novos projetos WEB

Este repositório é um starter (boilerplate) monorepo destinado a servir como base técnica para iniciar projetos web reais. O objetivo é fornecer, desde o primeiro commit, uma arquitetura escalável, separação clara de responsabilidades e um padrão de autenticação funcional — tratado como infraestrutura resolvida, não como objetivo do produto.

**Visão geral**

- Este é um monorepo contendo um backend e um frontend desacoplados porém integrados para desenvolvimento e evolução conjunta.
- O backend encontra-se em [apps/api](apps/api) e é um serviço Node.js em TypeScript, organizado por domínio.
- O frontend encontra-se em [apps/web](apps/web) e é uma aplicação React com Vite, organizada por features (feature-based).
- Autenticação inicial está disponível como infraestrutura baseada em `JWT` e integração com MongoDB já está preparada.

**Objetivos do repositório**

- **Reduzir tempo de setup:** trazer convenções, scripts e estrutura para iniciar um projeto real rapidamente.
- **Padronizar arquitetura:** fornecer um padrão repetível para estruturar backend modular e frontend orientado a features.
- **Evitar decisões repetidas:** resolver infrações comuns (autenticação básica, estrutura de pastas, tooling) para que equipes foquem no domínio do produto.
- **Facilitar onboarding:** estrutura e exemplos claros para novos devs entenderem o fluxo da aplicação rapidamente.
- **Permitir evolução contínua:** projetado para crescer sem refatorações traumáticas quando novas features ou integrações forem adicionadas.

**Arquitetura geral**

- **Monorepo:** centraliza código de frontend e backend, facilitando sincronização, compartilhamento de tipos e scripts de desenvolvimento. Não impõe um gerenciador de workspaces específico — o repositório já contém múltiplos `package.json` em [apps/api](apps/api) e [apps/web](apps/web).
- **apps/api:** serviço Node.js em TypeScript, com organização modular por domínio em `modules/` (ex.: `user`). A autenticação é implementada como módulo/feature base com separação entre controller, service e persistência.
- **apps/web:** aplicação React com Vite, organizada por features (pasta `features/`) — cada feature agrupa rotas, componentes, hooks e serviços relacionados. A filosofia é crescer por features, não por páginas isoladas.
- **Integração:** Backend expõe rotas e contratos que o frontend consome; ambos convivem no monorepo para facilitar mudanças sincronizadas e compartilhamento de tipos quando aplicável.

**Padrão de autenticação**

- A autenticação é tratada como infraestrutura inicial e não como produto final. O padrão atual:
    - Protocolo: `JWT` (token de acesso) como abordagem inicial.
    - Separação em camadas: `controller` (interface HTTP), `service` (lógica de negócio e regras) e `repository/persistência` (acesso ao MongoDB).
    - Usuários e credenciais estão modelados no domínio (`modules/user`).
    - Tokens são gerados e validados no backend; o frontend tem uma feature de autenticação pronta para uso.
- Considerações arquiteturais: o código está organizado para permitir a evolução para refresh tokens, OAuth, SSO, provedores externos ou troca do mecanismo de tokens, sem reescrever a lógica de domínio.

**Tecnologias e ferramentas (escolhidas e presentes)**

- **TypeScript** — tipagem estática em frontend e backend.
- **Node.js** — runtime do backend.
- **Express** — framework HTTP no backend (implementação atual está em `apps/api/src`).
- **React** — biblioteca UI no frontend.
- **Vite** — bundler/development server do frontend.
- **MongoDB** com **Mongoose** — persistência de dados no backend; inicialização em [apps/api/src/config/db.ts](apps/api/src/config/db.ts).
- **ESLint** — linting e padronização do código (configurações no monorepo e em `apps/web` quando aplicável).

Observação: a lista acima contém somente as tecnologias já escolhidas e presentes no repositório; não faz suposições sobre infra adicional (ex.: gerenciador de pacotes, orquestração, ou provedores de CI) que não estejam explicitamente implementados aqui.

**O que já existe neste repositório**

- Estrutura de monorepo com `apps/api` e `apps/web`.
- Backend Node.js + TypeScript com módulos por domínio (`apps/api/src/modules`).
- Frontend React + Vite organizado por features (`apps/web/src/features`).
- Padrão base de autenticação com JWT e separação controller/service/repository.
- Integração inicial com MongoDB via arquivo de configuração em [apps/api/src/config/db.ts](apps/api/src/config/db.ts).
- Configurações básicas de tooling (TypeScript, ESLint, config de Vite no frontend).

**O que está em aberto / roadmap**

- Estratégia de refresh tokens (arquitetura e armazenamento seguro).
- Integração com OAuth / SSO (ex.: provedores externos) — planejamento e implementações concretas ainda abertas.
- Gestão e estratégia de secrets (vault/secret manager, criptografia): decisão pendente.
- Testes automatizados: cobertura de unit e integração ainda limitada; proposta de padrão de testes e CI deve ser adicionada.
- Pipelines de CI/CD e deployments: nenhum provedor de CI/CD está pré-configurado no repositório.
- Políticas de observabilidade (logs centralizados, métricas, tracing) — não implementadas por padrão.

Cada item do roadmap está intencionalmente separado da implementação base — a base deve servir como ponto de partida, não como solução completa para todas necessidades operacionais.

**Diretrizes para contribuição e evolução**

- Para adicionar uma nova feature no frontend, criar uma pasta em `apps/web/src/features/<nome>` agrupando rotas, componentes, hooks e serviços.
- Para adicionar um novo domínio no backend, criar `apps/api/src/modules/<domínio>` com `controller`, `service`, `repository` e `schema/types` quando aplicável.
- Manter a separação de responsabilidades: `controller` só lida com requisição/resposta HTTP, `service` contém lógica de negócio, `repository` contém interações com o banco.
- Evitar: acoplar regras de negócio diretamente a detalhes de transporte (HTTP) ou persistência; evitar espalhar validação e autenticação sem passar pelo `service` central.
- Não assumir mudanças não-declaradas: mudanças como introduzir OAuth ou mudar para outro banco de dados devem vir acompanhadas de um plano de migração e adaptação da camada de persistência.

**Como usar / primeiros passos**

- Consulte os `package.json` em [apps/api](apps/api) e [apps/web](apps/web) para scripts de desenvolvimento e comandos já definidos.
- A configuração do banco está em [apps/api/src/config/db.ts](apps/api/src/config/db.ts); ajuste as variáveis de ambiente conforme necessário.

**Observações finais**

- Este repositório é uma base técnica — não é um produto acabado. Serve para acelerar decisões iniciais e reduzir trabalho repetitivo.
- A autenticação fornecida é um padrão inicial baseado em `JWT`; trate-a como infraestrutura que pode (e deve) evoluir conforme requisitos de segurança e produto.
- Decisões futuras (refresh tokens, OAuth, gestão de secrets, observabilidade, CI/CD) devem respeitar a separação arquitetural aqui estabelecida.
