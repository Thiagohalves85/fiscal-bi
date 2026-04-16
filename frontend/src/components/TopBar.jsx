import { useLocation } from 'react-router-dom'

const LABELS = {
  '/':          { crumb: 'Dashboard',     sub: 'Visão geral do sistema'             },
  '/cidades':   { crumb: 'Cidades',       sub: 'Gerenciar cadastro de cidades'      },
  '/clientes':  { crumb: 'Clientes',      sub: 'Gerenciar cadastro de clientes'     },
  '/notas':     { crumb: 'Notas Fiscais', sub: 'Consultar e emitir notas fiscais'   },
  '/gerador':   { crumb: 'Gerador BI',    sub: 'Geração de dados em massa para BI'  },
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const info = LABELS[pathname] ?? { crumb: 'Fiscal BI', sub: '' }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          id="menu-toggle-btn"
          className="hamburger-btn"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          ☰
        </button>
        <nav className="breadcrumb" aria-label="breadcrumb">
          <span>Fiscal BI</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{info.crumb}</span>
        </nav>
      </div>

      <div className="topbar-right">
        <div className="topbar-pill">
          <span className="dot" />
          <span>{info.sub}</span>
        </div>
      </div>
    </header>
  )
}
