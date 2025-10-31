import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Edit2, Trash2, X } from 'lucide-react';
import * as api from '../service/api';
import '../assets/css/ChecklistForm.css';

export default function ChecklistForm({ checklistId, onCreate, onUpdate, onCancel }) {
  const [loading, setLoading] = useState(!!checklistId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (checklistId) {
      fetchChecklist();
    }
  }, [checklistId]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const data = await api.getChecklist(checklistId);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setTasks(data.todo || []);
    } catch (error) {
      console.error('Error fetching checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = () => {
    if (taskTitle.trim()) {
      setTasks([...tasks, {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        statut: 0
      }]);
      setTaskTitle('');
      setTaskDesc('');
      setAdding(false);
    }
  };

  const editTask = (index) => {
    setEditIndex(index);
    setTaskTitle(tasks[index].title);
    setTaskDesc(tasks[index].description || '');
  };

  const saveTaskEdit = () => {
    if (taskTitle.trim() && editIndex !== null) {
      const updated = tasks.map((task, index) =>
        index === editIndex
          ? { ...task, title: taskTitle.trim(), description: taskDesc.trim() }
          : task
      );
      setTasks(updated);
      setEditIndex(null);
      setTaskTitle('');
      setTaskDesc('');
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setAdding(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const save = () => {
    if (!title.trim()) {
      alert('Please enter a checklist title');
      return;
    }

    const data = {
      title: title.trim(),
      description: description.trim(),
      todo: tasks.map(task => ({
        title: task.title,
        description: task.description || '',
        statut: task.statut || 0
      }))
    };

    if (checklistId) {
      onUpdate(checklistId, data);
    } else {
      onCreate(data);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af', fontSize: '1.1rem' }}>
          Loading checklist...
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <button className="back-button" onClick={onCancel}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      <div className="form-card">
        <h1 className="form-main-title">{checklistId ? 'Edit Checklist' : 'New Checklist'}</h1>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter checklist title..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter checklist description..."
          />
        </div>

        <h2 className="section-title">Tasks</h2>

        <div className="task-list-form">
          {tasks.map((task, index) => (
            <div className="task-card-form" key={index}>
              {editIndex === index ? (
                <div className="task-input-group">
                  <input
                    className="form-input"
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    autoFocus
                  />
                  <textarea
                    className="form-textarea"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Task description (optional)..."
                    style={{ minHeight: '80px' }}
                  />
                  <div className="task-input-row">
                    <button className="small-button success" onClick={saveTaskEdit}>
                      <Save size={16} />
                      Save
                    </button>
                    <button className="small-button" onClick={cancelEdit}>
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-header-form">
                    <div className="task-title-display">{task.title}</div>
                    <div className="task-button-group">
                      <button className="icon-button edit" onClick={() => editTask(index)}>
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button className="icon-button delete" onClick={() => deleteTask(index)}>
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <div className="task-description-display">{task.description}</div>
                  )}
                </>
              )}
            </div>
          ))}

          {adding && (
            <div className="task-card-form">
              <div className="task-input-group">
                <input
                  className="form-input"
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  autoFocus
                />
                <textarea
                  className="form-textarea"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task description (optional)..."
                  style={{ minHeight: '80px' }}
                />
                <div className="task-input-row">
                  <button className="small-button success" onClick={addTask}>
                    <Plus size={16} />
                    Add Task
                  </button>
                  <button className="small-button" onClick={cancelEdit}>
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!adding && (
          <button className="add-task-button" onClick={() => setAdding(true)}>
            <Plus size={20} />
            Add Task
          </button>
        )}

        <button className="save-button" onClick={save}>
          <Save size={24} />
          Save Checklist
        </button>
      </div>
    </div>
  );
}
