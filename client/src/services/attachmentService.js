import api from './api';

export const getTaskAttachments = async (taskId) => {
    const response = await api.get(`/attachment/${taskId}`);
    console.log(response);
    return response.data;
};

export const uploadAttachment = async (formData) => {
    const response = await api.post('/attachment', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getDownloadUrl = async (id) => {
    const response = await api.get(`/attachment/download/${id}`);
    return response.data.downloadUrl;
};

export const deleteAttachment = async (id) => {
    const response = await api.delete(`/attachment/${id}`);
    return response.data;
};