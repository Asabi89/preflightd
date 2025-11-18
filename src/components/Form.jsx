import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChecklistForm from '../pages/FormPage';
import { createChecklistAsync } from '../store/slices/checklistsSlice';
import { updateChecklistAsync } from '../store/slices/currentChecklistSlice';

export default function Form() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Creates a new checklist and redirects to dashboard on success
    async function handleCreate(checklistData) {
        try {
            const result = await dispatch(createChecklistAsync(checklistData));

            if (result.payload && result.payload.id) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating checklist:', error);
        }
    }

    // Updates an existing checklist and redirects to dashboard on success
    async function handleUpdate(checklistId, checklistData) {
        try {
            const result = await dispatch(
                updateChecklistAsync({
                    id: checklistId,
                    data: checklistData
                })
            );

            if (result.payload) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error updating checklist:', error);
        }
    }

    // Cancels form and returns to dashboard
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
