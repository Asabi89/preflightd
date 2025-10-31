import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import * as api from '../service/api';
import '../assets/css/ChecklistView.css';

const statusText = (status) => {
  const s = Number(status);
  if (s === 0 || status === null || status === undefined) return 'New';
  if (s === 1) return 'In Progress';
  if (s === 2) return 'Completed';
  return 'New';
};

const statusIcon = (status) => {
  const s = Number(status);
  if (s === 0 || status === null || status === undefined) return <Circle size={20} />;
  if (s === 1) return <Clock size={20} />;
  if (s === 2) return <CheckCircle2 size={20} />;
  return <Circle size={20} />;
};

const computeStatus = (todos) => {
  const allDone = todos.every(t => t.statut === 1);
  const someDone = todos.some(t => t.statut === 1);
  if (allDone) return 2;
  if (someDone) return 1;
  return 0;
};

export default function ChecklistView({ checklistId, onBack, onSetStatus }) {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklist();
  }, [checklistId]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const data = await api.getChecklist(checklistId);
      // API returns 'statut' (French) not 'status' (English)
      const status = data.statut ?? data.status ?? 0;
      setChecklist({
        ...data,
        status: status
      });
    } catch (error) {
      console.error('Error fetching checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskIndex) => {
    if (!checklist) return;

    const updated = checklist.todo.map((task, index) => 
      index === taskIndex ? { ...task, statut: task.statut === 1 ? 0 : 1 } : task
    );

    const newStatus = computeStatus(updated);
    const oldStatus = checklist.status;

    // Update UI immediately
    setChecklist({
      ...checklist,
      todo: updated,
      status: newStatus
    });

    // Then update server in background
    try {
      console.log('Updating status from', oldStatus, 'to', newStatus);
      
      // Update checklist with new todos
      const updateResult = await api.updateChecklist(checklist.id, {
        title: checklist.title,
        description: checklist.description,
        todo: updated
      });
      console.log('Checklist update result:', updateResult);

      // Then update status separately (AFTER checklist update to prevent reset)
      if (newStatus !== oldStatus) {
        const statusResult = await onSetStatus(checklist.id, newStatus);
        console.log('Status update completed:', statusResult);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert on error
      await fetchChecklist();
    }
  };

  if (loading) {
    return (
      <div className="checklist-container">
        <div className="loading-state">Loading checklist...</div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="checklist-container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="empty-state">Checklist not found</div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    const s = Number(status);
    if (s === 2) return 'completed';
    if (s === 1) return 'in-progress';
    return 'new';
  };

  return (
    <div className="checklist-container">
      <div className="checklist-header-section">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      <div className="checklist-card">
        <h1 className="checklist-main-title">{checklist.title}</h1>
        <p className="checklist-main-description">{checklist.description}</p>
        
        <div className={`status-badge ${getStatusClass(checklist.status)}`}>
          {statusIcon(checklist.status)}
          {statusText(checklist.status)}
        </div>

        {checklist.todo && checklist.todo.length > 0 ? (
          <ul className="task-list">
            {checklist.todo.map((task, index) => (
              <li 
                key={index}
                className={`task-item ${task.statut === 1 ? 'done' : ''}`}
                onClick={() => toggleTask(index)}
              >
                <div className="task-content">
                  <button className={`task-checkbox ${task.statut === 1 ? 'done' : ''}`}>
                    {task.statut === 1 ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                  </button>
                  <div className="task-text-wrapper">
                    <div className={`task-title ${task.statut === 1 ? 'done' : ''}`}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className={`task-description ${task.statut === 1 ? 'done' : ''}`}>
                        {task.description}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">No tasks in this checklist</div>
        )}
      </div>
    </div>
  );
}
