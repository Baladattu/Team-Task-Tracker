import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../services/projectService';
import { createTask, getTasksByProject } from '../services/taskService';
import { getAllUsers } from '../services/userService';
import {
    MoreVertical, Pencil, Trash2, Clock, Plus, Filter, SortAsc
} from 'lucide-react';
import toast from 'react-hot-toast';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import ProjectForm from '../components/projects/ProjectForm';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectData, tasksData, usersData] = await Promise.all([
                    getProjectById(id),
                    getTasksByProject(id),
                    getAllUsers()
                ]);

                setProject(projectData);
                setTasks(tasksData);
                setUsers(usersData);
            } catch (error) {
                console.error('Failed to fetch project data', error);
                toast.error('Failed to load project data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleCreateTask = async (taskData) => {
        try {
            // Add project ID to task data
            console.log(taskData);
            const newTaskData = { ...taskData, project_id: id };
            // This would be handled by the service in a real app
            const newTask = await createTask(newTaskData);

            setTasks([...tasks, newTask]);
            setShowTaskModal(false);
            toast.success('Task created successfully');
        } catch (error) {
            console.error('Failed to create task', error);
            toast.error('Failed to create task');
        }
    };

    const handleUpdateProject = async (projectData) => {
        try {
            const updatedProject = await updateProject(id, projectData);
            setProject(updatedProject);
            setShowProjectModal(false);
            toast.success('Project updated successfully');
        } catch (error) {
            console.error('Failed to update project', error);
            toast.error('Failed to update project');
        }
    };

    const handleDeleteProject = async () => {
        try {
            await deleteProject(id);
            navigate('/dashboard');
            toast.success('Project deleted successfully');
        } catch (error) {
            console.error('Failed to delete project', error);
            toast.error('Failed to delete project');
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'all') return true;
        return task.status === filterStatus
    });

    if (isLoading) {
        return <div className="text-center p-8">Loading project details...</div>;
    }

    if (!project) {
        return <div className="text-center p-8">Project not found</div>;
    }

    return (
        <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>

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
                                        setShowProjectModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit Project
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(true);
                                        setShowMenu(false);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Project
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-gray-600 mb-4">{project.description || 'No description provided'}</p>

                <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Created on {new Date(project.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
                <button
                    onClick={() => setShowTaskModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Task</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Filter:</span>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm border-gray-300 rounded-md"
                    >
                        <option value="all">All Tasks</option>
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>

                    <div className="flex items-center gap-2 ml-6">
                        <SortAsc className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Sort:</span>
                    </div>

                    <select className="text-sm border-gray-300 rounded-md">
                        <option>Newest First</option>
                        <option>Oldest First</option>
                        <option>Due Date</option>
                        <option>Priority</option>
                    </select>
                </div>
            </div>

            <TaskList
                tasks={filteredTasks}
                users={users}
                onTaskUpdate={(updatedTask) => {
                    const updatedTasks = tasks.map(task =>
                        task.id === updatedTask.id ? updatedTask : task
                    );
                    setTasks(updatedTasks);
                }}
                onTaskDelete={(taskId) => {
                    setTasks(tasks.filter(task => task.id !== taskId));
                }}
            />

            {showTaskModal && (
                <TaskForm
                    users={users}
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowTaskModal(false)}
                />
            )}

            {showProjectModal && (
                <ProjectForm
                    project={project}
                    onSubmit={handleUpdateProject}
                    onCancel={() => setShowProjectModal(false)}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmDialog
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone and all associated tasks will be deleted."
                    confirmLabel="Delete"
                    confirmVariant="danger"
                    onConfirm={handleDeleteProject}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
