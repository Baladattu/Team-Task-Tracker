import api from './api';

export const getTasksByProject = async (projectId) => {
    const response = await api.get(`/task/project/${projectId}`);
    return response.data;
};

export const getTaskById = async (id) => {
    const response = await api.get(`/task/${id}`);
    console.log(response);
    return response.data;
}

export const createTask = async (taskData) => {
    const response = await api.post('/task', taskData);
    console.log(response);
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await api.put(`/task/${id}`, taskData);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/task/${id}`);
    return response.data;
};