# Diagrama de Banco de Dados: Fiscal BI (DER)

### 🗂️ Detalhamento das Tabelas

1.  **CIDADES**: Tabela mestra de localizações. O campo `uf` é utilizado para filtros regionais no BI.
2.  **CLIENTES**: Empresas cadastradas no sistema. Cada cliente está obrigatoriamente vinculado a uma cidade.
3.  **PESSOAS**: Contatos e representantes vinculados aos clientes. Implementado para permitir uma gestão detalhada de contatos comerciais.
4.  **NOTAS**: Cabeçalho dos documentos fiscais. Armazena a data de emissão e o valor total consolidado.
5.  **ITEM_NOTAS**: Detalhamento dos itens que compõe a nota. A soma de `valor_unitario * quantidade` deve bater com o total da nota.
6.  **PARC_NOTAS**: Gestão financeira da nota (contas a receber). Armazena as datas de vencimento e recebimento efetivo.

### 🔑 Chaves e Índices
- Todas as chaves primárias são do tipo `BIGSERIAL` para garantir unicidade e performance.
- Existem índices criados para otimizar as buscas por `uf`, `data_emissao` e vínculos de clientes/cidades.
