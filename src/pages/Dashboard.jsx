import { Plus, Edit2, Trash2, CheckCircle2, Clock, Circle } from 'lucide-react';
import '../assets/css/Dashboard.css';

function getStatusText(status) {
  const s = Number(status);
  if (s === 0 || status === null || status === undefined) return 'New';
  if (s === 1) return 'In Progress';
  if (s === 2) return 'Completed';
  return 'New';
}

function getStatusIcon(status) {
  const s = Number(status);
  if (s === 0 || status === null || status === undefined) return <Circle size={16} />;
  if (s === 1) return <Clock size={16} />;
  if (s === 2) return <CheckCircle2 size={16} />;
  return <Circle size={16} />;
}

function getStatusClass(status) {
  const s = Number(status);
  if (s === 0 || status === null || status === undefined) return 'new';
  if (s === 1) return 'in-progress';
  if (s === 2) return 'completed';
  return 'new';
}

export default function Dashboard({ 
  checklists, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  onNew 
}) {
  if (loading) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">My Checklists</h1>
        <div className="loading-state">Loading your checklists...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Checklists</h1>
        <button className="new-button" onClick={onNew}>
          <Plus size={24} />
          New Checklist
        </button>
      </div>

      {checklists.length === 0 ? (
        <div className="empty-state">
          No checklists yet. Create your first one! 🚀
        </div>
      ) : (
        <div className="checklist-grid">
          {checklists.map((checklist) => {
            const done = checklist.todo?.filter(t => t.statut === 1).length || 0;
            const total = checklist.todo?.length || 0;

            return (
              <div 
                key={checklist.id}
                className="checklist-card"
                onClick={() => onView(checklist.id)}
              >
                <div className="checklist-header">
                  <h2 className="checklist-title">{checklist.title}</h2>
                  <p className="checklist-description">{checklist.description}</p>
                </div>

                <div className={`status-badge ${getStatusClass(checklist.status)}`}>
                  {getStatusIcon(checklist.status)}
                  {getStatusText(checklist.status)}
                </div>

                <div className="stats">
                  Tasks: <span className="stats-number">{done}</span> / {total}
                </div>

                <div className="button-group">
                  <button 
                    className="action-button edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(checklist.id);
                    }}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(checklist.id);
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAB for mobile */}
      <button className="fab-button" onClick={onNew} aria-label="Add new checklist">
        <Plus size={68} />
      </button>
    </div>
  );
}

