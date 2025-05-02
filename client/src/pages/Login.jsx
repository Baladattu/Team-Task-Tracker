import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Github, Mail } from 'lucide-react';

const Login = () => {
    const { login, isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
            <div className="mx-auto w-full max-w-md">
                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">TaskTracker</h1>
                        <p className="text-gray-600 mt-2">Sign in to manage your projects and tasks</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => login('github')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Github className="w-5 h-5" />
                            <span>Sign in with GitHub</span>
                        </button>

                        <button
                            onClick={() => login('google')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Mail className="w-5 h-5" />
                            <span>Sign in with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
