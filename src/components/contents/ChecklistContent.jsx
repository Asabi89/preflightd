import { CheckCircle2, Circle, Clock } from 'lucide-react';

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

const getStatusClass = (status) => {
  const s = Number(status);
  if (s === 2) return 'completed';
  if (s === 1) return 'in-progress';
  return 'new';
};

function TaskItem({ task, onToggle }) {
  return (
    <li 
      className={`task-item ${task.statut === 1 ? 'done' : ''}`}
      onClick={() => onToggle(task.id)}
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
  );
}

export default function ChecklistContent({ checklist, onToggleTask }) {
  return (
    <div className="checklist-card">
      <h1 className="checklist-main-title">{checklist.title}</h1>
      <p className="checklist-main-description">{checklist.description}</p>
      
      <div className={`status-badge ${getStatusClass(checklist.status)}`}>
        {statusIcon(checklist.status)}
        {statusText(checklist.status)}
      </div>

      {checklist.todo && checklist.todo.length > 0 ? (
        <ul className="task-list">
          {checklist.todo.map((task) => (
            <TaskItem 
              key={task.id}
              task={task}
              onToggle={onToggleTask}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">No tasks in this checklist</div>
      )}
    </div>
  );
}
