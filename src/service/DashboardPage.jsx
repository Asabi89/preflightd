import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import * as api from './api';

// Dashboard page - shows all checklists
export default function DashboardPage() {
  // Hook to navigate between pages
  const navigate = useNavigate();
  
  // State: list of checklists
  const [checklists, setChecklists] = useState([]);
  
  // State: is data loading?
  const [loading, setLoading] = useState(true);

  // Load checklists when page opens
  useEffect(() => {
    loadChecklists();
  }, []);

  // Function: load all checklists from server
  async function loadChecklists() {
    try {
      setLoading(true);
      const data = await api.getAllChecklists();
      // API returns 'statut' (French) - map to 'status' (English)
      const checklistsWithStatus = data.map(checklist => ({
        ...checklist,
        status: checklist.statut ?? checklist.status ?? 0
      }));
      setChecklists(checklistsWithStatus);
    } catch (error) {
      console.error('Error loading checklists:', error);
      setChecklists([]);
    } finally {
      setLoading(false);
    }
  }

  // Function: delete a checklist
  async function handleDelete(id) {
    // Ask user to confirm
    const confirmed = window.confirm('Are you sure you want to delete this checklist?');
    
    if (confirmed) {
      try {
        await api.deleteChecklist(id);
        // Reload the list
        await loadChecklists();
      } catch (error) {
        console.error('Error deleting checklist:', error);
      }
    }
  }

  // Function: go to view page
  function handleView(id) {
    navigate(`/checklist/${id}`);
  }

  // Function: go to edit page
  function handleEdit(id) {
    navigate(`/edit/${id}`);
  }

  // Function: go to new checklist page
  function handleNew() {
    navigate('/new');
  }

  return (
    <Dashboard
      checklists={checklists}
      loading={loading}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNew={handleNew}
    />
  );
}
