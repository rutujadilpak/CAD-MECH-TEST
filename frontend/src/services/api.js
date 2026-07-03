const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.message || data.error || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export async function fetchStats() {
  const result = await request('/stats');
  return result.data;
}

export async function fetchEquipment({ search = '', type = '', status = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (type) params.set('type', type);
  if (status) params.set('status', status);

  const query = params.toString() ? `?${params.toString()}` : '';
  const result = await request(`/equipment${query}`);
  return result.data;
}

export async function createEquipment(payload) {
  const result = await request('/equipment', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function updateEquipment(id, payload) {
  const result = await request(`/equipment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function deleteEquipment(id) {
  return request(`/equipment/${id}`, { method: 'DELETE' });
}
