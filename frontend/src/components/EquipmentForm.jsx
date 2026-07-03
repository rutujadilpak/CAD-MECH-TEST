import { useState, useEffect } from 'react';

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

const EMPTY_FORM = {
  name: '',
  type: '',
  status: 'Active',
  location: '',
  serial_number: '',
  description: '',
  installed_date: '',
};

function EquipmentForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        type: initial.type || '',
        status: initial.status || 'Active',
        location: initial.location || '',
        serial_number: initial.serial_number || '',
        description: initial.description || '',
        installed_date: initial.installed_date ? initial.installed_date.split('T')[0] : '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initial]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.type) errs.type = 'Type is required';
    if (!form.status) errs.status = 'Status is required';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const payload = { ...form };
    if (!payload.installed_date) delete payload.installed_date;
    if (!payload.serial_number) delete payload.serial_number;
    if (!payload.location) delete payload.location;
    if (!payload.description) delete payload.description;
    onSubmit(payload);
  }

  const isEdit = Boolean(initial);

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit Equipment' : 'Add Equipment'}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Equipment' : 'Add New Equipment'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <form className="eq-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Equipment Name <span className="required">*</span></label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. CNC Lathe Trainer V2"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="serial_number">Serial Number</label>
              <input
                id="serial_number"
                name="serial_number"
                type="text"
                value={form.serial_number}
                onChange={handleChange}
                placeholder="e.g. CNC-2024-0042"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Equipment Type <span className="required">*</span></label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className={errors.type ? 'input-error' : ''}
              >
                <option value="">— Select Type —</option>
                {EQUIPMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.type && <span className="field-error">{errors.type}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status <span className="required">*</span></label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={errors.status ? 'input-error' : ''}
              >
                {EQUIPMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.status && <span className="field-error">{errors.status}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Lab 3 - Building A"
              />
            </div>

            <div className="form-group">
              <label htmlFor="installed_date">Installed Date</label>
              <input
                id="installed_date"
                name="installed_date"
                type="date"
                value={form.installed_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the equipment..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Equipment' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipmentForm;
