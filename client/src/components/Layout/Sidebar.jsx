import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, FolderKanban, Settings, Plus, ChevronDown } from 'lucide-react';
import { getAllProjects } from '../../services/projectService';

const Sidebar = () => {
    const [projects, setProjects] = useState([]);
    const [expandProjects, setExpandProjects] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <aside className="bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block">
            <div className="p-4">
                <h1 className="text-xl font-semibold">TaskTracker</h1>
            </div>

            <nav className="mt-4">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                    }
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                </NavLink>

                <div>
                    <button
                        onClick={() => setExpandProjects(!expandProjects)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <FolderKanban className="w-5 h-5" />
                            <span>Projects</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandProjects ? 'rotate-180' : ''}`} />
                    </button>

                    {expandProjects && (
                        <div className="pl-4">
                            {projects.map(project => (
                                <NavLink
                                    key={project.id}
                                    to={`/project/${project.id}`}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    {project.name}
                                </NavLink>
                            ))}
                            <NavLink
                                to="/dashboard?new=project"
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-gray-700"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Project</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                    }
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
