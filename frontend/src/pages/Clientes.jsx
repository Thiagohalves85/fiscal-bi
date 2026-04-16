import { useState, useEffect } from 'react'
import { getCidades, getClientes, createCliente, updateCliente, deleteCliente } from '../api/services'
import { Modal, ConfirmModal } from '../components/Modal'
import { Loading, EmptyState, SearchBar } from '../components/UI'
import { useToast } from '../context/ToastContext'

const EMPTY_FORM = { nome: '', codCidade: '' }

export default function Clientes() {
  const toast = useToast()
  const [clientes, setClientes] = useState([])
  const [cidades, setCidades]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    try {
      const [c, cl] = await Promise.all([getCidades(), getClientes()])
      setCidades(c)
      setClientes(cl)
    } catch (e) {
      toast.error('Erro ao carregar', e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = clientes.filter((c) => {
    const matchName = c.nome.toLowerCase().includes(search.toLowerCase())
    const matchCity = !cityFilter || String(c.cidade?.codCidade) === cityFilter
    return matchName && matchCity
  })

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModal(true)
  }

  function openEdit(cliente) {
    setEditing(cliente)
    setForm({ nome: cliente.nome, codCidade: String(cliente.cidade?.codCidade ?? '') })
    setErrors({})
    setModal(true)
  }

  function validate() {
    const e = {}
    if (!form.nome.trim())   e.nome      = 'Nome é obrigatório'
    if (!form.codCidade)     e.codCidade = 'Selecione uma cidade'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { nome: form.nome.trim(), codCidade: Number(form.codCidade) }
      if (editing) {
        await updateCliente(editing.codCliente, payload)
        toast.success('Cliente atualizado', `${payload.nome} foi atualizado.`)
      } else {
        await createCliente(payload)
        toast.success('Cliente criado', `${payload.nome} foi cadastrado.`)
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
      await deleteCliente(confirmId)
      toast.success('Cliente removido', 'Registro excluído com sucesso.')
      setConfirmId(null)
      load()
    } catch (e) {
      toast.error('Erro ao remover', e.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Clientes</h1>
            <p className="page-subtitle">Empresas vinculadas às cidades cadastradas</p>
          </div>
          <button id="btn-novo-cliente" className="btn btn-primary" onClick={openCreate}>
            + Novo Cliente
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Pesquisar por nome..."
          />

          <select
            id="filter-cidade"
            className="select"
            style={{ width: 'auto', minWidth: 160 }}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">Todas as cidades</option>
            {cidades.map((c) => (
              <option key={c.codCidade} value={c.codCidade}>
                {c.nome} — {c.uf}
              </option>
            ))}
          </select>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <Loading text="Carregando clientes..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏢"
            title="Nenhum cliente encontrado"
            description="Cadastre o primeiro cliente. Certifique-se de ter uma cidade cadastrada."
            action={
              <button className="btn btn-primary" onClick={openCreate}>
                + Novo Cliente
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
                  <th>Cidade</th>
                  <th>UF</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.codCliente}>
                    <td><span className="cell-mono">{c.codCliente}</span></td>
                    <td><span className="cell-primary">{c.nome}</span></td>
                    <td>{c.cidade?.nome ?? '—'}</td>
                    <td>
                      {c.cidade?.uf && (
                        <span className="badge badge-brand">{c.cidade.uf}</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          id={`btn-edit-cliente-${c.codCliente}`}
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(c)}
                        >
                          ✏ Editar
                        </button>
                        <button
                          id={`btn-delete-cliente-${c.codCliente}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmId(c.codCliente)}
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

      {/* Modal */}
      <Modal
        open={modal}
        title={editing ? 'Editar Cliente' : 'Novo Cliente'}
        onClose={() => setModal(false)}
      >
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="input-nome-cliente">
              Nome <span className="required">*</span>
            </label>
            <input
              id="input-nome-cliente"
              className={`input${errors.nome ? ' error' : ''}`}
              type="text"
              placeholder="Ex.: Empresa XPTO Ltda"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            {errors.nome && <span className="form-error">⚠ {errors.nome}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="select-cidade-cliente">
              Cidade <span className="required">*</span>
            </label>
            <select
              id="select-cidade-cliente"
              className={`select${errors.codCidade ? ' error' : ''}`}
              value={form.codCidade}
              onChange={(e) => setForm({ ...form, codCidade: e.target.value })}
            >
              <option value="">Selecione a cidade</option>
              {cidades.map((c) => (
                <option key={c.codCidade} value={c.codCidade}>
                  {c.nome} — {c.uf}
                </option>
              ))}
            </select>
            {errors.codCidade && (
              <span className="form-error">⚠ {errors.codCidade}</span>
            )}
            {cidades.length === 0 && (
              <span className="form-error" style={{ color: 'var(--warning)' }}>
                ⚠ Nenhuma cidade cadastrada. Cadastre uma cidade primeiro.
              </span>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModal(false)} disabled={saving}>
            Cancelar
          </button>
          <button
            id="btn-save-cliente"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar cliente'}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmId}
        title="Confirmar exclusão"
        message="Tem certeza que deseja remover este cliente? Notas vinculadas também podem ser afetadas."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  )
}
