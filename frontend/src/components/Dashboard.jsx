function StatCard({ label, value, icon, colorClass }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-value">{value ?? '—'}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

function Dashboard({ stats }) {
  return (
    <section className="dashboard">
      <h2 className="section-title">Overview</h2>
      <div className="stats-grid">
        <StatCard label="Total Equipment" value={stats?.total} icon="📦" colorClass="card-total" />
        <StatCard label="Active" value={stats?.active} icon="✅" colorClass="card-active" />
        <StatCard label="Under Maintenance" value={stats?.underMaintenance} icon="🔧" colorClass="card-maintenance" />
        <StatCard label="Decommissioned" value={stats?.decommissioned} icon="❌" colorClass="card-decommissioned" />
      </div>
    </section>
  );
}

export default Dashboard;
