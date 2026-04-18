# Detalhamento Técnico - Fiscal BI (Baseado no Código)

Este documento descreve a arquitetura real da aplicação, mapeando as classes, nomenclaturas e funcionalidades implementadas tanto no Backend quanto no Frontend.

> [!IMPORTANT]
> **Documentação Exportada:**
> - [Download PDF: Backend_Detalhado.pdf](file:///C:/Users/Usuario/.gemini/antigravity/brain/8e63a9af-9b6d-47f4-98d6-28a67d63f2a2/Backend_Detalhado.pdf)
> - [Download PDF: Frontend_Detalhado.pdf](file:///C:/Users/Usuario/.gemini/antigravity/brain/8e63a9af-9b6d-47f4-98d6-28a67d63f2a2/Frontend_Detalhado.pdf)
> - [Download PDF: Funcionalidades_Sistema.pdf](file:///C:/Users/Usuario/.gemini/antigravity/brain/8e63a9af-9b6d-47f4-98d6-28a67d63f2a2/Funcionalidades_Sistema.pdf)

## 1. Modelagem do Backend (Spring Boot)

### 1.1 Entidades de Domínio (JPA)

As entidades refletem a estrutura exata do banco de dados:

*   **Cidade** (`codCidade`, `nome`, `uf`)
*   **Cliente** (`codCliente`, `nome`, `cidade`)
*   **Nota** (`codNota`, `cliente`, `dataEmissao`, `valorTotal`, `itens`, `parcelas`)
*   **ItemNota** (`codItemNota`, `nota`, `valorUnitario`, `quantidade`)
*   **ParcNota** (`codParcNota`, `nota`, `numero`, `valorVencimento`, `dataVencimento`, `valorRecebimento`, `dataRecebimento`)

### 1.2 Camada de Serviço e Regras de Negócio

*   **NotaService**: 
    *   `validarNota()`: Validação de consistência financeira (Soma de Itens e Parcelas).
    *   `getEstatisticas()`: Agregação de KPI (Total Notas, Valor Total, Valor Recebido).
    *   `listar(Pageable, search)`: Busca textual e paginação.

---

## 2. Modelagem do Frontend (React + Vite)

### 2.1 Componentes e Páginas

*   **Dashboard.jsx**: Consome `/api/notas/stats` para exibir o resumo do BI.
*   **Notas.jsx**: Tela principal de gestão com filtros de busca.
*   **Gerador.jsx**: Aciona a rotina `POST /api/generator`.

### 2.2 Camada de Serviços (Axios)

Localizada em `frontend/src/api/services.js`:
*   `getNotas(params)`, `getNotaStats()`, `gerarNotas(params)`
*   `getCidades()`, `createCidade(data)`, `deleteNota(id)`
