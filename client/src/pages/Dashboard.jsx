import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllProjects, createProject } from '../services/projectService';
import { Clock, CheckSquare, AlertCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check URL params for new project trigger
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('new') === 'project') {
            setShowProjectModal(true);
            navigate('/dashboard', { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
                toast.error('Failed to load projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleCreateProject = async (projectData) => {
        try {
            const newProject = await createProject(projectData);
            setProjects([...projects, newProject]);
            setShowProjectModal(false);
            toast.success('Project created successfully');
        } catch (error) {
            console.error('Failed to create project', error);
            toast.error('Failed to create project');
        }
    };

    const taskSummary = {
        totalTasks: 4,
        completedTasks: 2,
        dueSoonTasks: 1,
        overdueTasks: 1
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <button
                    onClick={() => setShowProjectModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <h2 className="text-gray-700 font-medium">Total Tasks</h2>
                        <span className="text-2xl font-bold text-gray-800">{taskSummary.totalTasks}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-green-500" />
                            <h2 className="text-gray-700 font-medium">Completed</h2>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{taskSummary.completedTasks}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-gray-700 font-medium">Due Soon</h2>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{taskSummary.dueSoonTasks}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <h2 className="text-gray-700 font-medium">Overdue</h2>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{taskSummary.overdueTasks}</span>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h2>

            {isLoading ? (
                <div className="text-center p-8">Loading projects...</div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600 mb-4">You don't have any projects yet.</p>
                    <button
                        onClick={() => setShowProjectModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Create your first project
                    </button>
                </div>
            )}

            {showProjectModal && (
                <ProjectForm
                    onSubmit={handleCreateProject}
                    onCancel={() => setShowProjectModal(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
