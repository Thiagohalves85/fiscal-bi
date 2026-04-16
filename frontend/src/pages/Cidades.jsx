import { useState, useEffect } from 'react'
import { getCidades, createCidade, updateCidade, deleteCidade } from '../api/services'
import { Modal, ConfirmModal } from '../components/Modal'
import { Loading, EmptyState, SearchBar } from '../components/UI'
import { useToast } from '../context/ToastContext'

const EMPTY_FORM = { nome: '', uf: '' }

export default function Cidades() {
  const toast = useToast()
  const [cidades, setCidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    try {
      const data = await getCidades()
      setCidades(data)
    } catch (e) {
      toast.error('Erro ao carregar', e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = cidades.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.uf.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModal(true)
  }

  function openEdit(cidade) {
    setEditing(cidade)
    setForm({ nome: cidade.nome, uf: cidade.uf })
    setErrors({})
    setModal(true)
  }

  function validate() {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório'
    if (!form.uf.trim()) e.uf = 'UF é obrigatória'
    else if (form.uf.trim().length !== 2) e.uf = 'UF deve ter 2 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { nome: form.nome.trim(), uf: form.uf.trim().toUpperCase() }
      if (editing) {
        await updateCidade(editing.codCidade, payload)
        toast.success('Cidade atualizada', `${payload.nome} foi atualizada.`)
      } else {
        await createCidade(payload)
        toast.success('Cidade criada', `${payload.nome} foi cadastrada.`)
      }
      setModal(false)
      load()
    } catch (e) {
      toast.error('Erro ao salvar', e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteCidade(confirmId)
      toast.success('Cidade removida', 'Registro excluído com sucesso.')
      setConfirmId(null)
      load()
    } catch (e) {
      toast.error('Erro ao remover', e.message)
    } finally {
      setDeleting(false)
    }
  }

  const uf_options = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
    'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Cidades</h1>
            <p className="page-subtitle">Cadastro de cidades para segmentação geográfica</p>
          </div>
          <button id="btn-nova-cidade" className="btn btn-primary" onClick={openCreate}>
            + Nova Cidade
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Pesquisar por nome ou UF..."
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <Loading text="Carregando cidades..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏙"
            title="Nenhuma cidade encontrada"
            description="Cadastre a primeira cidade para começar."
            action={
              <button className="btn btn-primary" onClick={openCreate}>
                + Nova Cidade
              </button>
            }
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>UF</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.codCidade}>
                    <td><span className="cell-mono">{c.codCidade}</span></td>
                    <td><span className="cell-primary">{c.nome}</span></td>
                    <td>
                      <span className="badge badge-brand">{c.uf}</span>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          id={`btn-edit-cidade-${c.codCidade}`}
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(c)}
                        >
                          ✏ Editar
                        </button>
                        <button
                          id={`btn-delete-cidade-${c.codCidade}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmId(c.codCidade)}
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

      {/* Modal form */}
      <Modal
        open={modal}
        title={editing ? 'Editar Cidade' : 'Nova Cidade'}
        onClose={() => setModal(false)}
      >
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="input-nome-cidade">
              Nome <span className="required">*</span>
            </label>
            <input
              id="input-nome-cidade"
              className={`input${errors.nome ? ' error' : ''}`}
              type="text"
              placeholder="Ex.: Curitiba"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            {errors.nome && <span className="form-error">⚠ {errors.nome}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="select-uf-cidade">
              UF <span className="required">*</span>
            </label>
            <select
              id="select-uf-cidade"
              className={`select${errors.uf ? ' error' : ''}`}
              value={form.uf}
              onChange={(e) => setForm({ ...form, uf: e.target.value })}
            >
              <option value="">Selecione a UF</option>
              {uf_options.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            {errors.uf && <span className="form-error">⚠ {errors.uf}</span>}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModal(false)} disabled={saving}>
            Cancelar
          </button>
          <button
            id="btn-save-cidade"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar cidade'}
          </button>
        </div>
      </Modal>

      {/* Confirm delete */}
      <ConfirmModal
        open={!!confirmId}
        title="Confirmar exclusão"
        message="Tem certeza que deseja remover esta cidade? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  )
}
