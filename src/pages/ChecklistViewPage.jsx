import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ChecklistContent from '../components/contents/ChecklistContent';
import {
    fetchChecklistById,
    toggleTask as toggleTaskAction,
    updateChecklistAsync
} from '../store/slices/currentChecklistSlice';
import '../styles/css/ChecklistView.css';

export default function ChecklistView({ checklistId, onBack, onSetStatus }) {
    const dispatch = useDispatch();
    const { data: checklist, loading } = useSelector(state => state.currentChecklist);

    // Fetches the checklist data when component mounts or checklistId changes
    useEffect(() => {
        if (checklistId) {
            dispatch(fetchChecklistById(checklistId));
        }
    }, [checklistId, dispatch]);

    // Toggles task completion status with optimistic update and API sync
    const handleToggleTask = async (taskId) => {
        if (!checklist) return;

        dispatch(toggleTaskAction(taskId));

        try {
            const updated = checklist.todo.map(task =>
                task.id === taskId ? { ...task, statut: task.statut === 1 ? 0 : 1 } : task
            );

            await dispatch(updateChecklistAsync({
                id: checklist.id,
                data: {
                    title: checklist.title,
                    description: checklist.description,
                    todo: updated
                }
            }));

            const allDone = updated.every(t => t.statut === 1);
            const someDone = updated.some(t => t.statut === 1);
            let newStatus = 0;
            if (allDone) newStatus = 2;
            else if (someDone) newStatus = 1;

            if (newStatus !== checklist.status) {
                await onSetStatus(checklist.id, newStatus);
            }
        } catch (error) {
            console.error('Error updating task:', error);
            dispatch(fetchChecklistById(checklistId));
        }
    };

    if (loading) {
        return (
            <div className="checklist-container">
                <div className="loading-state">Loading checklist...</div>
            </div>
        );
    }

    if (!checklist) {
        return (
            <div className="checklist-container">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <div className="empty-state">Checklist not found</div>
            </div>
        );
    }

    return (
        <div className="checklist-container">
            <div className="checklist-header-section">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>
            </div>

            <ChecklistContent checklist={checklist} onToggleTask={handleToggleTask} />
        </div>
    );
}
