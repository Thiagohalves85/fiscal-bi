# Diagrama de Estrutura: Frontend Fiscal BI (React)

### 📋 Detalhes da Arquitetura Frontend
1.  **Gerenciamento de Rotas**: Utiliza o `react-router-dom` no `App.jsx` para mapear as URLs amigáveis aos componentes de página.
2.  **Estado Global**: O `ToastContext` gerencia as notificações de feedback do sistema (sucesso/erro) de forma global.
3.  **Modularidade**: 
    - As páginas (`Pages`) cuidam do estado local (`useState`) e dos ciclos de vida (`useEffect`).
    - Os componentes (`Components`) são focados em UI e comportamentos genéricos (ex: Modais).
4.  **Camada de Serviço (API)**: Centralizada em `services.js`, garantindo que todas as chamadas `Axios` sigam o mesmo padrão e configurações do `client.js`.

### 🔗 Relação com o Backend
- Cada serviço no frontend (ex: `getPessoas`) mapeia diretamente para um endpoint documentado no diagrama de classes do backend.
