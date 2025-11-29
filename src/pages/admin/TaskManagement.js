import React, { useEffect, useState } from 'react';
import { useNotification } from '../../components/Notification';
import { adminAPI } from '../../utils/adminApi';

const TaskManagement = () => {
  const { success, error, confirm } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other',
    url: '',
    duration: 30,
    isActive: true
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllTasks();
      setTasks(response.data);
    } catch (err) {
      error('Failed to load tasks');
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        type: task.type,
        url: task.url || '',
        duration: task.duration,
        isActive: task.isActive
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        type: 'other',
        url: '',
        duration: 30,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'other',
      url: '',
      duration: 30,
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      error('Please fill in all required fields');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      error('Title and description cannot be empty');
      return;
    }

    setProcessing(true);
    try {
      console.log('Submitting task data:', formData);
      if (editingTask) {
        const response = await adminAPI.updateTask(editingTask._id, formData);
        console.log('Task updated:', response.data);
        success('Task updated successfully!');
      } else {
        const response = await adminAPI.createTask(formData);
        console.log('Task created:', response.data);
        success('Task created successfully!');
      }
      handleCloseModal();
      loadTasks();
    } catch (err) {
      console.error('Save task error:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save task';
      error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (taskId, taskTitle) => {
    const confirmed = await confirm(
      `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`,
      {
        title: 'Delete Task',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    );

    if (!confirmed) return;

    setProcessing(true);
    try {
      await adminAPI.deleteTask(taskId);
      success('Task deleted successfully!');
      loadTasks();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (taskId, currentStatus, taskTitle) => {
    const newStatus = !currentStatus;
    const confirmed = await confirm(
      `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} "${taskTitle}"?`,
      {
        title: newStatus ? 'Activate Task' : 'Deactivate Task',
        confirmText: newStatus ? 'Activate' : 'Deactivate',
        cancelText: 'Cancel',
        type: 'warning'
      }
    );

    if (!confirmed) return;

    setProcessing(true);
    try {
      await adminAPI.toggleTaskStatus(taskId);
      success(`Task ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      loadTasks();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to toggle task status');
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenImportModal = () => {
    setShowImportModal(true);
    setSelectedFile(null);
    setImportResult(null);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
    setSelectedFile(null);
    setImportResult(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ['.xlsx', '.xls'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(ext)) {
        error('Please select a valid Excel file (.xlsx or .xls)');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      error('Please select a file to import');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const response = await adminAPI.importTasks(selectedFile);
      setImportResult(response.data);
      if (response.data.success > 0) {
        success(`Successfully imported ${response.data.success} tasks!`);
        loadTasks();
      }
      if (response.data.failed > 0) {
        error(`${response.data.failed} tasks failed to import`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to import tasks';
      error(errorMsg);
      setImportResult({ success: 0, failed: 0, errors: [errorMsg] });
    } finally {
      setImporting(false);
    }
  };

  const getTypeStyle = (type) => {
    const styles = {
      watch_video: { backgroundColor: '#e74c3c', color: '#fff' },
      click_ad: { backgroundColor: '#3498db', color: '#fff' },
      survey: { backgroundColor: '#9b59b6', color: '#fff' },
      social_media: { backgroundColor: '#1abc9c', color: '#fff' },
      other: { backgroundColor: '#95a5a6', color: '#fff' },
    };
    return styles[type] || styles.other;
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.isActive;
    if (filter === 'inactive') return !task.isActive;
    if (filter && filter !== 'all') return task.type === filter;
    return true;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Task Management</h1>
        <div style={styles.headerBtns}>
          <button onClick={handleOpenImportModal} style={styles.importBtn}>
            Import from Excel
          </button>
          <button onClick={() => handleOpenModal()} style={styles.createBtn}>
            + Create New Task
          </button>
        </div>
      </div>

      <div style={styles.filterBar}>
        <button
          onClick={() => setFilter('all')}
          style={{...styles.filterBtn, ...(filter === 'all' ? styles.activeFilter : {})}}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{...styles.filterBtn, ...(filter === 'active' ? styles.activeFilter : {})}}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('inactive')}
          style={{...styles.filterBtn, ...(filter === 'inactive' ? styles.activeFilter : {})}}
        >
          Inactive
        </button>
        <button
          onClick={() => setFilter('watch_video')}
          style={{...styles.filterBtn, ...(filter === 'watch_video' ? styles.activeFilter : {})}}
        >
          Videos
        </button>
        <button
          onClick={() => setFilter('click_ad')}
          style={{...styles.filterBtn, ...(filter === 'click_ad' ? styles.activeFilter : {})}}
        >
          Ads
        </button>
        <button
          onClick={() => setFilter('survey')}
          style={{...styles.filterBtn, ...(filter === 'survey' ? styles.activeFilter : {})}}
        >
          Surveys
        </button>
        <button
          onClick={() => setFilter('social_media')}
          style={{...styles.filterBtn, ...(filter === 'social_media' ? styles.activeFilter : {})}}
        >
          Social Media
        </button>
        <button
          onClick={() => setFilter('')}
          style={{...styles.filterBtn, ...(filter === '' ? styles.activeFilter : {})}}
        >
          All Types
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div style={styles.empty}>
          No tasks found. {filter && 'Try adjusting your filters or '}
          <span onClick={() => handleOpenModal()} style={styles.createLink}>create a new task</span>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task._id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{task.title}</strong>
                    {task.url && (
                      <div style={styles.urlText}>
                        <a href={task.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                          {task.url.length > 40 ? task.url.substring(0, 40) + '...' : task.url}
                        </a>
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>{task.description}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getTypeStyle(task.type)}}>
                      {task.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={styles.td}>{task.duration}s</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: task.isActive ? '#27ae60' : '#95a5a6',
                      color: '#fff'
                    }}>
                      {task.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <div style={styles.actionBtns}>
                      <button
                        onClick={() => handleOpenModal(task)}
                        style={styles.editBtn}
                        disabled={processing}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(task._id, task.isActive, task.title)}
                        style={{...styles.toggleBtn, backgroundColor: task.isActive ? '#f39c12' : '#27ae60'}}
                        disabled={processing}
                      >
                        {task.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(task._id, task.title)}
                        style={styles.deleteBtn}
                        disabled={processing}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button onClick={handleCloseModal} style={styles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={styles.input}
                  required
                  placeholder="Enter task title"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{...styles.input, ...styles.textarea}}
                  required
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={styles.input}
                    required
                  >
                    <option value="watch_video">Watch Video</option>
                    <option value="click_ad">Click Ad</option>
                    <option value="survey">Survey</option>
                    <option value="social_media">Social Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Duration (seconds) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 30})}
                    style={styles.input}
                    required
                    min="1"
                    placeholder="30"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>URL (optional)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  style={styles.input}
                  placeholder="https://example.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    style={styles.checkbox}
                  />
                  Active (users can see and complete this task)
                </label>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={styles.cancelBtn}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={processing}
                >
                  {processing ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImportModal && (
        <div style={styles.modalOverlay} onClick={handleCloseImportModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Import Tasks from Excel</h2>
              <button onClick={handleCloseImportModal} style={styles.closeBtn}>&times;</button>
            </div>
            <div style={styles.importContent}>
              <div style={styles.importInfo}>
                <h4 style={styles.infoTitle}>Excel File Format</h4>
                <p style={styles.infoText}>Your Excel file should have the following columns:</p>
                <table style={styles.formatTable}>
                  <thead>
                    <tr>
                      <th style={styles.formatTh}>Column</th>
                      <th style={styles.formatTh}>Required</th>
                      <th style={styles.formatTh}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={styles.formatTd}>title</td><td style={styles.formatTd}>Yes</td><td style={styles.formatTd}>Task title</td></tr>
                    <tr><td style={styles.formatTd}>description</td><td style={styles.formatTd}>Yes</td><td style={styles.formatTd}>Task description</td></tr>
                    <tr><td style={styles.formatTd}>type</td><td style={styles.formatTd}>No</td><td style={styles.formatTd}>watch_video, click_ad, survey, social_media, other</td></tr>
                    <tr><td style={styles.formatTd}>duration</td><td style={styles.formatTd}>No</td><td style={styles.formatTd}>Duration in seconds (default: 30)</td></tr>
                    <tr><td style={styles.formatTd}>url</td><td style={styles.formatTd}>No</td><td style={styles.formatTd}>Task URL</td></tr>
                    <tr><td style={styles.formatTd}>isActive</td><td style={styles.formatTd}>No</td><td style={styles.formatTd}>true/false (default: true)</td></tr>
                  </tbody>
                </table>
              </div>

              <div style={styles.fileInputContainer}>
                <label style={styles.fileInputLabel}>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    style={styles.fileInput}
                    disabled={importing}
                  />
                  <span style={styles.fileInputBtn}>Choose Excel File</span>
                </label>
                {selectedFile && (
                  <span style={styles.fileName}>{selectedFile.name}</span>
                )}
              </div>

              {importResult && (
                <div style={styles.importResult}>
                  <div style={{...styles.resultSummary, backgroundColor: importResult.failed > 0 ? '#fff3e0' : '#e8f5e9'}}>
                    <span style={styles.resultSuccess}>{importResult.success} tasks imported</span>
                    {importResult.failed > 0 && (
                      <span style={styles.resultFailed}>{importResult.failed} failed</span>
                    )}
                  </div>
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div style={styles.errorList}>
                      <strong>Errors:</strong>
                      <ul style={styles.errorUl}>
                        {importResult.errors.map((err, idx) => (
                          <li key={idx} style={styles.errorLi}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={handleCloseImportModal}
                  style={styles.cancelBtn}
                  disabled={importing}
                >
                  {importResult ? 'Close' : 'Cancel'}
                </button>
                {!importResult && (
                  <button
                    type="button"
                    onClick={handleImport}
                    style={styles.submitBtn}
                    disabled={importing || !selectedFile}
                  >
                    {importing ? 'Importing...' : 'Import Tasks'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: 0,
  },
  createBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  filterBtn: {
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
  },
  activeFilter: {
    backgroundColor: '#3498db',
    color: '#fff',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.1rem',
    color: '#7f8c8d',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  createLink: {
    color: '#3498db',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #ecf0f1',
  },
  td: {
    padding: '1rem',
    verticalAlign: 'top',
  },
  urlText: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    marginTop: '0.25rem',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  actionBtns: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  editBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  toggleBtn: {
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #ecf0f1',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#2c3e50',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: '#7f8c8d',
    cursor: 'pointer',
    padding: 0,
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: '1.5rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: '#2c3e50',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #ecf0f1',
  },
  cancelBtn: {
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  headerBtns: {
    display: 'flex',
    gap: '1rem',
  },
  importBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  importContent: {
    padding: '1.5rem',
  },
  importInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1.5rem',
  },
  infoTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  infoText: {
    margin: '0 0 1rem 0',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  formatTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  formatTh: {
    backgroundColor: '#ecf0f1',
    padding: '0.5rem',
    textAlign: 'left',
    borderBottom: '1px solid #bdc3c7',
  },
  formatTd: {
    padding: '0.5rem',
    borderBottom: '1px solid #ecf0f1',
  },
  fileInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  fileInputLabel: {
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  fileInputBtn: {
    display: 'inline-block',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: '2px dashed #bdc3c7',
    transition: 'all 0.2s',
  },
  fileName: {
    color: '#2c3e50',
    fontSize: '0.95rem',
  },
  importResult: {
    marginBottom: '1.5rem',
  },
  resultSummary: {
    padding: '1rem',
    borderRadius: '6px',
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1rem',
  },
  resultSuccess: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  resultFailed: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  errorList: {
    backgroundColor: '#ffebee',
    padding: '1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
  errorUl: {
    margin: '0.5rem 0 0 0',
    paddingLeft: '1.5rem',
  },
  errorLi: {
    color: '#c62828',
    marginBottom: '0.25rem',
  },
};

export default TaskManagement;
