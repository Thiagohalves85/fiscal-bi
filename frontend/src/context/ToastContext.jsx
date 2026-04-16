import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, exiting: true } : x)))
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 250)
  }, [])

  const show = useCallback(
    (type, title, message, duration = 4000) => {
      const id = ++toastId
      setToasts((t) => [...t, { id, type, title, message }])
      setTimeout(() => dismiss(id), duration)
    },
    [dismiss]
  )

  const success = useCallback((title, msg) => show('success', title, msg), [show])
  const error   = useCallback((title, msg) => show('error', title, msg),   [show])
  const info    = useCallback((title, msg) => show('info', title, msg),    [show])
  const warning = useCallback((title, msg) => show('warning', title, msg), [show])

  return (
    <ToastCtx.Provider value={{ success, error, info, warning }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type}${t.exiting ? ' exiting' : ''}`}
            onClick={() => dismiss(t.id)}
          >
            <span className="toast-icon">
              {t.type === 'success' && '✓'}
              {t.type === 'error'   && '✕'}
              {t.type === 'info'    && 'ℹ'}
              {t.type === 'warning' && '⚠'}
            </span>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              {t.message && <div className="toast-msg">{t.message}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
