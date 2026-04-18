import { useState, useEffect } from 'react'
import { getPessoas, getClientes, createPessoa, updatePessoa, deletePessoa } from '../api/services'
import { Modal, ConfirmModal } from '../components/Modal'
import { Loading, EmptyState, SearchBar } from '../components/UI'
import { useToast } from '../context/ToastContext'

const EMPTY_FORM = { nome: '', email: '', telefone: '', codCliente: '' }

export default function Pessoas() {
  const toast = useToast()
  const [pessoas, setPessoas]   = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    try {
      const [p, c] = await Promise.all([getPessoas(), getClientes()])
      setPessoas(p)
      setClientes(c)
    } catch (e) {
      toast.error('Erro ao carregar', e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = pessoas.filter((p) => {
    const matchName = p.nome.toLowerCase().includes(search.toLowerCase())
    const matchClient = !clientFilter || String(p.cliente?.codCliente) === clientFilter
    return matchName && matchClient
  })

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModal(true)
  }

  function openEdit(pessoa) {
    setEditing(pessoa)
    setForm({ 
      nome: pessoa.nome, 
      email: pessoa.email ?? '', 
      telefone: pessoa.telefone ?? '', 
      codCliente: String(pessoa.cliente?.codCliente ?? '') 
    })
    setErrors({})
    setModal(true)
  }

  function validate() {
    const e = {}
    if (!form.nome.trim())     e.nome       = 'Nome é obrigatório'
    if (!form.codCliente)      e.codCliente = 'Selecione um cliente'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { 
        nome: form.nome.trim(), 
        email: form.email.trim() || null, 
        telefone: form.telefone.trim() || null, 
        codCliente: Number(form.codCliente) 
      }
      if (editing) {
        await updatePessoa(editing.codPessoa, payload)
        toast.success('Pessoa atualizada', `${payload.nome} foi atualizada.`)
      } else {
        await createPessoa(payload)
        toast.success('Pessoa criada', `${payload.nome} foi cadastrada.`)
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
      await deletePessoa(confirmId)
      toast.success('Pessoa removida', 'Registro excluído com sucesso.')
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
            <h1 className="page-title">Pessoas</h1>
            <p className="page-subtitle">Contatos e representantes dos clientes</p>
          </div>
          <button id="btn-nova-pessoa" className="btn btn-primary" onClick={openCreate}>
            + Nova Pessoa
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
            id="filter-cliente"
            className="select"
            style={{ width: 'auto', minWidth: 200 }}
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="">Todos os clientes</option>
            {clientes.map((c) => (
              <option key={c.codCliente} value={c.codCliente}>
                {c.nome}
              </option>
            ))}
          </select>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <Loading text="Carregando pessoas..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="👤"
            title="Nenhuma pessoa encontrada"
            description="Cadastre o primeiro contato. Certifique-se de ter um cliente cadastrado."
            action={
              <button className="btn btn-primary" onClick={openCreate}>
                + Nova Pessoa
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
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Cliente</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.codPessoa}>
                    <td><span className="cell-mono">{p.codPessoa}</span></td>
                    <td><span className="cell-primary">{p.nome}</span></td>
                    <td>{p.email ?? '—'}</td>
                    <td>{p.telefone ?? '—'}</td>
                    <td>{p.cliente?.nome ?? '—'}</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          id={`btn-edit-pessoa-${p.codPessoa}`}
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(p)}
                        >
                          ✏ Editar
                        </button>
                        <button
                          id={`btn-delete-pessoa-${p.codPessoa}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmId(p.codPessoa)}
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
        title={editing ? 'Editar Pessoa' : 'Nova Pessoa'}
        onClose={() => setModal(false)}
      >
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="input-nome-pessoa">
              Nome <span className="required">*</span>
            </label>
            <input
              id="input-nome-pessoa"
              className={`input${errors.nome ? ' error' : ''}`}
              type="text"
              placeholder="Ex.: João da Silva"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            {errors.nome && <span className="form-error">⚠ {errors.nome}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="input-email-pessoa">
              Email
            </label>
            <input
              id="input-email-pessoa"
              className="input"
              type="email"
              placeholder="Ex.: joao@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="input-telefone-pessoa">
              Telefone
            </label>
            <input
              id="input-telefone-pessoa"
              className="input"
              type="text"
              placeholder="Ex.: (41) 99999-9999"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="select-cliente-pessoa">
              Cliente <span className="required">*</span>
            </label>
            <select
              id="select-cliente-pessoa"
              className={`select${errors.codCliente ? ' error' : ''}`}
              value={form.codCliente}
              onChange={(e) => setForm({ ...form, codCliente: e.target.value })}
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => (
                <option key={c.codCliente} value={c.codCliente}>
                  {c.nome}
                </option>
              ))}
            </select>
            {errors.codCliente && (
              <span className="form-error">⚠ {errors.codCliente}</span>
            )}
            {clientes.length === 0 && (
              <span className="form-error" style={{ color: 'var(--warning)' }}>
                ⚠ Nenhum cliente cadastrado. Cadastre um cliente primeiro.
              </span>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModal(false)} disabled={saving}>
            Cancelar
          </button>
          <button
            id="btn-save-pessoa"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar pessoa'}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmId}
        title="Confirmar exclusão"
        message="Tem certeza que deseja remover esta pessoa?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  )
}
