import { useState, useEffect } from 'react'
import { getClientes, gerarNotas } from '../api/services'
import { useToast } from '../context/ToastContext'

export default function Gerador() {
  const toast = useToast()
  const [clientes,   setClientes]   = useState([])
  const [quantidade, setQuantidade] = useState(1000)
  const [codCliente, setCodCliente] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [result,     setResult]     = useState(null)
  const [progress,   setProgress]   = useState(0)
  const [elapsed,    setElapsed]    = useState(null)

  useEffect(() => {
    getClientes().then(setClientes).catch(() => {})
  }, [])

  // Fake progress animation while backend works
  useEffect(() => {
    if (!loading) { setProgress(0); return }
    setProgress(3)
    const steps = [
      [600,  15], [1400, 35], [2800, 55],
      [4500, 72], [7000, 88], [10000, 94],
    ]
    const timers = steps.map(([ms, val]) =>
      setTimeout(() => setProgress(val), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [loading])

  async function handleGenerate() {
    if (!quantidade || quantidade < 1) {
      toast.warning('Quantidade inválida', 'Informe pelo menos 1 nota.')
      return
    }
    setLoading(true)
    setResult(null)
    setElapsed(null)
    const start = Date.now()

    try {
      const params = { quantidade }
      if (codCliente) params.codCliente = codCliente

      const data = await gerarNotas(params)
      const ms   = Date.now() - start
      setProgress(100)
      setElapsed(ms)
      setResult({ success: true, data, quantidade, codCliente })
      toast.success(
        'Geração concluída!',
        `${quantidade.toLocaleString('pt-BR')} notas criadas em ${(ms / 1000).toFixed(1)}s`
      )
    } catch (e) {
      setProgress(0)
      toast.error('Erro na geração', e.message)
      setResult({ success: false, error: e.message })
    } finally {
      setLoading(false)
    }
  }

  const presets = [100, 1000, 5000, 10000, 50000]

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Gerador BI</h1>
            <p className="page-subtitle">
              Gerar notas fiscais sintéticas em massa para análise de Business Intelligence
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Config panel */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">⚡ Configuração</div>
              <div className="card-subtitle">Defina os parâmetros da geração</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quantidade */}
            <div className="form-group">
              <label className="form-label" htmlFor="gen-quantidade">
                Quantidade de notas <span className="required">*</span>
              </label>
              <input
                id="gen-quantidade"
                className="input"
                type="number"
                min="1"
                max="100000"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                disabled={loading}
              />

              {/* Presets */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {presets.map((p) => (
                  <button
                    key={p}
                    className={`btn btn-sm ${quantidade === p ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setQuantidade(p)}
                    disabled={loading}
                  >
                    {p.toLocaleString('pt-BR')}
                  </button>
                ))}
              </div>
            </div>

            {/* Cliente (opcional) */}
            <div className="form-group">
              <label className="form-label" htmlFor="gen-cliente">
                Cliente (opcional)
              </label>
              <select
                id="gen-cliente"
                className="select"
                value={codCliente}
                onChange={(e) => setCodCliente(e.target.value)}
                disabled={loading}
              >
                <option value="">Todos os clientes (distribuição aleatória)</option>
                {clientes.map((c) => (
                  <option key={c.codCliente} value={c.codCliente}>
                    {c.nome} — {c.cidade?.nome} ({c.cidade?.uf})
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Se não informado, as notas serão distribuídas aleatoriamente entre todos os clientes.
              </p>
            </div>

            {/* Info box */}
            <div style={{
              padding: '14px 16px',
              background: 'rgba(108,99,255,0.07)',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}>
              <div style={{ fontWeight: 600, color: 'var(--brand-light)', marginBottom: 6 }}>
                ℹ Como funciona
              </div>
              <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Gera <strong>1–5 itens</strong> com valores e quantidades aleatórios</li>
                <li>Gera <strong>1–3 parcelas</strong> com arredondamento preciso por parcela</li>
                <li><strong>50%</strong> de chance de pagamento simulado por parcela</li>
                <li>Datas retroativas de até <strong>1 ano</strong> para histórico realista</li>
                <li>Processamento em <strong>4 threads paralelas</strong> com batch de 1.000</li>
              </ul>
            </div>

            {/* Aviso pré-requisito */}
            {clientes.length === 0 && (
              <div style={{
                padding: '12px 14px',
                background: 'var(--warning-bg)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: 'var(--warning)',
              }}>
                ⚠ Nenhum cliente cadastrado. Cadastre pelo menos uma cidade e um cliente antes de gerar.
              </div>
            )}

            <button
              id="btn-gerar"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={handleGenerate}
              disabled={loading || clientes.length === 0}
            >
              {loading
                ? `Gerando... (${progress}%)`
                : `⚡ Gerar ${quantidade.toLocaleString('pt-BR')} notas`}
            </button>
          </div>
        </div>

        {/* Status / Result panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Progress */}
          {loading && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">🔄 Gerando notas...</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Processando em paralelo (4 threads)</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {progress < 30  && '⠸ Inicializando workers...'}
                  {progress >= 30 && progress < 60  && '⠼ Gerando itens e parcelas...'}
                  {progress >= 60 && progress < 90  && '⠴ Persistindo no banco (batches de 1.000)...'}
                  {progress >= 90 && '⠦ Finalizando transações...'}
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  {result.success ? '✅ Geração concluída' : '❌ Erro na geração'}
                </div>
              </div>

              {result.success ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <ResultKpi label="Notas geradas" value={result.quantidade.toLocaleString('pt-BR')} icon="📄" />
                    <ResultKpi label="Tempo total"   value={`${(elapsed / 1000).toFixed(2)}s`}        icon="⏱" />
                    <ResultKpi
                      label="Velocidade"
                      value={`${Math.round(result.quantidade / (elapsed / 1000)).toLocaleString('pt-BR')} notas/s`}
                      icon="⚡"
                    />
                    <ResultKpi
                      label="Destino"
                      value={result.codCliente
                        ? clientes.find((c) => String(c.codCliente) === String(result.codCliente))?.nome ?? '—'
                        : 'Todos os clientes'}
                      icon="🏢"
                    />
                  </div>

                  <div style={{
                    padding: '10px 12px',
                    background: 'var(--success-bg)',
                    border: '1px solid rgba(34,197,94,0.25)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    color: 'var(--success)',
                  }}>
                    ✓ Os dados estão disponíveis para consulta na página de Notas Fiscais e prontos
                    para exportação via Power BI, Metabase ou qualquer ferramenta de BI.
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '12px 14px',
                  background: 'var(--danger-bg)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  color: 'var(--danger)',
                }}>
                  ✕ {result.error}
                </div>
              )}
            </div>
          )}

          {/* How to use card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Integração com BI</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <StepRow n={1} title="Configure o banco" desc="PostgreSQL na porta 5432, banco fiscal_bi" />
              <StepRow n={2} title="Cadastre cidades e clientes" desc="Use os cadastros na barra lateral" />
              <StepRow n={3} title="Gere as notas" desc="Use este painel para gerar o volume desejado" />
              <StepRow n={4} title="Conecte sua ferramenta" desc="Power BI, Metabase, Grafana, DBeaver..." />
              <div style={{
                padding: '10px 12px',
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ color: 'var(--info)', fontWeight: 600, marginBottom: 4, fontSize: '0.8rem' }}>
                  Tabelas disponíveis
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 2 }}>
                  cidades · clientes · notas · item_notas · parc_notas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultKpi({ label, value, icon }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: 'var(--bg-input)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
        {value}
      </div>
    </div>
  )
}

function StepRow({ n, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: 'rgba(108,99,255,0.15)',
        color: 'var(--brand-light)',
        fontSize: '0.7rem', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
      }}>
        {n}
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{title}</div>
        <div style={{ marginTop: 1 }}>{desc}</div>
      </div>
    </div>
  )
}
