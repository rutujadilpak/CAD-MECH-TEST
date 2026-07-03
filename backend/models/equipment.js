const pool = require('../db/connection');

const VALID_TYPES = [
  'CNC Machine',
  'IoT Sensor',
  'Automation Trainer',
  'PLC Module',
  'Hydraulic System',
  'Pneumatic System',
  'Electrical Panel',
];

const VALID_STATUSES = ['Active', 'Under Maintenance', 'Decommissioned'];

async function getAll({ search, type, status } = {}) {
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(name ILIKE $${params.length} OR location ILIKE $${params.length} OR serial_number ILIKE $${params.length})`);
  }
  if (type) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT * FROM equipment ${where} ORDER BY created_at DESC`;

  const { rows } = await pool.query(query, params);
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM equipment WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ name, type, status, location, serial_number, description, installed_date }) {
  const { rows } = await pool.query(
    `INSERT INTO equipment (name, type, status, location, serial_number, description, installed_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, type, status, location || null, serial_number || null, description || null, installed_date || null]
  );
  return rows[0];
}

async function update(id, fields) {
  const allowed = ['name', 'type', 'status', 'location', 'serial_number', 'description', 'installed_date'];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      params.push(fields[key]);
      setClauses.push(`${key} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) return null;

  params.push(new Date().toISOString());
  setClauses.push(`updated_at = $${params.length}`);

  params.push(id);
  const query = `UPDATE equipment SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`;

  const { rows } = await pool.query(query, params);
  return rows[0] || null;
}

async function remove(id) {
  const { rows } = await pool.query('DELETE FROM equipment WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}

async function getStats() {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'Active') AS active,
      COUNT(*) FILTER (WHERE status = 'Under Maintenance') AS under_maintenance,
      COUNT(*) FILTER (WHERE status = 'Decommissioned') AS decommissioned
    FROM equipment
  `);

  const row = rows[0];
  return {
    total: parseInt(row.total),
    active: parseInt(row.active),
    underMaintenance: parseInt(row.under_maintenance),
    decommissioned: parseInt(row.decommissioned),
  };
}

module.exports = { getAll, getById, create, update, remove, getStats, VALID_TYPES, VALID_STATUSES };
