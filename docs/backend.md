# Documentação: Backend Node.js + TypeScript + Mongoose

## Contexto e finalidade

Este documento tem por objetivo servir como referência técnica e material de estudo para desenvolvedores iniciantes e intermediários que trabalham em um backend típico construído com Node.js, TypeScript e Mongoose (ODM para MongoDB). Ele descreve a finalidade geral do código, o fluxo de execução num CRUD (Create, Read, Update, Delete), responsabilidades das camadas (repositório, serviço, controller), e aprofunda decisões de implementação relacionadas a segurança, performance e boas práticas de encapsulamento em TypeScript.

Os exemplos e explicações se baseiam em padrões comuns observados em códigos como `user.schema.ts`, `user.repository.ts`, `user.service.ts` e `password.ts` — adaptáveis a outras entidades e projetos.

## Visão geral da arquitetura

- Controller: expõe rotas e valida entradas/saídas (camada HTTP). Recebe requisições e delega a lógica de negócio para os serviços.
- Service: contém lógica de negócio e orquestra chamadas aos repositórios, validações e transformações de dados.
- Repository: interface com o banco de dados (Mongoose). Encapsula queries e manipulação direta dos modelos.
- Schema/Model: define a estrutura do documento no MongoDB e configurações do Mongoose (campos, índices, seleção de campos sensíveis).
- Utilitários/Shared: funções auxiliares, como `hashPassword` e `comparePassword`, responsáveis por criptografia e comparação de senhas.

Separar responsabilidades dessa forma oferece: testabilidade, isolamento de mudanças (por exemplo, trocar Mongoose por outro ODM), e melhor segurança (exposição controlada de dados).

## CRUD tradicional — responsabilidades e fluxo

Cada operação do CRUD tem papéis bem definidos. Abaixo, o fluxo geral e o propósito de cada método, usando a entidade `User` como exemplo.

- CREATE (`createUser` em `user.service.ts`)
    - Entrada: DTO (ex.: `CreateUserDTO` com `name`, `email`, `password`).
    - Passos principais:
        1. Normalizar dados (ex.: `email.toLowerCase()`).
        2. Validar unicidade (chamar `repository.findByEmail`).
        3. Gerar hash da senha (`hashPassword`).
        4. Persistir via `repository.create` (armazenar `passwordHash` em vez da senha clara).
        5. Retornar uma representação segura do usuário (`toSafeUser`).
    - Responsabilidade: garantir integridade, política de senha, e nunca retornar dados sensíveis.

- READ (
    - Listar: buscar múltiplos registros.
    - Obter por id/email: consultar um único registro via `repository.findById` ou `repository.findByEmail`.
    - Observação: por padrão, queries devem **não** retornar campos sensíveis (ex.: `passwordHash`). Use opções específicas para incluí-los somente quando estritamente necessário.
      )

- UPDATE (`updateUser`)
    - Entrada: DTO de atualização parcial.
    - Passos:
        1. Validar permissões/autorização.
        2. Aplicar mudanças via repositório (`findByIdAndUpdate` ou `save` após `find`).
        3. Caso a senha seja alterada, re-hash e atualizar `passwordHash`.
        4. Retornar `toSafeUser`.
    - Observação: evitar sobrescrever campos sensíveis inadvertidamente. Usar validações estritas.

- DELETE (`deleteUser` / `deactivateUser`)
    - Soft delete (recomendado): marcar `isActive = false`.
    - Hard delete: remover o documento (riscos: perda de histórico, problemas de referência).
    - Preferir soft delete para a maioria dos casos, exceto quando houver razão legal ou técnica para remoção definitiva.

## Fluxo de execução passo a passo (ex.: login)

Exemplo simplificado do fluxo de `login` em `user.service.ts`:

1. `Controller` recebe `email` e `password` e valida formato.
2. Chama `UserService.loginUser({ email, password })`.
3. `UserService` solicita ao `UserRepository` o usuário com o campo `passwordHash` incluído (opção explícita).
4. `passwordHash` é comparado com a `password` enviada via `comparePassword`.
5. Se válido, retornar a versão segura do usuário (`toSafeUser`) e gerar token de autenticação (não mostrado aqui).

Este fluxo exemplifica a necessidade de controlar quando campos sensíveis são trazidos do banco: por padrão, eles devem ficar ocultos.

## Modificadores e palavras-chave em TypeScript

Explicações sobre palavras-chave vistas no código:

- `private`: visibilidade restrita à classe. Evita que consumidores externos acessem métodos/estados internos.
    - Por que usar: reduz superfície de API, impede uso indevido e facilita refatoração interna.
    - O que acontece se não usar: métodos expostos podem ser usados incorretamente por outras partes do sistema, aumentando acoplamento e risco de regressão.

- `readonly`: marca propriedade como imutável após inicialização.
    - Por que usar: garante que dependências injetadas não sejam reatribuídas acidentalmente (ex.: `private readonly repository = new UserRepository()`).
    - Riscos se não usado: reatribuições acidentais podem quebrar a invariante da classe, introduzindo bugs sutis.

- Combinação `private readonly repository`: encapsula a dependência e garante que ela não será substituída, mantendo controle total sobre o comportamento da classe.

Exemplo prático:

```ts
export class UserService {
    constructor(private readonly repository = new UserRepository()) {}
}
```

Porquê: o `UserService` controla como o `repository` é usado; o `readonly` evita substituições durante vida da instância; o `private` evita acesso externo.

## Detalhe crítico: seleção e exposição de campos sensíveis

Trecho de código: `if (includePassword) query.select('+passwordHash'); return query.exec();`

Vamos decompor:

- `userSchema` pode declarar `passwordHash` com `select: false` (conforme visão comum). Isso significa que, por padrão, queries `findOne`/`findById` **não** incluem o campo `passwordHash` na projeção retornada.
    - Exemplo: `{ passwordHash: { type: String, required: true, select: false } }`

- `query.select('+passwordHash')` instrui o Mongoose explicitamente a incluir o campo marcado como não selecionável por padrão.
    - `+` indica inclusão forçada de um campo que normalmente é excluído.

- `return query.exec()` executa a query e retorna uma Promise com o resultado.

Porquê esse padrão é usado:

- Segurança: evitar exposição acidental de hashes de senha (reduz risco em logs, serialização e falhas de controller).
- Princípio do menor privilégio: traga apenas o que você precisa. Para login, precisa do `passwordHash`; para exibir perfis, não.

Como funciona internamente (Mongoose):

- Ao definir `select: false`, o `Schema` configura projeções padrão. Chamadas sem `select(...)` recebem projeção que omite esses campos.
- `query.select('+passwordHash')` altera a projeção da query, instruindo o driver a incluir esse campo no documento retornado.
- `exec()` envia a operação ao MongoDB e resolve a Promise com o documento (ou null).

Consequências se não for usado corretamente:

- Se você nunca incluiu `passwordHash` quando necessário (por ex., login), `comparePassword` receberá `undefined` como hash e bibliotecas como `bcrypt.compare` lançarão erro ou retornarão false — isso explica a mensagem `data and hash arguments required` quando `comparePassword` é chamada com argumentos inválidos.
- Se você incluir `passwordHash` de forma indiscriminada (todas as queries), aumenta-se a superfície de ataque: campos sensíveis podem ser acidentalmente enviados ao cliente, logados ou armazenados em caches.
- Performance: incluir campos extras em consultas aumenta o payload e pode afetar latência, especialmente em listas grandes.

Recomendações:

- Nunca marque `passwordHash` como `select: true` por padrão.
- Em repositórios, ofereça parâmetro explícito `includePassword = false` para deixar a inclusão intencional e clara.
- Sempre colete `passwordHash` apenas no fluxo que exige verificação (login, reautenticação), e mantenha a documentação do repositório explícita.

## `toSafeUser` — propósito e riscos de omissão

Função típica:

```ts
private toSafeUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
```

Propósito:

- Filtrar propriedades sensíveis do objeto `user` antes de retorná-lo ao controlador/cliente.
- Normalizar a representação de saída (por ex., renomear `_id` para `id`).

Porque é crítico:

- Evita o vazamento de `passwordHash` e outros campos internos (tokens, metadata sensível).
- Fornece um ponto único para controlar quais campos a API expõe, facilitando auditoria e conformidade (ex.: LGPD/GDPR).

O que acontece se ignorado:

- Risco de expor dados sensíveis ao cliente.
- Possível envio de campos de plataforma (por ex., flags internas, índices, campos de auditoria) que não deveriam ser públicos.

Quando aplicar `toSafeUser`:

- Sempre ao retornar dados de usuário para camadas externas (controllers, responses HTTP, logs de auditoria públicos).
- Não aplicar apenas quando o verbo exige o `passwordHash` (login), e mesmo assim, garantir que a função que processa o login só retorne a versão segura ao final.

## Segurança — boas práticas e exemplos

- Nunca logar valores de senha ou hashes em logs acessíveis.
- Ao gerar tokens (JWT), não incluir informações sensíveis no payload.
- Rate limiting e lockout: prevenir brute-force em endpoints de login.
- Validar e sanitizar entradas para evitar injeção e problemas de performance (ex.: queries não paginadas em listas).

Exemplo de proteção ao login:

1. Normalizar email.
2. Buscar usuário com `includePassword = true` apenas para verificação.
3. Usar `bcrypt.compare` para validar senha.
4. Se válido, descartar o `passwordHash` e retornar `toSafeUser`.

## Performance e escalabilidade

- Projeção: sempre limitar o conjunto de campos retornados nas consultas (`.select()`), reduzindo payloads.
- Paginação: para listagens, usar paginação com índices e limites; evitar `skip` em coleções muito grandes sem cursor ou índices adequados.
- Índices: criar índices em campos de busca frequente (ex.: `email` com `unique: true, index: true`) para buscas rápidas.

Consequências de más escolhas:

- Fazer `select` amplo em endpoints de listagem aumenta uso de rede e memória.
- Falta de índices em campos usados em `WHERE` degrada performance linearmente.

## Erros comuns e como diagnosticá-los

- Erro: `data and hash arguments required` — significa que a função de comparação de senhas recebeu `undefined` no hash.
    - Causa típica: `findByEmail` não trouxe `passwordHash` por estar `select: false` e a query não forçou a inclusão.
    - Solução: alterar a assinatura do repositório para `findByEmail(email: string, includePassword = false)` e, para login, chamar `findByEmail(email, true)`.

- Erro: retorno inesperado de campos sensíveis
    - Causa: não uso de `toSafeUser` ou projeção negligente.
    - Solução: padronizar uso de `toSafeUser` em todos os fluxos que retornam `User` para camadas externas.

## Recomendações de implementação e checklist

- Schemas
    - Defina `passwordHash` com `select: false`.
    - Adicione `index` e `unique` em `email`.

- Repositório
    - Forneça parâmetro explícito `includePassword = false` em buscas por credenciais.
    - Sempre usar `.exec()` para obter Promise e poder capturar erros com `try/catch`.

- Serviço
    - Normalizar entradas (emails lowercase).
    - Tratar erros específicos (email em uso, credenciais inválidas) e não vazar detalhes sensíveis.
    - Retornar apenas objetos seguros (`toSafeUser`).

- Controller
    - Validar DTOs (bibliotecas como `zod`/`Joi`/`class-validator`).
    - Tratar respostas e status HTTP corretamente (401 para credenciais inválidas, 400 para validação, 201 para criação).

- Segurança adicional
    - Rate limit, lockouts, captchas anti-bot se necessário.
    - Proteção contra brute-force e logging seguro.

## Exemplos curtos

- `user.schema.ts` (trecho):

```ts
passwordHash: { type: String, required: true, select: false }
```

- `user.repository.ts` (padrão recomendado):

```ts
async findByEmail(email: string, includePassword = false) {
  const query = UserModel.findOne({ email });
  if (includePassword) query.select('+passwordHash');
  return query.exec();
}
```

- `user.service.ts` (login):

```ts
const user = await this.repository.findByEmail(email, true);
if (!user || !user.isActive) throw new Error('CREDENCIAIS INVÁLIDAS');
const valid = await comparePassword(password, (user as any).passwordHash);
if (!valid) throw new Error('CREDENCIAIS INVÁLIDAS');
return this.toSafeUser(user);
```

## Conclusão

Este documento cobriu o fluxo clássico de um backend Node.js com TypeScript e Mongoose, com foco em segurança e clareza arquitetural. As decisões apresentadas — encapsulamento via `private readonly`, projeções de campos sensíveis, uso de `toSafeUser`, e parametrização explícita de queries — visam reduzir a superfície de ataque, melhorar a manutenibilidade e tornar o código previsível.

\*\*\*
