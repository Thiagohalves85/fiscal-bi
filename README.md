# Fiscal BI

Esse é o repositório do **Fiscal BI**, um sistema fullstack que construí do zero para gerenciar a emissão de notas fiscais e gerar dados sintéticos de alta performance para testes de ferramentas de Business Intelligence.

A ideia aqui não foi só fazer um CRUD básico. Meu foco foi resolver gargalos reais: construí o backend otimizando o uso do Hibernate para evitar estourar a memória (Memory Leaks), fiz um frontend React purista sem frameworks complexos de UI (e com foco em performance e precisão de float pra dinheiro) e deixei tudo "conteinerizado" para rodar liso em qualquer ambiente.

## Stack Utilizada

- **Backend:** Java 21 LTS, Spring Boot 3, Hibernate/JPA
- **Frontend:** React 19, Vite, Vanilla CSS
- **Banco de Dados:** PostgreSQL 16
- **Testes e Infra:** Docker, Docker Compose, Vitest, JUnit 5

---

## Como subir o projeto

Eu configurei tudo no Docker Compose para você não ter que instalar dependências de banco de dados e de proxy na mão.

### Pré-requisitos
Só precisa ter o [Docker](https://www.docker.com/) rodando no seu computador.

### Rodando

1. Clonou o repositório? Entre na pasta raiz:
```bash
cd fiscal-bi
```

2. Suba todos os containers de uma vez com o comando:
```bash
docker compose up --build -d
```

> **O que está acontecendo por baixo dos panos?**
> O Docker vai fazer o pull do banco de dados PostgreSQL. Na sequência, a API vai compilar através de um multi-stage build (que torna a imagem em produção super leve). Por fim, o Nginx vai assumir o Frontend e servir também de proxy reverso pro backend para nos livrar de qualquer problema de CORS.

---

## Visualizando a aplicação

Quando os containers estiverem no ar, você vai acessar os serviços de forma limpa pelo `localhost`, sem precisar caçar portas diferentes:

*   🖥️ **Acessar a Aplicação (React):** [http://localhost](http://localhost) 
*   📡 **Rotas da API (Spring):** `http://localhost/api`

Entre na aplicação e fique à vontade para navegar. O Design System é todo local, focado na navegação limpa!

---

## O Gerador de Dados (Testando carga)

O grande diferencial do sistema está na injeção de massa. Criei um `GeneratorService` que consegue socar 50 mil notas e parcelas de uma vez no PostgreSQL de forma muito rápida. 

Para testar, você tem duas opções:

### A) Pela UI
Acesse a aplicação no navegador e clique ali na barra lateral em **"Gerador BI"**. Basta colocar a quantidade de notas, a quem destinar e clicar no botão. 

### B) Jogando carga via Terminal (cURL)
Mandei rodar uma thread paralela na API? Quer disparar do terminal? Sem problemas:
```bash
curl -X POST "http://localhost/api/generator?quantidade=50000"
```
*Detalhe arquitetural: Por trás disso no Java eu configurei uma `FixedThreadPool` de 4 workers fatiando esse volume, enquanto limpo o L1 Cache do JPA com `em.clear()` em blocos de 1000 registros para garantir a saúde do heap de memória.*

---

## Rodando os Testes Automatizados

Caso queira checar os testes das lógicas isoladas e de integração sem subir os contêineres:

**Rodar testes da API (Java):**
```bash
./mvnw test
```

**Rodar testes de Interface (Javascript/React):**
```bash
cd frontend
npm install # caso ainda não tenha baixado os node_modules localmente
npm run test
```
