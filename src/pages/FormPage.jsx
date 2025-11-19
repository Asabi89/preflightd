import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import ChecklistFormContent from '../components/contents/FormContent';
import { fetchChecklistById } from '../store/slices/currentChecklistSlice';
import '../styles/css/ChecklistForm.css';

export default function ChecklistForm({ checklistId, onCreate, onUpdate, onCancel }) {
    const dispatch = useDispatch();
    const reduxChecklist = useSelector(state => state.currentChecklist.data);

    const [loading, setLoading] = useState(!!checklistId);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [adding, setAdding] = useState(false);

    // Loads checklist data from Redux when editing an existing checklist
    useEffect(() => {
        if (checklistId) {
            dispatch(fetchChecklistById(checklistId)).then(() => {
                setLoading(false);
            });
        }
    }, [checklistId, dispatch]);

    // Populates form fields when checklist data is loaded
    useEffect(() => {
        if (reduxChecklist && checklistId) {
            setTitle(reduxChecklist.title || '');
            setDescription(reduxChecklist.description || '');
            setTasks((reduxChecklist.todo || []).map(task => ({
                ...task,
                id: task.id || uuidv4()
            })));
        }
    }, [reduxChecklist, checklistId]);

    // Adds a new task to the form
    const addTask = () => {
        if (taskTitle.trim()) {
            setTasks([
                ...tasks,
                {
                    id: uuidv4(),
                    title: taskTitle.trim(),
                    description: taskDesc.trim(),
                    statut: 0
                }
            ]);
            setTaskTitle('');
            setTaskDesc('');
            setAdding(false);
        }
    };

    // Loads a task into the edit fields
    const editTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            setEditIndex(taskId);
            setTaskTitle(task.title);
            setTaskDesc(task.description || '');
        }
    };

    // Saves changes to an edited task
    const saveTaskEdit = () => {
        if (taskTitle.trim() && editIndex !== null) {
            const updated = tasks.map(task =>
                task.id === editIndex
                    ? { ...task, title: taskTitle.trim(), description: taskDesc.trim() }
                    : task
            );
            setTasks(updated);
            setEditIndex(null);
            setTaskTitle('');
            setTaskDesc('');
        }
    };

    // Removes a task from the form with confirmation
    const deleteTask = (taskId) => {
        const confirmed = window.confirm('Are you sure you want to delete this task?');
        if (confirmed) {
            setTasks(tasks.filter(t => t.id !== taskId));
        }
    };

    // Cancels editing and clears form fields
    const cancelEdit = () => {
        setEditIndex(null);
        setAdding(false);
        setTaskTitle('');
        setTaskDesc('');
    };

    // Validates and returns the form data as JSON
    const getFormData = () => {
        if (!title.trim()) {
            throw new Error('Please enter a checklist title');
        }

        return {
            title: title.trim(),
            description: description.trim(),
            todo: tasks.map(task => ({
                title: task.title,
                description: task.description || '',
                statut: task.statut || 0
            }))
        };
    };

    // Saves or updates the checklist
    const save = () => {
        try {
            const data = getFormData();
            if (checklistId) {
                onUpdate(checklistId, data);
            } else {
                onCreate(data);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="form-container">
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af', fontSize: '1.1rem' }}>
                    Loading checklist...
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <div className="form-header">
                <button className="back-button" onClick={onCancel}>
                    <ArrowLeft size={20} />
                    Back
                </button>
            </div>

            <div className="form-card">
                <h1 className="form-main-title">{checklistId ? 'Edit Checklist' : 'New Checklist'}</h1>

                <ChecklistFormContent
                    title={title}
                    description={description}
                    tasks={tasks}
                    editIndex={editIndex}
                    taskTitle={taskTitle}
                    taskDesc={taskDesc}
                    adding={adding}
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                    onTaskTitleChange={setTaskTitle}
                    onTaskDescChange={setTaskDesc}
                    onSaveEdit={saveTaskEdit}
                    onEdit={editTask}
                    onDelete={deleteTask}
                    onCancelEdit={cancelEdit}
                    onAddTask={addTask}
                    onStartAdding={() => setAdding(true)}
                />

                <button className="save-button" onClick={save}>
                    <Save size={24} />
                    Save Checklist
                </button>
            </div>
        </div>
    );
}
