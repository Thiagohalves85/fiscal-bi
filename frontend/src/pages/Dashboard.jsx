import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCidades, getClientes, getNotas, getNotaStats } from '../api/services'
import { Loading } from '../components/UI'

export default function Dashboard() {
  const [stats, setStats] = useState({
    cidades: 0,
    clientes: 0,
    notas: 0,
    valorEmitido: 0,
    valorRecebido: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentNotas, setRecentNotas] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [cidades, clientes, notaStats, recent] = await Promise.all([
          getCidades(),
          getClientes(),
          getNotaStats(),
          getNotas({ size: 8, sort: 'codNota,desc' }), // Busca apenas as 8 mais recentes
        ])

        setStats({
          cidades: cidades.length,
          clientes: clientes.length,
          notas: notaStats.totalNotas,
          valorEmitido: notaStats.valorTotal,
          valorRecebido: notaStats.valorRecebido,
        })

        setRecentNotas(recent.content || []) // O backend agora retorna Page, usamos .content
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
        setError("Não foi possível carregar os dados do dashboard.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const fmt = (v) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const fmtDate = (d) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—' // Adicionado 'T00:00:00' para garantir que a data seja interpretada no fuso horário local

  if (loading) return <Loading text="Carregando dashboard..." />

  if (error) {
    return (
      <div className="page">
        <div className="empty-state" style={{ padding: '32px 0' }}>
          <span className="empty-icon" style={{ fontSize: '2rem' }}>⚠️</span>
          <span className="empty-title">Erro ao carregar dados</span>
          <p className="empty-desc" style={{ maxWidth: 300 }}>
            {error}
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Recarregar Página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Visão consolidada do sistema Fiscal BI</p>
          </div>
          <Link to="/gerador" className="btn btn-primary">
            ⚡ Gerar dados BI
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="stat-grid">
        <StatCard
          icon="🏢"
          iconClass="brand"
          label="Clientes"
          value={stats.clientes.toLocaleString('pt-BR')}
          sub={`em ${stats.cidades} cidade${stats.cidades !== 1 ? 's' : ''}`}
          link="/clientes"
        />
        <StatCard
          icon="📄"
          iconClass="blue"
          label="Notas Emitidas"
          value={stats.notas.toLocaleString('pt-BR')}
          sub="total de notas fiscais"
          link="/notas"
        />
        <StatCard
          icon="💰"
          iconClass="green"
          label="Valor Emitido"
          value={fmt(stats.valorEmitido)}
          sub="soma de todas as notas"
        />
        <StatCard
          icon="✅"
          iconClass="amber"
          label="Valor Recebido"
          value={fmt(stats.valorRecebido)}
          sub="parcelas com recebimento"
        />
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Atalhos */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Ações Rápidas</div>
              <div className="card-subtitle">Acesse rapidamente as áreas do sistema</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <QuickLink to="/cidades" icon="🏙" title="Gerenciar Cidades" desc="Cadastrar e editar cidades" />
            <QuickLink to="/clientes" icon="🏢" title="Gerenciar Clientes" desc="Cadastrar e editar clientes" />
            <QuickLink to="/notas" icon="📄" title="Notas Fiscais" desc="Consultar e criar notas" />
            <QuickLink to="/gerador" icon="⚡" title="Gerador BI" desc="Gerar dados sintéticos em massa" />
          </div>
        </div>

        {/* Últimas notas */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Últimas Notas</div>
              <div className="card-subtitle">Notas emitidas mais recentes</div>
            </div>
            <Link to="/notas" className="btn btn-secondary btn-sm">Ver todas</Link>
          </div>

          {recentNotas.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <span className="empty-icon" style={{ fontSize: '2rem' }}>📭</span>
              <span className="empty-title">Nenhuma nota emitida</span>
              <p className="empty-desc" style={{ maxWidth: 240 }}>
                Use o Gerador BI ou crie uma nota manualmente.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentNotas.map((nota) => (
                <div
                  key={nota.codNota}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {nota.cliente?.nome || '—'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Nº {nota.codNota} · {fmtDate(nota.dataEmissao)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--brand-light)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {fmt(nota.valorTotal)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom info strip */}
      <div style={{
        marginTop: 20,
        padding: '16px 20px',
        background: 'rgba(108,99,255,0.06)',
        border: '1px solid rgba(108,99,255,0.18)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--brand-light)', fontWeight: 600 }}>
            Dica:&nbsp;
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Use o <strong style={{ color: 'var(--text-primary)' }}>Gerador BI</strong> para popular
            o banco com milhares de notas sintéticas para análise em ferramentas como Power BI ou Metabase.
          </span>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, iconClass, label, value, sub, link }) {
  const inner = (
    <div className="stat-card" id={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon ${iconClass}`}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-change">{sub}</div>
    </div>
  )

  return link ? <Link to={link} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}

function QuickLink({ to, icon, title, desc }) {
  return (
    <Link
      to={to}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-input)',
        border: '1px solid var(--border)',
        transition: 'all var(--transition)',
        cursor: 'pointer',
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'
          e.currentTarget.style.background = 'var(--bg-card-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--bg-input)'
        }}
      >
        <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center' }}>{icon}</span>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
        </div>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>›</span>
      </div>
    </Link>
  )
}
