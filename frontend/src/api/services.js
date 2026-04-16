import api from './client'

// ── CIDADES ──────────────────────────────────────────
export const getCidades     = ()          => api.get('/cidades')
export const getCidade      = (id)        => api.get(`/cidades/${id}`)
export const createCidade   = (data)      => api.post('/cidades', data)
export const updateCidade   = (id, data)  => api.put(`/cidades/${id}`, data)
export const deleteCidade   = (id)        => api.delete(`/cidades/${id}`)

// ── CLIENTES ─────────────────────────────────────────
export const getClientes    = ()          => api.get('/clientes')
export const getCliente     = (id)        => api.get(`/clientes/${id}`)
export const createCliente  = (data)      => api.post('/clientes', data)
export const updateCliente  = (id, data)  => api.put(`/clientes/${id}`, data)
export const deleteCliente  = (id)        => api.delete(`/clientes/${id}`)

// ── NOTAS ─────────────────────────────────────────────
export const getNotas       = (params)    => api.get('/notas', { params })
export const getNota        = (id)        => api.get(`/notas/${id}`)
export const createNota     = (data)      => api.post('/notas', data)
export const deleteNota     = (id)        => api.delete(`/notas/${id}`)

// ── GENERATOR ─────────────────────────────────────────
export const gerarNotas     = (params)    => api.post('/generator', null, { params })
