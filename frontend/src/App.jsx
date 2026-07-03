import { useState, useEffect, useCallback } from 'react';
import './App.css';

import Dashboard from './components/Dashboard';
import EquipmentList from './components/EquipmentList';
import EquipmentForm from './components/EquipmentForm';
import SearchFilter from './components/SearchFilter';
import ConfirmDialog from './components/ConfirmDialog';
import Loader from './components/Loader';
import Toast from './components/Toast';

import {
  fetchStats,
  fetchEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from './services/api';

function App() {
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
  }

  const loadStats = useCallback(async () => {
    try {
      const s = await fetchStats();
      setStats(s);
    } catch {
      // stats are non-critical; silently ignore
    }
  }, []);

  const loadEquipment = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchEquipment({ search, type: filterType, status: filterStatus });
      setEquipment(data);
    } catch (err) {
      showToast(err.message || 'Failed to load equipment', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, filterType, filterStatus]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadEquipment();
    }, 300);
    return () => clearTimeout(debounce);
  }, [loadEquipment]);

  function handleOpenAdd() {
    setEditingItem(null);
    setFormOpen(true);
  }

  function handleOpenEdit(item) {
    setEditingItem(item);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingItem(null);
  }

  async function handleFormSubmit(payload) {
    setIsSaving(true);
    try {
      if (editingItem) {
        await updateEquipment(editingItem.id, payload);
        showToast('Equipment updated successfully');
      } else {
        await createEquipment(payload);
        showToast('Equipment added successfully');
      }
      handleCloseForm();
      await loadStats();
      await loadEquipment();
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  function handleDeletePrompt(item) {
    setDeletingItem(item);
  }

  function handleCancelDelete() {
    setDeletingItem(null);
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteEquipment(deletingItem.id);
      showToast(`"${deletingItem.name}" deleted successfully`);
      setDeletingItem(null);
      await loadStats();
      await loadEquipment();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleClearFilters() {
    setSearch('');
    setFilterType('');
    setFilterStatus('');
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <span className="header-logo">⚙️</span>
            <div>
              <h1 className="header-title">SmartLab Equipment Manager</h1>
              <p className="header-subtitle">Cadmech Engineering Pvt. Ltd.</p>
            </div>
          </div>
          <button className="btn btn-primary btn-add" onClick={handleOpenAdd}>
            + Add Equipment
          </button>
        </div>
      </header>

      <main className="app-main">
        <Dashboard stats={stats} />

        <section className="equipment-section">
          <div className="section-header">
            <h2 className="section-title">Equipment Registry</h2>
            <span className="equipment-count">{equipment.length} item{equipment.length !== 1 ? 's' : ''}</span>
          </div>

          <SearchFilter
            search={search}
            type={filterType}
            status={filterStatus}
            onSearchChange={setSearch}
            onTypeChange={setFilterType}
            onStatusChange={setFilterStatus}
            onClear={handleClearFilters}
          />

          {isLoading ? (
            <Loader message="Loading equipment…" />
          ) : (
            <EquipmentList
              equipment={equipment}
              onEdit={handleOpenEdit}
              onDelete={handleDeletePrompt}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>CADMech Full Stack Assessment &copy; {new Date().getFullYear()} — Cadmech Engineering Pvt. Ltd.</p>
      </footer>

      {formOpen && (
        <EquipmentForm
          initial={editingItem}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          loading={isSaving}
        />
      )}

      {deletingItem && (
        <ConfirmDialog
          item={deletingItem}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={isDeleting}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
