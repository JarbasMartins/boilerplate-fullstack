## 1. **Visão Geral do Projeto**

- O que o projeto é

    Projeto monorepo para implementar um sistema de autenticação baseado em JWT, composto por uma API (backend) e uma aplicação web (frontend), com estrutura modular preparada para evolução e compartilhamento de código.

- Qual problema ele resolve

    Fornecer autenticação e autorização para aplicações web/mobile com tokens JWT, permitindo identificação de usuários, proteção de rotas e escalabilidade horizontal do serviço de autenticação.

- Escopo inicial
    - Implementar endpoints de registro e login.
    - Emissão de JWTs de acesso (e definição de estratégia para refresh tokens).
    - Proteção de rotas no backend por middleware de verificação de token.
    - Integração básica no frontend (páginas de Login/Register e consumo de tokens).

## 2. **Objetivo Principal**

- Implementar autenticação JWT

    Implementar a emissão, verificação e renovação de JWTs para autenticação de usuários de forma segura.

- Separar responsabilidades corretamente

    Garantir que responsabilidades — controllers, serviços, models e middlewares — fiquem isoladas e testáveis.

- Facilitar escalabilidade futura

    Projetar interfaces e separação de camadas para permitir scaling horizontal (estateless access tokens) e substituição de componentes (ex.: troca de DB, adicionamento de cache, AD/SSO).

## 3. **Arquitetura Geral**

- Explicação do uso de monorepo

    O monorepo organiza múltiplos aplicativos e pacotes relacionados em um único repositório para facilitar compartilhamento de código, sincronização de versões e coordenação de mudanças (apps/api, web, possíveis packages/shared no futuro).

- Organização em apps
    - `apps/api` — API backend (Node + TypeScript). Módulos por recurso (ex.: `user`). Contém `shared` para middlewares e utilitários.
    - `apps/webweb` — Frontend (React + Vite + TypeScript). Contém features organizadas por domínio (ex.: `features/user`).

- Responsabilidades de cada camada
    - Backend (API): lógica de negócio, persistência, emissão/validação de tokens, middlewares de segurança, endpoints REST/GraphQL.
    - Frontend (Web): telas de autenticação, armazenamento seguro temporário de tokens (em memória, httpOnly cookie ou localStorage conforme estratégia), integração com API, UX de autenticação.
    - Shared: tipos TypeScript, contratos de API, validações e utilitários reutilizáveis.

## 4. **Situação Atual do Projeto**

- O que já foi implementado
    - Estrutura inicial do monorepo com `apps/api` e `apps/web`.
    - No backend, existência do módulo `user` com arquivos: `user.controller.ts`, `user.routes.ts`, `user.schema.ts`, `user.service.ts`, `user.types.ts`.
    - No frontend, estrutura de `features/auth` com páginas `Login.tsx` e `Register.tsx`.
    - Configurações de TypeScript e Vite presentes (`tsconfig.*`, `vite.config.ts`).
    - Ferramentas de lint/estilo: `eslint.config.js`.
    - `mongoose` foi instalado (indicando uso de MongoDB como opção de persistência).

- Estrutura de pastas atual (resumo)
    - `apps/api/` — código do backend (módulos, shared, middlewares)
    - `apps/web` — frontend React + Vite
    - `package.json` na raiz (monorepo)

- Tecnologias já escolhidas
    - TypeScript (em toda a stack)
    - React + Vite (frontend)
    - Node.js (backend)
    - MongoDB via `mongoose` (persistência) — pacote já instalado
    - ESLint, PostCSS (frontend configurado)

- Decisões arquiteturais já tomadas
    - Monorepo com separação `apps/*`.
    - Modularização por recurso no backend (`modules/user`).
    - Organização de features no frontend (`features/auth`).

## 5. **O que AINDA NÃO foi implementado**

- Itens pendentes
    - Emissão e verificação de JWTs (endpoints e middleware).
    - Estratégia de refresh tokens (persistidos, JWT com refresh ou rolling tokens).
    - Fluxos completos de login/registro integrados com backend (hash de senha, validação de inputs).
    - Proteção de rotas no frontend e renovação automática de tokens.
    - Estratégia de armazenamento seguro de secrets (secrets manager / env vars bem definidas).
    - Testes automatizados para autenticação (unit/integration).
    - CI/CD e políticas de deploy.

- Partes propositalmente ausentes
    - Implementação de provedores externos de identidade (OAuth, OIDC) — em aberto.
    - Escolha definitiva do framework HTTP do backend (Express/Fastify/etc.) — em aberto.

- Limitações atuais
    - Repositório em fase inicial; muitas decisões de segurança e operações estão em aberto.
    - Não há ainda política definida para rotação de chaves JWT e gerenciamento de revogação.

## 6. **Diretrizes Arquiteturais**

- Padrões a seguir
    - Segregar responsabilidades: controllers (HTTP), services (negócio), repositories/daos (persistência).
    - Usar DTOs e validação de entrada (ex.: schemas Zod/joi/types) antes de acessar serviços.
    - Escrever middlewares independentes para autenticação e autorização.
    - Tipar as interfaces publicamente exportadas e manter contratos entre frontend/backend consistentes.

- O que evitar
    - Não colocar lógica de negócio em controllers.
    - Não armazenar secrets no repositório (use env vars / secret manager).
    - Evitar chamadas síncronas bloqueantes no event loop do Node.

- Regras de organização do código
    - Módulos por domínio em `apps/api/src/modules/<domain>`.
    - Arquitetura: `controller` -> `service` -> `repository` -> `model/schema`.
    - Tests ao lado do código (`__tests__` ou `*.spec.ts`) seguindo a mesma hierarquia.
    - Expor contratos (tipos) reutilizáveis via `packages/` ou `apps/*/shared` quando necessário.

- Convenções importantes
    - Variáveis sensíveis via `process.env`; documentar variáveis necessárias em `.env.example`.
    - Usar lint/formatter configurados no repositório.
    - Arquivos de configuração (tsconfig, eslint) versionados e padronizados.

## 7. **Próximos Passos Planejados**

- Ordem sugerida de implementação
    1. Definir política de secrets e variáveis de ambiente (`.env.example`) — chaves JWT, URI do DB.
    2. Implementar a modelagem do usuário (campos mínimos) e persistência (Mongoose schemas já presentes como ponto de partida).
    3. Implementar registro: hashing de senha (bcrypt/argon2) e validação.
    4. Implementar login: verificação de credenciais e emissão de JWT de acesso.
    5. Implementar middleware de verificação de JWT para rotas protegidas.
    6. Definir e implementar estratégia de refresh tokens (persistência vs stateless).
    7. Integrar frontend: páginas de login/register e fluxo de armazenamento/uso de token.
    8. Adicionar testes unitários e de integração para fluxos de autenticação.
    9. Configurar CI/CD básico e documentar deploy.

- Dependências entre tarefas
    - Middleware de verificação de JWT depende da forma de emissão e das chaves/segredos definidos.
    - Frontend depende dos endpoints backend estabilizados (contratos/URLs).
    - Estratégia de refresh token impacta design de persistência e revogação.

- Pontos de atenção
    - Decidir armazenamento do refresh token (httpOnly cookie vs armazenamento no client).
    - Política de expiração e rotação de chaves JWT.
    - Mitigações para replay/compromise (lista de revogação, short-lived tokens).
    - CORS e segurança nas configurações do frontend/backend.

## 8. **Instruções para Outras IAs**

- Como a IA deve se comportar ao ajudar neste projeto
    - Ser conservadora: apresentar opções com trade-offs claros, não aplicar mudanças arquiteturais sem aprovação humana.
    - Priorizar segurança e testabilidade nas sugestões de implementação.

- O que ela pode sugerir
    - Bibliotecas adequadas (ex.: bcrypt/argon2 para hashing, jsonwebtoken/jose para JWTs), com prós e contras.
    - Padrões de código e refatorações para melhorar separação de responsabilidades.
    - Estruturas de testes e exemplos de casos de integração.

- O que ela NÃO deve assumir
    - Não deve assumir provedores de infraestrutura (cloud vendor), frameworks HTTP específicos ou políticas de secrets sem confirmação.
    - Não deve inserir secrets reais no repositório ou gerar chaves de produção automaticamente.

- Grau de liberdade para decisões técnicas
    - Baixo a médio: pode propor implementações concretas e gerar código exemplo, porém deve sempre indicar pontos em aberto (ex.: escolha de framework, política de refresh tokens) e pedir confirmação antes de mudanças irreversíveis.

---

Observação final: elementos que não estão explicitamente definidos no repositório foram marcados como "em aberto". Para avançar com implementação automática, confirmar preferências sobre: framework HTTP do backend, estratégia de refresh tokens, método de armazenamento de tokens no cliente e política de rotação de chaves.
