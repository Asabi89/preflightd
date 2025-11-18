import { Save, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function ChecklistFormContent({
  title,
  description,
  tasks,
  editIndex,
  taskTitle,
  taskDesc,
  adding,
  onTitleChange,
  onDescriptionChange,
  onTaskTitleChange,
  onTaskDescChange,
  onSaveEdit,
  onEdit,
  onDelete,
  onCancelEdit,
  onAddTask,
  onStartAdding
}) {
  return (
    <>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter checklist title..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter checklist description..."
        />
      </div>

      <h2 className="section-title">Tasks</h2>

      <div className="task-list-form">
        {tasks.map((task) => (
          <div className="task-card-form" key={task.id}>
            {editIndex === task.id ? (
              <div className="task-input-group">
                <input
                  className="form-input"
                  type="text"
                  value={taskTitle}
                  onChange={(e) => onTaskTitleChange(e.target.value)}
                  placeholder="Task title..."
                  autoFocus
                />
                <textarea
                  className="form-textarea"
                  value={taskDesc}
                  onChange={(e) => onTaskDescChange(e.target.value)}
                  placeholder="Task description (optional)..."
                  style={{ minHeight: '80px' }}
                />
                <div className="task-input-row">
                  <button className="small-button success" onClick={onSaveEdit}>
                    <Save size={16} />
                    Save
                  </button>
                  <button className="small-button" onClick={onCancelEdit}>
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
                    <button className="icon-button edit" onClick={() => onEdit(task.id)}>
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button className="icon-button delete" onClick={() => onDelete(task.id)}>
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
                onChange={(e) => onTaskTitleChange(e.target.value)}
                placeholder="Task title..."
                autoFocus
              />
              <textarea
                className="form-textarea"
                value={taskDesc}
                onChange={(e) => onTaskDescChange(e.target.value)}
                placeholder="Task description (optional)..."
                style={{ minHeight: '80px' }}
              />
              <div className="task-input-row">
                <button className="small-button success" onClick={onAddTask}>
                  <Plus size={16} />
                  Add Task
                </button>
                <button className="small-button" onClick={onCancelEdit}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!adding && (
        <button className="add-task-button" onClick={onStartAdding}>
          <Plus size={20} />
          Add Task
        </button>
      )}
    </>
  );
}
