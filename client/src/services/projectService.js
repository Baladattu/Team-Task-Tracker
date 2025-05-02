import api from './api';

export const getAllProjects = async () => {
    const response = await api.get('/project');
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await api.get(`/project/${id}`);
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post('/project', projectData);
    return response.data;
};

export const updateProject = async (id, projectData) => {
    const response = await api.put(`/project/${id}`, projectData);
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(`/project/${id}`);
    return response.data;
};
