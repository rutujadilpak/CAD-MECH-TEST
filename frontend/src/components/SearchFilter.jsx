const EQUIPMENT_TYPES = [
  'CNC Machine',
  'IoT Sensor',
  'Automation Trainer',
  'PLC Module',
  'Hydraulic System',
  'Pneumatic System',
  'Electrical Panel',
];

const EQUIPMENT_STATUSES = ['Active', 'Under Maintenance', 'Decommissioned'];

function SearchFilter({ search, type, status, onSearchChange, onTypeChange, onStatusChange, onClear }) {
  const hasFilters = search || type || status;

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, location or serial number…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search equipment"
        />
      </div>

      <select
        className="filter-select"
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        aria-label="Filter by type"
      >
        <option value="">All Types</option>
        {EQUIPMENT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {EQUIPMENT_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {hasFilters && (
        <button className="btn-clear" onClick={onClear} title="Clear all filters">
          Clear
        </button>
      )}
    </div>
  );
}

export default SearchFilter;
