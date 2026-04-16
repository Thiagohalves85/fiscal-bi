export function Modal({ open, title, onClose, size = '', children }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal${size ? ' modal-' + size : ''}`} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal confirm-modal" role="alertdialog">
        <div className="modal-body" style={{ textAlign: 'center', paddingTop: 28, paddingBottom: 8 }}>
          <div className="confirm-icon">🗑</div>
          <h3 className="modal-title">{title}</h3>
          <p style={{ marginTop: 8, fontSize: '0.88rem' }}>{message}</p>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Removendo...' : 'Confirmar exclusão'}
          </button>
        </div>
      </div>
    </div>
  )
}
