import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    updateTask, deleteTask, getTasksByProject,
    getTaskById
} from '../services/taskService';
import {
    getTaskComments, createComment, deleteComment
} from '../services/commentService';
import {
    getTaskAttachments, uploadAttachment, deleteAttachment, getDownloadUrl
} from '../services/attachmentService';
import { getAllUsers } from '../services/userService';
import {
    ArrowLeft, CheckCircle, Circle, Clock, User, Paperclip, Send,
    Trash2, Download, MoreVertical, Pencil, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import TaskForm from '../components/tasks/TaskForm';
import ConfirmDialog from '../components/common/ConfirmDialog';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [subtasks, setSubtasks] = useState([]);
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, we'd have an endpoint to get a task by ID
                // For now, let's mock the API calls
                // Mock task data
                console.log(id);
                const mockTask = await getTaskById(id);

                const [
                    commentsData,
                    attachmentsData,
                    usersData,
                    projectTasks
                ] = await Promise.all([
                    getTaskComments(id),
                    getTaskAttachments(id),
                    getAllUsers(),
                    getTasksByProject(mockTask.project_id)
                ]);

                setTask(mockTask);
                setComments(commentsData || []);
                setAttachments(attachmentsData || []);
                setUsers(usersData);

                // Filter subtasks (tasks with this task as parent)
                const filteredSubtasks = projectTasks.filter(t => t.parent_task_id === id);
                setSubtasks(filteredSubtasks);
            } catch (error) {
                console.error('Failed to fetch task data', error);
                toast.error('Failed to load task data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusChange = async () => {
        try {
            const newStatus = task.status === 'done' ? 'todo' : 'done';
            const updatedTask = { ...task, status: newStatus };
            await updateTask(task.id, {status:updatedTask.status});
            setTask(updatedTask);
            toast.success(`Task marked as ${newStatus}`);
        } catch (error) {
            console.error('Failed to update task status', error);
            toast.error('Failed to update task status');
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const commentData = {
                content: commentText,
                task_id: id
            };

            await createComment(commentData);

            // Mock API response by creating a new comment object
            const newComment = {
                id: Math.random().toString(36).substr(2, 9),
                ...commentData,
                user_id: '123', // Current user ID would come from auth context
                created_at: new Date().toISOString()
            };

            setComments([...comments, newComment]);
            setCommentText('');
            toast.success('Comment added');
        } catch (error) {
            console.error('Failed to add comment', error);
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
            toast.success('Comment deleted');
        } catch (error) {
            console.error('Failed to delete comment', error);
            toast.error('Failed to delete comment');
        }
    };

    const handleUploadAttachment = async (e) => {
        const file = e.target.files[0];
        if (!file) return toast.error('No file selected');

        // Optional: Check for file size limits
        if (file.size > 5 * 1024 * 1024) { // 5MB limit example
            return toast.error('File is too large (max 5MB)');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('task_id', id);

            // Make sure the request includes the proper headers
            const response = await uploadAttachment(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok && response.status) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            // Clear the file input
            e.target.value = '';

            // Refetch the full list of attachments after upload
            const updatedAttachments = await getTaskAttachments(id);
            setAttachments(updatedAttachments);
            toast.success('File uploaded successfully');
        } catch (error) {
            console.error('Failed to upload file', error);
            toast.error(`Failed to upload file: ${error.message || 'Unknown error'}`);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            await deleteAttachment(attachmentId);
            setAttachments(attachments.filter(a => a.id !== attachmentId));
            toast.success('Attachment deleted');
        } catch (error) {
            console.error('Failed to delete attachment', error);
            toast.error('Failed to delete attachment');
        }
    };

    // Problem 1: You're returning a promise in the href
// Problem 2: You need to open the URL when it's ready
// Problem 3: The handler should trigger when clicked

const handleDownloadAttachment = async (attachmentId, e) => {
    if (e) e.preventDefault(); // Prevent default link behavior if clicked
    
    try {
        // Get the download URL from the API
        const downloadUrl = await getDownloadUrl(attachmentId);
        
        // Open the download URL in a new tab or trigger download
        // window.open(downloadUrl, '_blank');
        // window.location.href = downloadUrl;
        const a = document.createElement('a');  
        a.href = downloadUrl; // This line is not necessary, but you can keep it for reference
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success('File downloaded successfully');
        
    } catch (err) {
        console.error('Failed to download attachment', err);
        toast.error('Failed to download attachment');
    }
}

    const handleUpdateTask = async (taskData) => {
        try {
            const updatedTask = await updateTask(id, taskData);
            setTask(updatedTask);
            setShowTaskModal(false);
            toast.success('Task updated successfully');
        } catch (error) {
            console.error('Failed to update task', error);
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(id);
            navigate(`/project/${task.project_id}`);
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task', error);
            toast.error('Failed to delete task');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'in-progress':
                return <Circle className="w-6 h-6 text-blue-500" />;
            default:
                return <Circle className="w-6 h-6 text-gray-400" />;
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

    if (isLoading) {
        return <div className="text-center p-8">Loading task details...</div>;
    }

    if (!task) {
        return <div className="text-center p-8">Task not found</div>;
    }

    return (
        <div className="container mx-auto">
            <div className="mb-6">
                <Link
                    to={`/project/${task.project_id}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span>Back to Project</span>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start">
                        <button
                            onClick={handleStatusChange}
                            className="mt-1 mr-4 flex-shrink-0"
                        >
                            {getStatusIcon(task.status)}
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>

                            <div className="flex items-center mt-2">
                                <div className="flex items-center text-sm text-gray-500 mr-6">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span className={isOverdue(task.deadline) ? 'text-red-500 font-medium' : ''}>
                                        Due: {formatDate(task.deadline)}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm text-gray-500">
                                    <User className="w-4 h-4 mr-1" />
                                    <span>Assigned to: {getUserById(task.assigned_to)?.name || 'Kenche Bala Dattu'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button
                                    onClick={() => {
                                        setShowTaskModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit Task
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(true);
                                        setShowMenu(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Task
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
                    <p className="text-gray-600">
                        {task.description || 'No description provided'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Comments Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Comments</h2>

                        <div className="space-y-4 mb-6">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.id} className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-gray-800">
                                                    {getUserById(task.assigned_to)?.name || 'User'}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    {/* <span>{new Date()}</span> */}
                                                    <span>Now</span>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No comments yet</p>
                            )}
                        </div>

                        <form onSubmit={handleSubmitComment} className="flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Subtasks Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Subtasks</h2>

                        {subtasks.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {subtasks.map(subtask => (
                                    <li key={subtask.id} className="py-3">
                                        <div className="flex items-center">
                                            <div className="mr-3">
                                                {getStatusIcon(subtask.status)}
                                            </div>
                                            <div className="flex-1">
                                                <Link to={`/task/${subtask.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                                                    {subtask.title}
                                                </Link>
                                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span className={isOverdue(subtask.deadline) ? 'text-red-500' : ''}>
                                                        {formatDate(subtask.deadline)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {getUserById(subtask.assigned_to)?.name || 'Avijit'}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 mb-4">No subtasks created yet</p>
                                <Link
                                    to={`/project/${task.project_id}?new=task&parent=${task.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <div className="w-4 h-4"></div>
                                    <span>Add Subtask</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div>
                    {/* Status Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Status</h2>

                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Current Status</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${task.status === 'done' ? 'bg-green-100 text-green-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {task.status === 'todo' ? 'To Do' :
                                    task.status === 'in-progress' ? 'In Progress' : 'Done'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Created On</span>
                            <span className="text-gray-800">{formatDate(task.created_at)}</span>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Due Date</span>
                            <span className={`text-gray-800 ${isOverdue(task.deadline) ? 'text-red-500 font-medium' : ''}`}>
                                {formatDate(task.deadline)}
                                {isOverdue(task.deadline) && (
                                    <span className="ml-2 inline-flex items-center">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Attachments Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Attachments</h2>

                        {attachments.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {attachments.map(attachment => (
                                    <li key={attachment.id} className="py-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Paperclip className="w-5 h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{attachment.file_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {Math.round(attachment.file_size / 1024)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href="#" // Placeholder href
                                                    onClick={(e) => handleDownloadAttachment(attachment.id, e)}
                                                    className="text-gray-400 hover:text-blue-600"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteAttachment(attachment.id)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-2">No attachments</p>
                        )}

                        <div className="mt-4">
                            <label className="block w-full">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleUploadAttachment}
                                />
                                <span className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 w-full">
                                    <Paperclip className="w-4 h-4" />
                                    <span>Upload File</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {showTaskModal && (
                <TaskForm
                    task={task}
                    users={users}
                    onSubmit={handleUpdateTask}
                    onCancel={() => setShowTaskModal(false)}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmDialog
                    title="Delete Task"
                    message="Are you sure you want to delete this task? This action cannot be undone and all comments and attachments will be deleted."
                    confirmLabel="Delete"
                    confirmVariant="danger"
                    onConfirm={handleDeleteTask}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default TaskDetails;
