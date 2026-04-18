import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import Sidebar  from './components/Sidebar'
import TopBar   from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Cidades   from './pages/Cidades'
import Clientes  from './pages/Clientes'
import Notas     from './pages/Notas'
import Pessoas   from './pages/Pessoas'
import Gerador   from './pages/Gerador'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <TopBar onMenuClick={() => setSidebarOpen((o) => !o)} />

        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/cidades"   element={<Cidades />}   />
          <Route path="/clientes"  element={<Clientes />}  />
          <Route path="/pessoas"   element={<Pessoas />}   />
          <Route path="/notas"     element={<Notas />}     />
          <Route path="/gerador"   element={<Gerador />}   />
          <Route path="*"          element={<NotFound />}  />
        </Routes>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 16 }}>404</div>
        <h2>Página não encontrada</h2>
        <p style={{ marginTop: 8 }}>A rota solicitada não existe neste sistema.</p>
        <a href="/" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </BrowserRouter>
  )
}
