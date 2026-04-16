# 📊 Fiscal BI — Documentação Técnica do Backend

> Sistema de geração e gestão de notas fiscais com suporte a geração em massa de dados para análise de Business Intelligence.

---

## 🏗️ Visão Geral da Arquitetura

O projeto segue a **Arquitetura em Camadas** (Layered Architecture), um dos padrões mais consolidados em aplicações Spring Boot enterprise. Cada camada tem uma responsabilidade bem definida e só se comunica com a camada imediatamente abaixo.

```
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT (HTTP Requests)                       │
└────────────────────────────┬─────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              CONTROLLER (Camada de Apresentação)                 │
│  Recebe requisições HTTP, valida DTOs, delega ao Service         │
└────────────────────────────┬─────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                SERVICE (Camada de Negócio)                       │
│  Orquestra a lógica de negócio, chama Mappers e Repositories     │
└───────────────┬────────────────────────────┬─────────────────────┘
                ▼                            ▼
┌───────────────────────┐      ┌─────────────────────────────────┐
│  MAPPER (Conversão)   │      │  REPOSITORY (Acesso a Dados)    │
│  Request → Entity →   │      │  Interface JPA que abstrai      │
│  Response             │      │  todas as queries SQL           │
└───────────────────────┘      └─────────────────┬───────────────┘
                                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│               ENTITY / DOMAIN (Modelo de Domínio)                │
│  Classes JPA mapeadas para tabelas do banco de dados             │
└──────────────────────────────────────────────────────────────────┘
                                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│               PostgreSQL (Banco de Dados Relacional)             │
│  Schema versionado via Flyway                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| Java | 21 | Linguagem principal (LTS) |
| Spring Boot | 3.5.x | Framework principal |
| Spring Data JPA | — | Abstração de acesso a banco |
| Hibernate | — | ORM (implementação do JPA) |
| PostgreSQL | — | Banco de dados relacional |
| Flyway | — | Versionamento de schema de banco |
| Jakarta Validation | — | Validação de dados de entrada |
| Lombok | — | Redução de boilerplate (getters/setters) |
| Maven | — | Gerenciamento de dependências e build |

---

## 📦 Estrutura de Pacotes

```
com.bi.fiscalbi/
│
├── FiscalBiApplication.java          # Ponto de entrada da aplicação
│
├── controller/                       # Camada de Apresentação (REST)
│   ├── CidadeController.java
│   ├── ClienteController.java
│   ├── NotaController.java
│   └── GeneratorController.java
│
├── service/                          # Camada de Negócio
│   ├── CidadeService.java
│   ├── ClienteService.java
│   └── NotaService.java
│
├── mapper/                           # Conversores DTO ↔ Entity
│   ├── CidadeMapper.java
│   ├── ClienteMapper.java
│   └── NotaMapper.java
│
├── domain/
│   ├── entity/                       # Entidades JPA (modelo de banco)
│   │   ├── Cidade.java
│   │   ├── Cliente.java
│   │   ├── Nota.java
│   │   ├── ItemNota.java
│   │   └── ParcNota.java
│   └── dto/
│       ├── request/                  # DTOs de entrada (payload da API)
│       │   ├── CidadeRequest.java
│       │   ├── ClienteRequest.java
│       │   ├── NotaRequest.java
│       │   ├── ItemNotaRequest.java
│       │   └── ParcNotaRequest.java
│       └── response/                 # DTOs de saída (resposta da API)
│           ├── CidadeResponse.java
│           ├── ClienteResponse.java
│           ├── NotaResponse.java
│           ├── ItemNotaResponse.java
│           └── ParcNotaResponse.java
│
├── repository/                       # Interfaces JPA Repository
│   ├── CidadeRepository.java
│   ├── ClienteRepository.java
│   ├── NotaRepository.java
│   ├── ItemNotaRepository.java
│   └── ParcNotaRepository.java
│
├── generator/                        # Módulo de geração de dados em massa
│   ├── GeneratorService.java
│   └── NotaFactory.java
│
└── exception/                        # Tratamento global de erros
    ├── GlobalExceptionHandler.java
    ├── BusinessException.java
    ├── ResourceNotFoundException.java
    └── ErrorResponse.java
```

---

## 🗄️ Modelo de Banco de Dados

O banco é gerenciado pelo **Flyway**, que aplica scripts SQL versionados automaticamente na inicialização da aplicação.

### Diagrama Entidade-Relacionamento

```
┌────────────┐       ┌──────────────┐       ┌───────────────┐
│  cidades   │       │   clientes   │       │     notas     │
│────────────│       │──────────────│       │───────────────│
│ cod_cidade │◄──┐   │ cod_cliente  │◄──┐   │ cod_nota      │
│ nome       │   └───│ cod_cidade   │   └───│ cod_cliente   │
│ uf         │       │ nome         │       │ data_emissao  │
└────────────┘       └──────────────┘       │ valor_total   │
                                            └───────┬───────┘
                                                    │
                              ┌─────────────────────┴──────────────────────┐
                              ▼                                             ▼
                   ┌───────────────────┐                      ┌─────────────────────┐
                   │    item_notas     │                      │     parc_notas      │
                   │───────────────────│                      │─────────────────────│
                   │ cod_item_nota     │                      │ cod_parc_nota       │
                   │ cod_nota          │                      │ cod_nota            │
                   │ valor_unitario    │                      │ numero              │
                   │ quantidade        │                      │ valor_vencimento    │
                   └───────────────────┘                      │ data_vencimento     │
                                                              │ valor_recebimento   │
                                                              │ data_recebimento    │
                                                              └─────────────────────┘
```

### Descrição das Tabelas

| Tabela | Descrição |
|---|---|
| `cidades` | Cadastro de cidades com UF. Entidade raiz da hierarquia. |
| `clientes` | Clientes vinculados a uma cidade. Ponto de segmentação geográfica. |
| `notas` | Nota fiscal vinculada a um cliente, com data de emissão e valor total. |
| `item_notas` | Itens da nota (1..N por nota). Compõem o valor total via `qty × valor_unitario`. |
| `parc_notas` | Parcelas de pagamento (1..N por nota). A soma deve igualar o valor total da nota. |

---

## 🧩 Documentação Detalhada das Classes

### 🔷 Domain — Entidades JPA

#### `Cidade.java`
Entidade mapeada para a tabela `cidades`. Representa uma cidade brasileira usada para segmentação geográfica dos clientes. Possui `codCidade` (PK auto-gerada), `nome` e `uf` (obrigatórios).

#### `Cliente.java`
Entidade mapeada para a tabela `clientes`. Representa um cliente que pode ter várias notas emitidas. Possui um relacionamento `@ManyToOne` com `Cidade` (vários clientes podem estar em uma mesma cidade).

#### `Nota.java`
Entidade central do sistema, mapeada para `notas`. Representa uma nota fiscal. Possui:
- `@ManyToOne` com `Cliente` (muitas notas por cliente).
- `@OneToMany` com `ItemNota` e `ParcNota` — coleções com `CascadeType.ALL` e `orphanRemoval = true`, garantindo que ao deletar uma nota, seus itens e parcelas são deletados automaticamente.
- Validação interna: a soma dos itens **deve** igualar `valorTotal`, e a soma das parcelas **deve** igualar `valorTotal`.

#### `ItemNota.java`
Linha de item de uma nota fiscal. Relacionamento `@ManyToOne` com `Nota`. Contém `valorUnitario` e `quantidade`. O valor total do item é calculado como `valorUnitario × quantidade`.

#### `ParcNota.java`
Parcela de pagamento de uma nota. Relacionamento `@ManyToOne` com `Nota`. Contém `numero`, `valorVencimento`, `dataVencimento` (obrigatórios) e `valorRecebimento`, `dataRecebimento` (preenchidos quando há pagamento).

---

### 🔷 DTOs — Data Transfer Objects

> **Por que usar DTOs?** Para desacoplar o modelo de banco de dados da API pública. Sem DTOs, qualquer mudança na entidade quebra o contrato da API. Além disso, entidades JPA Lazy-loaded podem causar `LazyInitializationException` ou loops de serialização JSON.

#### DTOs de Request (Entrada)
Recebem os dados do cliente HTTP. Contêm todas as validações (`@NotNull`, `@NotBlank`, `@DecimalMin`, etc.).

| Classe | Campos Principais |
|---|---|
| `CidadeRequest` | `nome` (obrigatório), `uf` (obrigatório, 2 chars) |
| `ClienteRequest` | `nome` (obrigatório), `codCidade` (obrigatório — ID para lookup) |
| `NotaRequest` | `codCliente`, `dataEmissao`, `valorTotal`, `itens` (lista), `parcelas` (lista) |
| `ItemNotaRequest` | `valorUnitario` (> 0), `quantidade` (>= 1) |
| `ParcNotaRequest` | `numero` (>= 1), `valorVencimento` (> 0), `dataVencimento` |

#### DTOs de Response (Saída)
Retornados pela API. São simples POJOs sem anotações JPA, completamente seguros para serialização JSON.

| Classe | Diferencial |
|---|---|
| `CidadeResponse` | Espelho simples da entidade |
| `ClienteResponse` | Embute um `CidadeResponse` (objeto aninhado, não só o ID) |
| `NotaResponse` | Embute cliente completo + listas de `ItemNotaResponse` e `ParcNotaResponse` |

---

### 🔷 Mappers

Componentes Spring (`@Component`) responsáveis pela conversão entre DTOs e Entidades. Injetados nos Services.

#### `CidadeMapper`
- `toEntity(CidadeRequest)` → cria uma `Cidade` a partir do request.
- `toResponse(Cidade)` → converte a entidade para `CidadeResponse`.

#### `ClienteMapper`
- `toEntity(ClienteRequest)` → busca a `Cidade` no banco usando o `codCidade` do request. **Lança `ResourceNotFoundException` se não encontrar.**
- `toResponse(Cliente)` → converte cliente + cidade aninhada para `ClienteResponse`.

#### `NotaMapper`
- `toEntity(NotaRequest)` → busca o `Cliente` no banco, cria `ItemNota`s e `ParcNota`s e monta o grafo completo da `Nota` antes de salvar.
- `toResponse(Nota)` → transforma a nota completa em `NotaResponse` com listas de itens e parcelas.

---

### 🔷 Repositories

Interfaces que estendem `JpaRepository<Entidade, Long>`. O Spring Data JPA gera automaticamente a implementação com os métodos:
- `findAll()` — lista todos os registros.
- `findById(id)` — busca por chave primária.
- `save(entity)` — persiste ou atualiza (upsert via ID).
- `deleteById(id)` — remove pelo ID.
- `saveAll(list)` — salva uma lista — **usado pelo GeneratorService para batch insert otimizado**.

---

### 🔷 Services (Camada de Negócio)

#### `CidadeService`
CRUD completo de cidades. Usa `CidadeMapper` para converter DTOs. O método privado `findOrThrow()` centraliza a busca por ID e lança `ResourceNotFoundException` com mensagem descritiva.

#### `ClienteService`
CRUD completo de clientes. O método `atualizar()` busca a entidade existente no banco antes de atualizar, garantindo integridade. Delega a busca da Cidade ao `ClienteMapper`.

#### `NotaService`
Contém a **regra de negócio mais crítica** do sistema: a **validação de consistência financeira** no método `validarNota()`:
1. Soma `valorUnitario × quantidade` de todos os itens.
2. Compara com `valorTotal` da nota → lança `BusinessException` se divergir.
3. Soma `valorVencimento` de todas as parcelas.
4. Compara com `valorTotal` da nota → lança `BusinessException` se divergir.

Isso garante que **nenhuma nota pode ser salva com valores inconsistentes**.

---

### 🔷 Generator (Módulo de Geração de Dados em Massa)

Módulo especializado para popular o banco com dados sintéticos para análise de BI.

#### `NotaFactory`
Fábrica (padrão **Factory Method**) para construção de notas válidas e realistas:
- Gera entre 1 e 5 itens por nota, com quantidade e valor aleatórios.
- Cria entre 1 e 3 parcelas, dividindo o valor total com `RoundingMode.HALF_UP` para evitar diferenças de centavos. A última parcela absorbe o arredondamento residual.
- Simula pagamento com 50% de probabilidade por parcela.
- Gera datas de emissão retroativas (até 1 ano) para simular histórico real.

#### `GeneratorService`
Orquestra a geração com **processamento paralelo**:
```
gerarParalelo(totalNotas)
    └─ cria 4 threads (ExecutorService)
        └─ cada thread chama gerar(totalNotas/4)
            └─ processa em batches de 1.000 notas
                └─ notaRepository.saveAll(lote)
                └─ em.flush() + em.clear()  ← evita OutOfMemoryError
```
> **Ponto de senioridade:** O uso de `em.flush()` + `em.clear()` é essencial. Sem isso, o Hibernate acumula todas as entidades no contexto de persistência (1st-level cache), causando `OutOfMemoryError` em gerações de alto volume.

---

### 🔷 Exception Handling

#### `GlobalExceptionHandler` (`@ControllerAdvice`)
Intercepta exceções em todos os controllers e retorna JSON estruturado. Trata:

| Exceção | HTTP Status | Cenário |
|---|---|---|
| `ResourceNotFoundException` | `404 Not Found` | Entidade não encontrada por ID |
| `BusinessException` | `400 Bad Request` | Regra de negócio violada (ex: totais divergentes) |
| `MethodArgumentNotValidException` | `400 Bad Request` | Falha na validação do `@Valid` |
| `Exception` (genérica) | `500 Internal Server Error` | Erros não tratados (sem expor stacktrace) |

#### `ErrorResponse`
POJO que representa um erro padronizado retornado pela API:
```json
{
  "timestamp": "2026-04-15T18:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação: O nome da cidade é obrigatório, A UF deve ter 2 caracteres",
  "path": "/api/cidades"
}
```

---

## 🌐 Endpoints da API

### Cidades — `/api/cidades`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `GET` | `/api/cidades` | Lista todas as cidades | — |
| `GET` | `/api/cidades/{id}` | Busca cidade por ID | — |
| `POST` | `/api/cidades` | Cria nova cidade | `CidadeRequest` |
| `PUT` | `/api/cidades/{id}` | Atualiza cidade | `CidadeRequest` |
| `DELETE` | `/api/cidades/{id}` | Remove cidade | — |

### Clientes — `/api/clientes`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `GET` | `/api/clientes` | Lista todos os clientes | — |
| `GET` | `/api/clientes/{id}` | Busca cliente por ID | — |
| `POST` | `/api/clientes` | Cria novo cliente | `ClienteRequest` |
| `PUT` | `/api/clientes/{id}` | Atualiza cliente | `ClienteRequest` |
| `DELETE` | `/api/clientes/{id}` | Remove cliente | — |

### Notas — `/api/notas`

| Método | Endpoint | Descrição | Params |
|---|---|---|---|
| `GET` | `/api/notas` | Lista todas as notas | — |
| `GET` | `/api/notas?codCliente=1` | Filtra notas por empresa (cliente) | `codCliente` (Long) |
| `GET` | `/api/notas?codCidade=2` | Filtra notas por cidade | `codCidade` (Long) |
| `GET` | `/api/notas/{id}` | Busca nota pelo código | — |
| `POST` | `/api/notas` | Cria nova nota fiscal | Body: `NotaRequest` |
| `DELETE` | `/api/notas/{id}` | Remove nota e seus itens/parcelas (cascata) | — |

> Os filtros `codCliente` e `codCidade` são **opcionais** e mutuamente exclusivos: se nenhum for informado, lista todas as notas.

### Generator — `/api/generator`

| Método | Endpoint | Descrição | Params |
|---|---|---|---|
| `POST` | `/api/generator?quantidade=N` | Gera N notas para **todos** os clientes (aleatório) | `quantidade` (int, obrigatório) |
| `POST` | `/api/generator?quantidade=N&codCliente=X` | Gera N notas apenas para o cliente especificado | `quantidade` (int), `codCliente` (Long) |

> Se `codCliente` informado não existir, a API retorna `404 Not Found`.

---

## 🚀 Como Subir a API

### Pré-requisitos
- Java 21+ instalado
- Maven 3.8+ instalado
- PostgreSQL rodando localmente (porta 5432)

### Passo 1 — Criar o banco de dados

Conecte ao PostgreSQL e execute:
```sql
CREATE DATABASE fiscal_bi;
```

> O Flyway cuidará de criar todas as tabelas automaticamente na primeira execução.

### Passo 2 — Configurar credenciais (se necessário)

Edite `src/main/resources/application.yaml` se o seu usuário/senha for diferente:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fiscal_bi
    username: postgres   # altere se necessário
    password: postgres   # altere se necessário
```

### Passo 3 — Compilar e subir

```bash
# Na raiz do projeto (onde está o pom.xml)
mvn spring-boot:run
```

A API estará disponível em: **`http://localhost:8080`**

---

## ✅ Validando a API — Exemplos de Requisições

### 1. Criar uma Cidade
```bash
curl -X POST http://localhost:8080/api/cidades \
  -H "Content-Type: application/json" \
  -d '{"nome": "São Paulo", "uf": "SP"}'
```
**Response esperado (200 OK):**
```json
{"codCidade": 1, "nome": "São Paulo", "uf": "SP"}
```

### 2. Criar um Cliente
```bash
curl -X POST http://localhost:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome": "Empresa XPTO", "codCidade": 1}'
```
**Response esperado (200 OK):**
```json
{
  "codCliente": 1,
  "nome": "Empresa XPTO",
  "cidade": {"codCidade": 1, "nome": "São Paulo", "uf": "SP"}
}
```

### 3. Criar uma Nota Fiscal
```bash
curl -X POST http://localhost:8080/api/notas \
  -H "Content-Type: application/json" \
  -d '{
    "codCliente": 1,
    "dataEmissao": "2026-04-15",
    "valorTotal": 200.00,
    "itens": [
      {"valorUnitario": 100.00, "quantidade": 2}
    ],
    "parcelas": [
      {"numero": 1, "valorVencimento": 200.00, "dataVencimento": "2026-05-15"}
    ]
  }'
```

### 4. Gerar notas para BI
```bash
# Para todos os clientes (distribuição aleatória)
curl -X POST "http://localhost:8080/api/generator?quantidade=10000"

# Apenas para o cliente 1
curl -X POST "http://localhost:8080/api/generator?quantidade=5000&codCliente=1"
```
> ⚠️ Antes de gerar, é necessário ter pelo menos uma cidade e um cliente cadastrados.

### 5. Filtrar notas por empresa ou cidade
```bash
# Notas da Empresa Frete.COM (codCliente=1)
curl "http://localhost:8080/api/notas?codCliente=1"

# Notas de todas as empresas de Curitiba (codCidade=1)
curl "http://localhost:8080/api/notas?codCidade=1"

# Buscar nota específica pelo código
curl "http://localhost:8080/api/notas/4001"
```

### 6. Testar validação de erro
```bash
curl -X POST http://localhost:8080/api/cidades \
  -H "Content-Type: application/json" \
  -d '{"nome": "", "uf": "SPP"}'
```
**Response esperado (400 Bad Request):**
```json
{
  "timestamp": "2026-04-15T18:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação: O nome da cidade é obrigatório, A UF deve ter exatamente 2 caracteres",
  "path": "/api/cidades"
}
```

---

## 🏆 Decisões Técnicas — Pontos de Senioridade

| Decisão | Justificativa |
|---|---|
| **DTOs separados das Entidades** | Desacopla o contrato da API do modelo de dados. Mudanças no banco não quebram clientes da API. Elimina serialização circular do Hibernate. |
| **Flyway para versionamento de schema** | Garante que o banco evolua de forma rastreada e reproduzível em qualquer ambiente (dev, staging, prod). Nunca mais "funciona na minha máquina". |
| **`ddl-auto: validate`** | O Hibernate não altera o banco em produção — apenas valida. Evita migrações silenciosas e perigosas. |
| **Batch insert com `flush`/`clear`** | Evita `OutOfMemoryError` ao gerar grandes volumes. O cache L1 do Hibernate é esvaziado a cada 1.000 registros. |
| **`ExecutorService` com pool fixo** | Geração paralela com 4 threads para aproveitar múltiplos cores sem sobrecarregar o banco. |
| **`findOrThrow()` centralizado** | Elimina duplicação de código de busca+exceção. Único ponto para alterar a mensagem de erro. |
| **`@ControllerAdvice` global** | Garante que **nenhum erro vaza stacktrace** para o cliente. Todos os erros têm formato JSON consistente. |
| **Validação de consistência na Nota** | Regra de negócio crítica: a API **rejeita** notas onde itens ou parcelas não somam o total declarado. |
| **`@Transactional(readOnly=true)` nas leituras** | Com `open-in-view: false`, mantém a sessão Hibernate aberta durante o mapeamento das coleções lazy. O `readOnly=true` desativa o dirty checking, melhorando a performance. |
| **`@RequestParam(required=false)` para filtros** | Permite um único endpoint `GET /api/notas` funcionar com ou sem filtros, seguindo o princípio de API RESTful limpa sem proliferação de rotas. |
| **Queries derivadas do Spring Data JPA** | `findByClienteCodCliente()` e `findByClienteCidadeCodCidade()` geram SQL automaticamente a partir do nome do método — zero SQL manual, navegando o grafo de entidades com segurança de tipos. |
