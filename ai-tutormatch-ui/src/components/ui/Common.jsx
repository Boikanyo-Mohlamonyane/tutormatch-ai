export function Spinner({ dark }) {
  return <span className={`spinner ${dark ? "spinner-dark" : ""}`} />;
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p style={{ margin: "0 0 16px", fontSize: 13.2 }}>{message}</p>
      {action}
    </div>
  );
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal-card">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ title, message, confirmLabel = "Confirm", danger, onConfirm, onClose, loading }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className={`btn ${danger ? "btn-danger" : "btn-accent"}`} onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner /> : confirmLabel}
          </button>
        </>
      }
    >
      <p className="muted" style={{ margin: 0, fontSize: 13.6 }}>
        {message}
      </p>
    </Modal>
  );
}

export function PageHead({ eyebrow, title, description, action }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="topbar-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
