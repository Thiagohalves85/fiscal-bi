# 🐳 Docker — Como Subir a Aplicação Completa

Guia completo para executar o **Fiscal BI** (PostgreSQL + Backend + Frontend) inteiramente em containers Docker.

---

## 📋 Pré-requisitos

| Ferramenta         | Versão mínima | Download                                   |
|--------------------|---------------|--------------------------------------------|
| **Docker Desktop** | 24+           | https://www.docker.com/products/docker-desktop |
| **Docker Compose** | v2 (incluído) | Já vem junto com o Docker Desktop          |

> [!IMPORTANT]
> O Docker Desktop deve estar **rodando** antes de executar qualquer comando. Verifique com:
> ```powershell
> docker info
> ```

---

## 🏗️ Arquitetura dos Containers

```
┌─────────────────────────────────────────────────────┐
│                   docker-compose                    │
│                                                     │
│  ┌──────────────┐   ┌────────────┐   ┌──────────┐  │
│  │  PostgreSQL  │◄──│  Backend   │◄──│ Frontend │  │
│  │  porta 5432  │   │ porta 8080 │   │ porta 80 │  │
│  │  (interno)   │   │ (interno)  │   │(exposta) │  │
│  └──────────────┘   └────────────┘   └──────────┘  │
│                                                     │
│  Volume: postgres_data (dados persistidos)          │
└─────────────────────────────────────────────────────┘
```

| Container              | Imagem base               | Porta pública |
|------------------------|---------------------------|---------------|
| `fiscal-bi-db`         | `postgres:16-alpine`      | `5432` (opcional) |
| `fiscal-bi-backend`    | `eclipse-temurin:21-jre`  | `8080` (opcional) |
| `fiscal-bi-frontend`   | `nginx:1.27-alpine`       | **`80`** ← acesso principal |

---

## 🚀 Subindo a Aplicação

### 1. Abra o terminal na raiz do projeto

```powershell
cd C:\Users\Usuario\Documents\projetos\java\fiscal-bi
```

### 2. Construa as imagens e suba todos os containers

```powershell
docker compose up --build
```

> Esse comando faz tudo em sequência:
> 1. Constrói a imagem do **backend** (Maven → JRE)
> 2. Constrói a imagem do **frontend** (Node → Nginx)
> 3. Sobe o **PostgreSQL** e espera ele estar saudável
> 4. Sobe o **backend** e espera ele estar saudável
> 5. Sobe o **frontend**

> [!NOTE]
> Na **primeira execução**, o build pode levar **3–8 minutos** pois o Maven precisa baixar todas as dependências. Execuções subsequentes são muito mais rápidas (cache de camadas).

### 3. Acesse a aplicação

Assim que os 3 containers estiverem `healthy`, abra no navegador:

```
http://localhost
```

---

## 🔄 Comandos do Dia a Dia

```powershell
# Subir em background (sem travar o terminal)
docker compose up --build -d

# Ver status dos containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Parar todos os containers (mantém os dados)
docker compose down

# Parar E remover o volume de dados (⚠️ apaga o banco!)
docker compose down -v

# Rebuildar apenas um serviço específico
docker compose up --build backend -d
```

---

## 🔁 Rebuild após mudanças no código

Sempre que modificar código do backend ou frontend, refaça o build:

```powershell
# Rebuild completo
docker compose up --build -d

# Rebuild apenas de um serviço (mais rápido)
docker compose up --build backend -d
docker compose up --build frontend -d
```

---

## ⚙️ Variáveis de Ambiente

O backend aceita variáveis de ambiente para configuração do banco. Os valores padrão já estão definidos no `docker-compose.yml`:

| Variável                            | Valor padrão (Docker)                        |
|-------------------------------------|----------------------------------------------|
| `SPRING_DATASOURCE_URL`             | `jdbc:postgresql://postgres:5432/fiscal_bi`  |
| `SPRING_DATASOURCE_USERNAME`        | `postgres`                                   |
| `SPRING_DATASOURCE_PASSWORD`        | `postgres`                                   |
| `SPRING_JPA_HIBERNATE_DDL_AUTO`     | `update`                                     |
| `SPRING_FLYWAY_ENABLED`             | `false`                                      |

Para customizar, edite a seção `environment` do serviço `backend` no `docker-compose.yml`.

---

## 🧭 Como o Frontend Chega ao Backend

No container, o Nginx faz o papel de **proxy reverso**:

```
Navegador → http://localhost/api/cidades
                    ↓
         Nginx (container frontend:80)
                    ↓ location /api/
         Backend (container backend:8080)
                    ↓
         PostgreSQL (container postgres:5432)
```

Todas as chamadas `/api/*` são redirecionadas internamente para o backend — sem exposição desnecessária de portas e sem problema de CORS.

---

## 🛠️ Solução de Problemas

### ❌ `docker info` retorna erro / daemon não encontrado

O Docker Desktop não está rodando. Abra-o pela barra de tarefas ou pelo menu Iniciar.

---

### ❌ `Port 80 is already allocated`

A porta 80 já está em uso na sua máquina (outro servidor web, por exemplo).  
Mude a porta do frontend no `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "3000:80"   # acesse em http://localhost:3000
```

Mesmo procedimento para a porta `8080` (backend) ou `5432` (banco).

---

### ❌ Backend em `health: starting` por muito tempo

O Spring Boot pode demorar para inicializar. Acompanhe os logs:

```powershell
docker compose logs -f backend
```

Se aparecer `Connection refused` ao banco, o PostgreSQL ainda não está pronto — o Compose já trata isso com `depends_on + healthcheck`. Aguarde.

---

### ❌ Frontend carrega mas a API retorna erro

Verifique se o backend está `healthy`:

```powershell
docker compose ps
```

Se o backend estiver em `unhealthy` ou `exited`, veja os logs:

```powershell
docker compose logs backend
```

---

### ❌ Erro `OCI runtime` ou `WSL` no Windows

Habilite a integração WSL 2 no Docker Desktop:  
`Settings → General → Use the WSL 2 based engine` ✅

---

### ❌ Dados somem após reiniciar

O volume `postgres_data` persiste os dados entre `docker compose down` e `docker compose up`.  
**Mas** se você usou `docker compose down -v`, o volume foi removido e o banco foi apagado. Isso é esperado.

---

## 📁 Arquivos Docker criados

```
fiscal-bi/
├── Dockerfile                  ← build do backend (multi-stage Maven → JRE)
├── docker-compose.yml          ← orquestra os 3 serviços
├── .dockerignore               ← exclui target/, .idea/ do contexto
└── frontend/
    ├── Dockerfile              ← build do frontend (multi-stage Node → Nginx)
    ├── nginx.conf              ← configura proxy /api/ + SPA fallback
    └── .dockerignore           ← exclui node_modules/, dist/
```

---

## ✅ Checklist de Verificação

- [ ] Docker Desktop está rodando (`docker info` sem erro)  
- [ ] Está na raiz do projeto (`fiscal-bi/`)  
- [ ] Executou `docker compose up --build`  
- [ ] Os 3 containers aparecem como `running` em `docker compose ps`  
- [ ] Acessou `http://localhost` e o dashboard carregou  
- [ ] A API responde em `http://localhost/api/cidades`  
