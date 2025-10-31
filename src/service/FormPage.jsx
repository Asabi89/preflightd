import { useNavigate, useParams } from 'react-router-dom';
import ChecklistForm from '../pages/ChecklistForm';
import * as api from './api';

// Form page - create or edit a checklist
export default function FormPage() {
  // Get the checklist ID from the URL (if editing)
  const { id } = useParams();
  
  // Hook to navigate between pages
  const navigate = useNavigate();

  // Function: create a new checklist
  async function handleCreate(checklistData) {
    try {
      const result = await api.createChecklist(checklistData);
      
      // If successful, go back to dashboard
      if (result.id) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating checklist:', error);
    }
  }

  // Function: update existing checklist
  async function handleUpdate(checklistId, checklistData) {
    try {
      const result = await api.updateChecklist(checklistId, checklistData);
      
      // If successful, go back to dashboard
      if (result.done) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  }

  // Function: cancel and go back
  function handleCancel() {
    navigate('/');
  }

  return (
    <ChecklistForm
      checklistId={id}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  );
}
