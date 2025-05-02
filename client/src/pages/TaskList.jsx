import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { ChevronRight, CheckCircle, Circle, Clock, User, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../common/ConfirmDialog';

const TaskList = ({ tasks, users, onTaskUpdate, onTaskDelete }) => {
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleStatusChange = async (task) => {
        try {   
            const newStatus = task.status === 'done' ? 'todo' : 'done';
            const updatedTask = { ...task, status: newStatus };
            console.log('Updating task status:', updatedTask);
            await updateTask(task.id, updatedTask);
            onTaskUpdate(updatedTask);
            toast.success(`Task marked as ${newStatus}`);
        } catch (error) {
            console.error('Failed to update task status', error);
            toast.error('Failed to update task status');
        }
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(taskToDelete.id);
            onTaskDelete(taskToDelete.id);
            setTaskToDelete(null);
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task', error);
            toast.error('Failed to delete task');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'in-progress':
                return <Circle className="w-5 h-5 text-blue-500" />;
            default:
                return <Circle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getUserById = (userId) => {
        return users.find(user => user.id === userId) || { name: 'Kenche Bala Dattu' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date() && status !== 'done';
    };

    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">No tasks found. Create a new task to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {tasks.map(task => (
                    <li key={task.id} className="hover:bg-gray-50">
                        <div className="px-6 py-4">
                            <div className="flex items-start">
                                <button
                                    onClick={() => handleStatusChange(task)}
                                    className="mt-1 mr-3 flex-shrink-0"
                                >
                                    {getStatusIcon(task.status)}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div
                                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                        className="flex justify-between items-start cursor-pointer"
                                    >
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">
                                                {task.title}
                                            </h3>

                                            <div className="flex items-center mt-1">
                                                <div className="flex items-center text-sm text-gray-500 mr-4">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span className={isOverdue(task.deadline) ? 'text-red-500' : ''}>
                                                        {formatDate(task.deadline)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center text-sm text-gray-500">
                                                    <User className="w-4 h-4 mr-1" />
                                                    <span>{getUserById(task.assigned_to)?.name || 'Kenche Bala Dattu'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTaskToDelete(task);
                                                }}
                                                className="text-gray-400 hover:text-red-500 mr-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronRight
                                                className={`w-5 h-5 text-gray-400 transition-transform ${expandedTaskId === task.id ? 'transform rotate-90' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {expandedTaskId === task.id && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 mb-3">
                                                {task.description || 'No description provided'}
                                            </p>
                                            <Link
                                                to={`/task/${task.id}`}
                                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {taskToDelete && (
                <ConfirmDialog
                    title="Delete Task"
                    message="Are you sure you want to delete this task? This action cannot be undone."
                    confirmLabel="Delete"
                    confirmVariant="danger"
                    onConfirm={handleDeleteTask}
                    onCancel={() => setTaskToDelete(null)}
                />
            )}
        </div>
    );
};

export default TaskList;
