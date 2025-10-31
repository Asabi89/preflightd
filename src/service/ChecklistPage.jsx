import { useNavigate, useParams } from 'react-router-dom';
import ChecklistView from '../pages/ChecklistView';
import * as api from './api';

// Checklist page - view one checklist and check off tasks
export default function ChecklistPage() {
  // Get the checklist ID from the URL
  const { id } = useParams();
  
  // Hook to navigate between pages
  const navigate = useNavigate();

  // Function: update checklist status
  async function handleSetStatus(checklistId, status) {
    try {
      const result = await api.updateStatus(checklistId, status);
      console.log('Status update result:', result);
      return result;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }

  // Function: go back to dashboard
  function handleBack() {
    navigate('/');
  }

  return (
    <ChecklistView
      checklistId={id}
      onBack={handleBack}
      onSetStatus={handleSetStatus}
    />
  );
}
