import api from './api';

export const getTaskComments = async (taskId) => {
    const response = await api.get(`/comment/${taskId}`);
    return response.data;
};

export const createComment = async (commentData) => {
    const response = await api.post('/comment', commentData);
    return response.data;
};

export const deleteComment = async (id) => {
    const response = await api.delete(`/comment/${id}`);
    return response.data;
};