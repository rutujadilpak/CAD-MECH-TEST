const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');

const { VALID_TYPES, VALID_STATUSES } = Equipment;

router.get('/equipment', async (req, res) => {
  try {
    const { search, type, status } = req.query;

    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid type value', validTypes: VALID_TYPES });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value', validStatuses: VALID_STATUSES });
    }

    const data = await Equipment.getAll({ search, type, status });
    res.json({ data, count: data.length });
  } catch (error) {
    console.error('[GET /equipment] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

router.get('/equipment/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const item = await Equipment.getById(id);
    if (!item) {
      return res.status(404).json({ error: 'Equipment not found', id });
    }
    res.json({ data: item });
  } catch (error) {
    console.error('[GET /equipment/:id] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

router.post('/equipment', async (req, res) => {
  try {
    const { name, type, status, location, serial_number, description, installed_date } = req.body;

    if (!name || !type || !status) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'name, type, and status are required fields',
      });
    }
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Validation Error', message: 'name must be a non-empty string' });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Validation Error', message: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Validation Error', message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const created = await Equipment.create({
      name: name.trim(),
      type,
      status,
      location,
      serial_number,
      description,
      installed_date,
    });

    res.status(201).json({ message: 'Equipment created successfully', data: created });
  } catch (error) {
    console.error('[POST /equipment] Error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Conflict', message: 'Serial number already exists' });
    }
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

router.put('/equipment/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const { name, type, status, location, serial_number, description, installed_date } = req.body;
    const updateFields = { name, type, status, location, serial_number, description, installed_date };
    const hasField = Object.values(updateFields).some((v) => v !== undefined);

    if (!hasField) {
      return res.status(400).json({ error: 'Validation Error', message: 'At least one field must be provided for update' });
    }
    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Validation Error', message: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Validation Error', message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const existing = await Equipment.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Equipment not found', id });
    }

    const updated = await Equipment.update(id, updateFields);
    res.json({ message: 'Equipment updated successfully', data: updated });
  } catch (error) {
    console.error('[PUT /equipment/:id] Error:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Conflict', message: 'Serial number already exists' });
    }
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

router.delete('/equipment/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const existing = await Equipment.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Equipment not found', id });
    }

    await Equipment.remove(id);
    res.json({ message: 'Equipment deleted successfully', id });
  } catch (error) {
    console.error('[DELETE /equipment/:id] Error:', error.message);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Equipment.getStats();
    res.json({ data: stats });
  } catch (error) {
    console.error('[GET /stats] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
