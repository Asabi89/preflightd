import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import DashboardCard from '../components/contents/DashboardCard';
import '../styles/css/Dashboard.css';

export default function DashboardPage({ 
  checklists, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  onNew 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filters checklists by title based on search query
  const filteredChecklists = checklists.filter(checklist =>
    checklist.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search checklists..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredChecklists.length === 0 ? (
        <div className="empty-state">
          {checklists.length === 0 
            ? 'No checklists yet. Create your first one!' 
            : 'No checklists match your search.'}
        </div>
      ) : (
        <div className="checklist-grid">
          {filteredChecklists.map((checklist) => (
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

