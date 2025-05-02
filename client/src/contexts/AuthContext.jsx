import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.get('/u/whoami');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Not authenticated', error);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (provider) => {
        window.location.href = `http://localhost:3000/u/${provider}`;
    };

    const logout = async () => {
        try {
            // Assuming a logout endpoint exists or just clear state
            setCurrentUser(null);
            // Could redirect to login
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const value = {
        currentUser,
        loading,
        login,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};