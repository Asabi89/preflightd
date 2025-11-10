import { Edit2, Trash2, CheckCircle2, Clock, Circle } from 'lucide-react';

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

export default function ChecklistCard({ checklist, onView, onEdit, onDelete }) {
  const done = checklist.todo?.filter(t => t.statut === 1).length || 0;
  const total = checklist.todo?.length || 0;

  return (
    <div 
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
}
