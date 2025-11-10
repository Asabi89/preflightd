import { Plus } from 'lucide-react';
import DashboardCard from '../components/contents/DashboardCard';
import '../assets/css/Dashboard.css';

// Affiche la liste des checklists
export default function DashboardPage({ 
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
          No checklists yet. Create your first one! 
        </div>
      ) : (
        <div className="checklist-grid">
          {checklists.map((checklist) => (
            <DashboardCard
              key={checklist.id}
              checklist={checklist}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <button className="fab-button" onClick={onNew} aria-label="Add new checklist">
        <Plus size={68} />
      </button>
    </div>
  );
}

