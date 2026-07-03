function statusBadge(status) {
  const map = {
    Active: 'badge-active',
    'Under Maintenance': 'badge-maintenance',
    Decommissioned: 'badge-decommissioned',
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function EquipmentList({ equipment, onEdit, onDelete }) {
  if (equipment.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🔍</p>
        <p className="empty-message">No equipment found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="equipment-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Location</th>
            <th>Serial No.</th>
            <th>Installed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item, idx) => (
            <tr key={item.id}>
              <td className="td-index">{idx + 1}</td>
              <td className="td-name">
                <span className="eq-name">{item.name}</span>
                {item.description && (
                  <span className="eq-description">{item.description}</span>
                )}
              </td>
              <td>{item.type}</td>
              <td>{statusBadge(item.status)}</td>
              <td>{item.location || '—'}</td>
              <td className="td-serial">{item.serial_number || '—'}</td>
              <td>{formatDate(item.installed_date)}</td>
              <td className="td-actions">
                <button
                  className="btn-icon btn-edit"
                  onClick={() => onEdit(item)}
                  aria-label="Edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => onDelete(item)}
                  aria-label="Delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EquipmentList;
