export function Loading({ text = 'Carregando...' }) {
  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <span className="loading-text">{text}</span>
    </div>
  )
}

export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <span className="empty-title">{title}</span>
      {description && <p className="empty-desc">{description}</p>}
      {action}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Pesquisar...' }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
