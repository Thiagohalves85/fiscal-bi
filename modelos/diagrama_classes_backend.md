# Diagrama de Classes: Backend Fiscal BI

### 📋 Detalhes da Arquitetura
1.  **Camada de Controle (API)**: Responsável por receber requisições HTTP e retornar respostas padronizadas via `ResponseEntity`.
2.  **Camada de Serviço (Negócio)**: Onde reside a lógica de negócio, validações e orquestração de transações.
3.  **Camada de Persistência (Spring Data)**: Interfaces que estendem `JpaRepository` para abstrair o acesso ao banco de dados.
4.  **Modelo de Domínio (Entidades)**: Classes anotadas com `@Entity` que representam as tabelas do banco de dados.
5.  **Mapeamento (DTOs)**: Objetos de transferência de dados que garantem que o contrato da API seja independente da estrutura interna do banco.
