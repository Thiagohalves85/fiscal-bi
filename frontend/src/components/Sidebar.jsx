import { NavLink, useLocation } from 'react-router-dom'

const NAV = [
  {
    section: 'Visão Geral',
    items: [
      { to: '/',         icon: '⬡', label: 'Dashboard'  },
    ],
  },
  {
    section: 'Cadastros',
    items: [
      { to: '/cidades',  icon: '🏙', label: 'Cidades'   },
      { to: '/clientes', icon: '🏢', label: 'Clientes'  },
      { to: '/pessoas',  icon: '👤', label: 'Pessoas'   },
    ],
  },
  {
    section: 'Fiscal',
    items: [
      { to: '/notas',    icon: '📄', label: 'Notas Fiscais' },
      { to: '/gerador',  icon: '⚡', label: 'Gerador BI'    },
    ],
  },
]

export default function Sidebar({ open, onClose }) {
  const location = useLocation()

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar${open ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">📊</div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">Fiscal BI</span>
            <span className="sidebar-brand-sub">Business Intelligence</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="nav-section-label">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-item${isActive ? ' active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot" />
            API conectada · localhost:8080
          </div>
        </div>
      </aside>
    </>
  )
}
