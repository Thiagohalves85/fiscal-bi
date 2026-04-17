import { useState, useEffect } from 'react'
import { getCidades, getClientes, getNotas, createNota, deleteNota } from '../api/services'
import { Modal, ConfirmModal } from '../components/Modal'
import { Loading, EmptyState, SearchBar } from '../components/UI'
import { useToast } from '../context/ToastContext'
import { sumItens, sumParcs, isValidTotal } from '../utils/finance'

const EMPTY_ITENS  = [{ valorUnitario: '', quantidade: '' }]
const EMPTY_PARCS  = [{ numero: 1, valorVencimento: '', dataVencimento: '' }]
const EMPTY_FORM   = {
  codCliente: '',
  dataEmissao: new Date().toISOString().slice(0, 10),
  valorTotal: '',
}

const fmt = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const fmtDate = (d) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—'

export default function Notas() {
  const toast = useToast()

  const [notas, setNotas] = useState([])
  const [clientes, setClientes] = useState([])
  const [cidades, setCidades] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filterCliente, setFilterCliente] = useState('')
  const [filterCidade, setFilterCidade] = useState('')

  const [modal,   setModal]   = useState(false)
  const [detail,  setDetail]  = useState(null)   // nota selecionada para detalhe
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [itens,   setItens]   = useState(EMPTY_ITENS)
  const [parcs,   setParcs]   = useState(EMPTY_PARCS)
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)

  const [confirmId, setConfirmId] = useState(null)
  const [deleting,  setDeleting]  = useState(false)

  async function load(params = {}) {
    setLoading(true)
    try {
      const finalParams = {
        page,
        size: 15,
        search: search || undefined,
        codCliente: filterCliente || undefined,
        codCidade: filterCidade || undefined,
        ...params
      }
      
      const n = await getNotas(finalParams)
      setNotas(n.content || [])
      setTotalPages(n.totalPages || 0)
      setTotalElements(n.totalElements || 0)

      if (clientes.length === 0) {
        const [cl, ci] = await Promise.all([getClientes(), getCidades()])
        setClientes(cl)
        setCidades(ci)
      }
    } catch (e) {
      toast.error('Erro ao carregar', e.message)
    } finally {
      setLoading(false)
    }
  }

  // Load when page or filters change
  useEffect(() => {
    load()
  }, [page, filterCliente, filterCidade])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0) // Reset to first page on search
      load({ page: 0 })
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const filtered = notas // O filtro agora é feito no servidor

  // ── form helpers ─────────────────────────────────────
  function addItem()    { setItens([...itens, { valorUnitario: '', quantidade: '' }]) }
  function removeItem(i){ setItens(itens.filter((_, idx) => idx !== i)) }
  function setItem(i, k, v) {
    setItens(itens.map((it, idx) => idx === i ? { ...it, [k]: v } : it))
  }

  function addParc()    { setParcs([...parcs, { numero: parcs.length + 1, valorVencimento: '', dataVencimento: '' }]) }
  function removeParc(i){ setParcs(parcs.filter((_, idx) => idx !== i)) }
  function setParc(i, k, v) {
    setParcs(parcs.map((p, idx) => idx === i ? { ...p, [k]: v } : p))
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setItens(EMPTY_ITENS)
    setParcs(EMPTY_PARCS)
    setErrors({})
    setModal(true)
  }

  function validate() {
    const e = {}
    if (!form.codCliente)   e.codCliente  = 'Selecione um cliente'
    if (!form.dataEmissao)  e.dataEmissao = 'Informe a data de emissão'
    if (!form.valorTotal || Number(form.valorTotal) <= 0) e.valorTotal = 'Valor total deve ser > 0'

    itens.forEach((it, i) => {
      if (!it.valorUnitario || Number(it.valorUnitario) <= 0)
        e[`item_val_${i}`] = 'Valor inválido'
      if (!it.quantidade || Number(it.quantidade) < 1)
        e[`item_qty_${i}`] = 'Qtd inválida'
    })

    parcs.forEach((p, i) => {
      if (!p.valorVencimento || Number(p.valorVencimento) <= 0)
        e[`parc_val_${i}`] = 'Valor inválido'
      if (!p.dataVencimento) e[`parc_data_${i}`] = 'Data inválida'
    })

    // sum checks
    const sItens = sumItens(itens)
    const sParcs = sumParcs(parcs)
    const total    = Number(form.valorTotal)
    
    if (!isValidTotal(sItens, total))
      e.sumItens = `Soma dos itens (${fmt(sItens)}) ≠ valor total (${fmt(total)})`
    if (!isValidTotal(sParcs, total))
      e.sumParcs = `Soma das parcelas (${fmt(sParcs)}) ≠ valor total (${fmt(total)})`

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        codCliente: Number(form.codCliente),
        dataEmissao: form.dataEmissao,
        valorTotal: Number(form.valorTotal),
        itens: itens.map((it) => ({
          valorUnitario: Number(it.valorUnitario),
          quantidade:    Number(it.quantidade),
        })),
        parcelas: parcs.map((p, i) => ({
          numero:          i + 1,
          valorVencimento: Number(p.valorVencimento),
          dataVencimento:  p.dataVencimento,
        })),
      }
      await createNota(payload)
      toast.success('Nota criada', 'Nota fiscal emitida com sucesso.')
      setModal(false)
      load()
    } catch (e) {
      toast.error('Erro ao criar nota', e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteNota(confirmId)
      toast.success('Nota removida', 'Nota e seus itens/parcelas foram excluídos.')
      setConfirmId(null)
      if (detail?.codNota === confirmId) setDetail(null)
      load()
    } catch (e) {
      toast.error('Erro ao remover', e.message)
    } finally {
      setDeleting(false)
    }
  }

  // Recebimento status
  const notaStatus = (nota) => {
    const parcs = nota.parcelas || []
    if (parcs.length === 0) return null
    const receb = parcs.filter((p) => p.valorRecebimento).length
    if (receb === parcs.length) return 'paid'
    if (receb > 0)              return 'partial'
    return 'pending'
  }

  const statusBadge = (nota) => {
    const s = notaStatus(nota)
    if (s === 'paid')    return <span className="badge badge-green">✓ Quitada</span>
    if (s === 'partial') return <span className="badge badge-amber">◑ Parcial</span>
    if (s === 'pending') return <span className="badge badge-red">○ Pendente</span>
    return <span className="badge badge-muted">—</span>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Notas Fiscais</h1>
            <p className="page-subtitle">Consulta e emissão de notas fiscais</p>
          </div>
          <button id="btn-nova-nota" className="btn btn-primary" onClick={openCreate}>
            + Nova Nota
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filter-row" style={{ marginBottom: 0 }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Pesquisar por Nº ou cliente..."
          />

          <select
            id="filter-nota-cliente"
            className="select"
            style={{ width: 'auto', minWidth: 180 }}
            value={filterCliente}
            onChange={(e) => { setFilterCliente(e.target.value); setFilterCidade('') }}
          >
            <option value="">Todos os clientes</option>
            {clientes.map((c) => (
              <option key={c.codCliente} value={c.codCliente}>{c.nome}</option>
            ))}
          </select>

          <select
            id="filter-nota-cidade"
            className="select"
            style={{ width: 'auto', minWidth: 160 }}
            value={filterCidade}
            onChange={(e) => { setFilterCidade(e.target.value); setFilterCliente('') }}
          >
            <option value="">Todas as cidades</option>
            {cidades.map((c) => (
              <option key={c.codCidade} value={c.codCidade}>{c.nome} — {c.uf}</option>
            ))}
          </select>

          {(filterCliente || filterCidade) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setFilterCliente(''); setFilterCidade('') }}
            >
              ✕ Limpar
            </button>
          )}

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {totalElements.toLocaleString('pt-BR')} nota{totalElements !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <Loading text="Carregando notas..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📄"
            title="Nenhuma nota encontrada"
            description="Crie uma nota manualmente ou use o Gerador BI para popular o banco."
            action={
              <button className="btn btn-primary" onClick={openCreate}>+ Nova Nota</button>
            }
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Cliente</th>
                  <th>Cidade</th>
                  <th>Emissão</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n.codNota}>
                    <td><span className="cell-mono">{n.codNota}</span></td>
                    <td><span className="cell-primary">{n.cliente?.nome ?? '—'}</span></td>
                    <td>
                      {n.cliente?.cidade && (
                        <span className="badge badge-brand">
                          {n.cliente.cidade.nome} · {n.cliente.cidade.uf}
                        </span>
                      )}
                    </td>
                    <td>{fmtDate(n.dataEmissao)}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-light)' }}>
                        {fmt(n.valorTotal)}
                      </span>
                    </td>
                    <td>{statusBadge(n)}</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setDetail(n)}
                        >
                          👁 Detalhes
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmId(n.codNota)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              « Anterior
            </button>
            <span className="pagination-info">
              Página <strong>{page + 1}</strong> de {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Próxima »
            </button>
          </div>
        )}
      </div>

      <Modal open={modal} title="Nova Nota Fiscal" onClose={() => setModal(false)} size="lg">
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Cliente <span className="required">*</span></label>
              <select
                className={`select${errors.codCliente ? ' error' : ''}`}
                value={form.codCliente}
                onChange={(e) => setForm({ ...form, codCliente: e.target.value })}
              >
                <option value="">Selecione o cliente</option>
                {clientes.map((c) => (
                  <option key={c.codCliente} value={c.codCliente}>{c.nome}</option>
                ))}
              </select>
              {errors.codCliente && <span className="form-error">⚠ {errors.codCliente}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Data de Emissão <span className="required">*</span></label>
              <input
                className={`input${errors.dataEmissao ? ' error' : ''}`}
                type="date"
                value={form.dataEmissao}
                onChange={(e) => setForm({ ...form, dataEmissao: e.target.value })}
              />
              {errors.dataEmissao && <span className="form-error">⚠ {errors.dataEmissao}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Valor Total (R$) <span className="required">*</span></label>
            <input
              className={`input${errors.valorTotal ? ' error' : ''}`}
              type="number" step="0.01"
              value={form.valorTotal}
              onChange={(e) => setForm({ ...form, valorTotal: e.target.value })}
            />
            {errors.valorTotal && <span className="form-error">⚠ {errors.valorTotal}</span>}
          </div>

          <hr className="divider" />
          <div className="section-label">Itens da Nota</div>
          <div className="item-list">
            {itens.map((it, i) => (
              <div key={i} className="item-row">
                <div className="item-row-header">
                  <span className="item-row-label">Item {i + 1}</span>
                  {itens.length > 1 && <button className="btn btn-danger btn-sm" onClick={() => removeItem(i)}>✕</button>}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Valor Unitário</label>
                    <input className="input" type="number" step="0.01" value={it.valorUnitario} onChange={(e) => setItem(i, 'valorUnitario', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantidade</label>
                    <input className="input" type="number" value={it.quantidade} onChange={(e) => setItem(i, 'quantidade', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="add-item-btn" onClick={addItem}>+ Adicionar item</button>

          <hr className="divider" />
          <div className="section-label">Parcelas</div>
          <div className="item-list">
            {parcs.map((p, i) => (
              <div key={i} className="item-row">
                <div className="item-row-header">
                  <span className="item-row-label">Parcela {i + 1}</span>
                  {parcs.length > 1 && <button className="btn btn-danger btn-sm" onClick={() => removeParc(i)}>✕</button>}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Valor</label>
                    <input className="input" type="number" step="0.01" value={p.valorVencimento} onChange={(e) => setParc(i, 'valorVencimento', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vencimento</label>
                    <input className="input" type="date" value={p.dataVencimento} onChange={(e) => setParc(i, 'dataVencimento', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="add-item-btn" onClick={addParc}>+ Adicionar parcela</button>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Emitindo...' : 'Emitir Nota Fiscal'}
          </button>
        </div>
      </Modal>

      <Modal open={!!detail} title={`Nota Fiscal #${detail?.codNota}`} onClose={() => setDetail(null)} size="lg">
        {detail && (
          <>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, padding: 16, background: 'var(--bg-input)', borderRadius: 8 }}>
                <InfoCell label="Cliente" value={detail.cliente?.nome} />
                <InfoCell label="Emissão" value={fmtDate(detail.dataEmissao)} />
                <InfoCell label="Total" value={fmt(detail.valorTotal)} highlight />
              </div>
              <div className="section-label" style={{ marginTop: 20 }}>Itens</div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>#</th><th>Unitário</th><th>Qtd</th><th>Total</th></tr></thead>
                  <tbody>
                    {detail.itens?.map((it, i) => (
                      <tr key={i}><td>{i+1}</td><td>{fmt(it.valorUnitario)}</td><td>{it.quantidade}</td><td>{fmt(it.valorUnitario * it.quantidade)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="section-label" style={{ marginTop: 20 }}>Parcelas</div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Nº</th><th>Vencimento</th><th>Valor</th><th>Status</th></tr></thead>
                  <tbody>
                    {detail.parcelas?.map((p) => (
                      <tr key={p.codParcNota}>
                        <td>{p.numero}</td>
                        <td>{fmtDate(p.dataVencimento)}</td>
                        <td>{fmt(p.valorVencimento)}</td>
                        <td>{p.valorRecebimento ? 'Pago' : 'Pendente'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Fechar</button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmModal
        open={!!confirmId}
        title="Excluir Nota"
        message="Deseja realmente excluir esta nota fiscal?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  )
}

function InfoCell({ label, value, highlight }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        fontSize: highlight ? '1rem' : '0.88rem',
        fontWeight: highlight ? 700 : 500,
        color: highlight ? 'var(--brand-light)' : 'var(--text-primary)',
        fontFamily: highlight ? 'var(--font-mono)' : 'inherit',
      }}>
        {value}
      </div>
    </div>
  )
}
