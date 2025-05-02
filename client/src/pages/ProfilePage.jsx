import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, LogOut } from 'lucide-react';

const ProfilePage = () => {
    const { currentUser, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-3xl">
            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-6">
                        <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{currentUser?.name || 'User'}</h1>
                        <p className="text-gray-600">Team Member</p>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Profile Information</h2>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800">{currentUser?.email || 'example@email.com'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{isLoading ? 'Logging out...' : 'Sign out'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
