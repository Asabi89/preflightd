import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import { fetchChecklists, deleteChecklistAsync } from '../store/slices/checklistsSlice';

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: checklists, loading } = useSelector(state => state.checklists);

    // Fetches all checklists on component mount
    useEffect(() => {
        dispatch(fetchChecklists());
    }, [dispatch]);

    // Deletes a checklist after user confirmation
    async function handleDelete(id) {
        const confirmed = window.confirm('Are you sure you want to delete this checklist?');
        if (confirmed) {
            dispatch(deleteChecklistAsync(id));
        }
    }

    // Navigates to the checklist view page
    function handleView(id) {
        navigate(`/checklist/${id}`);
    }

    // Navigates to the edit page for a checklist
    function handleEdit(id) {
        navigate(`/edit/${id}`);
    }

    // Navigates to create a new checklist
    function handleNew() {
        navigate('/new');
    }

    return (
        <DashboardPage
            checklists={checklists}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
        />
    );
}
