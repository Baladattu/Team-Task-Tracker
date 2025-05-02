import api from './api';

export const getAllUsers = async () => {
    const response = await api.get('/user');
    return response.data;
};
