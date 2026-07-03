function ConfirmDialog({ item, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box confirm-box" role="alertdialog" aria-modal="true">
        <div className="confirm-icon">🗑️</div>
        <h2 className="confirm-title">Delete Equipment?</h2>
        <p className="confirm-message">
          Are you sure you want to delete <strong>{item?.name}</strong>?
          <br />
          This action cannot be undone.
        </p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
