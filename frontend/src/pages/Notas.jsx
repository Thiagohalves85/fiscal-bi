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

  const [notas,    setNotas]    = useState([])
  const [clientes, setClientes] = useState([])
  const [cidades,  setCidades]  = useState([])
  const [loading,  setLoading]  = useState(true)

  const [search,       setSearch]      = useState('')
  const [filterCliente, setFilterCliente] = useState('')
  const [filterCidade,  setFilterCidade]  = useState('')

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
      const [n, cl, ci] = await Promise.all([
        getNotas(params),
        getClientes(),
        getCidades(),
      ])
      setNotas(n)
      setClientes(cl)
      setCidades(ci)
    } catch (e) {
      toast.error('Erro ao carregar', e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Apply filters
  useEffect(() => {
    const params = {}
    if (filterCliente) params.codCliente = filterCliente
    else if (filterCidade) params.codCidade = filterCidade
    load(params)
  }, [filterCliente, filterCidade])

  const filtered = notas.filter((n) =>
    !search ||
    String(n.codNota).includes(search) ||
    n.cliente?.nome?.toLowerCase().includes(search.toLowerCase())
  )

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

      {/* Filters */}
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
            {filtered.length.toLocaleString('pt-BR')} nota{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Table */}
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
                          id={`btn-detail-nota-${n.codNota}`}
                          className="btn btn-secondary btn-sm"
                          onClick={() => setDetail(n)}
                        >
                          👁 Detalhes
                        </button>
                        <button
                          id={`btn-delete-nota-${n.codNota}`}
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
      </div>

      {/* ── CREATE MODAL ────────────────────────────────── */}
      <Modal open={modal} title="Nova Nota Fiscal" onClose={() => setModal(false)} size="lg">
        <div className="modal-body">
          {/* Header Info */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="nota-cliente">
                Cliente <span className="required">*</span>
              </label>
              <select
                id="nota-cliente"
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
              <label className="form-label" htmlFor="nota-data">
                Data de Emissão <span className="required">*</span>
              </label>
              <input
                id="nota-data"
                className={`input${errors.dataEmissao ? ' error' : ''}`}
                type="date"
                value={form.dataEmissao}
                onChange={(e) => setForm({ ...form, dataEmissao: e.target.value })}
              />
              {errors.dataEmissao && <span className="form-error">⚠ {errors.dataEmissao}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="nota-valor">
              Valor Total (R$) <span className="required">*</span>
            </label>
            <input
              id="nota-valor"
              className={`input${errors.valorTotal ? ' error' : ''}`}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              value={form.valorTotal}
              onChange={(e) => setForm({ ...form, valorTotal: e.target.value })}
            />
            {errors.valorTotal && <span className="form-error">⚠ {errors.valorTotal}</span>}
          </div>

          <hr className="divider" />

          {/* ITENS */}
          <div>
            <div className="section-label">Itens da Nota</div>
            {errors.sumItens && (
              <div className="form-error" style={{ marginBottom: 8 }}>⚠ {errors.sumItens}</div>
            )}
            <div className="item-list">
              {itens.map((it, i) => (
                <div key={i} className="item-row">
                  <div className="item-row-header">
                    <span className="item-row-label">Item {i + 1}</span>
                    {itens.length > 1 && (
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ padding: '2px 8px' }}
                        onClick={() => removeItem(i)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Valor Unitário (R$)</label>
                      <input
                        className={`input${errors[`item_val_${i}`] ? ' error' : ''}`}
                        type="number" min="0.01" step="0.01" placeholder="0,00"
                        value={it.valorUnitario}
                        onChange={(e) => setItem(i, 'valorUnitario', e.target.value)}
                      />
                      {errors[`item_val_${i}`] && (
                        <span className="form-error">⚠ {errors[`item_val_${i}`]}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantidade</label>
                      <input
                        className={`input${errors[`item_qty_${i}`] ? ' error' : ''}`}
                        type="number" min="1" step="1" placeholder="1"
                        value={it.quantidade}
                        onChange={(e) => setItem(i, 'quantidade', e.target.value)}
                      />
                      {errors[`item_qty_${i}`] && (
                        <span className="form-error">⚠ {errors[`item_qty_${i}`]}</span>
                      )}
                    </div>
                  </div>
                  {it.valorUnitario && it.quantidade && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--brand-light)', fontFamily: 'var(--font-mono)' }}>
                      Subtotal: {fmt(Number(it.valorUnitario) * Number(it.quantidade))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="add-item-btn" style={{ marginTop: 8 }} onClick={addItem}>
              + Adicionar item
            </button>
          </div>

          <hr className="divider" />

          {/* PARCELAS */}
          <div>
            <div className="section-label">Parcelas de Pagamento</div>
            {errors.sumParcs && (
              <div className="form-error" style={{ marginBottom: 8 }}>⚠ {errors.sumParcs}</div>
            )}
            <div className="item-list">
              {parcs.map((p, i) => (
                <div key={i} className="item-row">
                  <div className="item-row-header">
                    <span className="item-row-label">Parcela {i + 1}</span>
                    {parcs.length > 1 && (
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ padding: '2px 8px' }}
                        onClick={() => removeParc(i)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Valor (R$)</label>
                      <input
                        className={`input${errors[`parc_val_${i}`] ? ' error' : ''}`}
                        type="number" min="0.01" step="0.01" placeholder="0,00"
                        value={p.valorVencimento}
                        onChange={(e) => setParc(i, 'valorVencimento', e.target.value)}
                      />
                      {errors[`parc_val_${i}`] && (
                        <span className="form-error">⚠ {errors[`parc_val_${i}`]}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Data de Vencimento</label>
                      <input
                        className={`input${errors[`parc_data_${i}`] ? ' error' : ''}`}
                        type="date"
                        value={p.dataVencimento}
                        onChange={(e) => setParc(i, 'dataVencimento', e.target.value)}
                      />
                      {errors[`parc_data_${i}`] && (
                        <span className="form-error">⚠ {errors[`parc_data_${i}`]}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="add-item-btn" style={{ marginTop: 8 }} onClick={addParc}>
              + Adicionar parcela
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModal(false)} disabled={saving}>
            Cancelar
          </button>
          <button
            id="btn-save-nota"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Emitindo...' : 'Emitir Nota Fiscal'}
          </button>
        </div>
      </Modal>

      {/* ── DETAIL MODAL ────────────────────────────────── */}
      <Modal
        open={!!detail}
        title={`Nota Fiscal #${detail?.codNota}`}
        onClose={() => setDetail(null)}
        size="lg"
      >
        {detail && (
          <>
            <div className="modal-body">
              {/* Info geral */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16,
                padding: '14px 16px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}>
                <InfoCell label="Cliente"   value={detail.cliente?.nome ?? '—'} />
                <InfoCell label="Cidade"    value={`${detail.cliente?.cidade?.nome ?? '—'} · ${detail.cliente?.cidade?.uf ?? ''}`} />
                <InfoCell label="Emissão"   value={fmtDate(detail.dataEmissao)} />
                <InfoCell label="Valor Total" value={fmt(detail.valorTotal)} highlight />
                <InfoCell label="Itens"     value={`${detail.itens?.length ?? 0} item(ns)`} />
                <InfoCell label="Parcelas"  value={`${detail.parcelas?.length ?? 0} parcela(s)`} />
              </div>

              {/* Itens */}
              <div>
                <div className="section-label">Itens</div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Valor Unitário</th>
                        <th>Quantidade</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detail.itens || []).map((it, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{fmt(it.valorUnitario)}</td>
                          <td>{it.quantidade}</td>
                          <td>
                            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-light)' }}>
                              {fmt(it.valorUnitario * it.quantidade)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Parcelas */}
              <div>
                <div className="section-label">Parcelas</div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Nº</th>
                        <th>Vencimento</th>
                        <th>Valor Venc.</th>
                        <th>Recebimento</th>
                        <th>Valor Receb.</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detail.parcelas || []).map((p) => (
                        <tr key={p.codParcNota}>
                          <td>{p.numero}</td>
                          <td>{fmtDate(p.dataVencimento)}</td>
                          <td><span style={{ fontFamily: 'var(--font-mono)' }}>{fmt(p.valorVencimento)}</span></td>
                          <td>{p.dataRecebimento ? fmtDate(p.dataRecebimento) : '—'}</td>
                          <td>
                            <span style={{ fontFamily: 'var(--font-mono)', color: p.valorRecebimento ? 'var(--success)' : 'var(--text-muted)' }}>
                              {p.valorRecebimento ? fmt(p.valorRecebimento) : '—'}
                            </span>
                          </td>
                          <td>
                            {p.valorRecebimento
                              ? <span className="badge badge-green">✓ Pago</span>
                              : <span className="badge badge-red">Pendente</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Fechar</button>
              <button
                className="btn btn-danger"
                onClick={() => { setConfirmId(detail.codNota); setDetail(null) }}
              >
                🗑 Excluir Nota
              </button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmModal
        open={!!confirmId}
        title="Confirmar exclusão"
        message="A nota e todos os seus itens e parcelas serão removidos permanentemente."
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
