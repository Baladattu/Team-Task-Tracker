import { Link } from 'react-router-dom';
import { Folder } from 'lucide-react';

const ProjectCard = ({ project }) => {
    // Calculate some mock stats for the project
    const totalTasks = Math.floor(Math.random() * 4);
    const completedTasks = Math.floor(totalTasks * 0.6);
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <Link to={`/project/${project.id}`} className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <Folder className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-lg text-gray-800">{project.name}</h3>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                </p>

                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{completionPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                        <span className="text-gray-500">{completedTasks} / {totalTasks} tasks</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
