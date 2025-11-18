import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ChecklistView from '../pages/ChecklistViewPage';
import { updateChecklistStatusAsync } from '../store/slices/currentChecklistSlice';


export default function Checklist() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Updates the global status of the checklist
    async function handleSetStatus(checklistId, status) {
        return await dispatch(updateChecklistStatusAsync({ id: checklistId, status }));
    }

    // Navigates back to the dashboard
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
