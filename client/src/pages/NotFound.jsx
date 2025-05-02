import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-600 mb-6">Page Not Found</h2>
                <p className="text-gray-500 mb-8">
                    Oops! The page you are looking for does not exist.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Home className="w-4 h-4" />
                    <span>Return to Dashboard</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;