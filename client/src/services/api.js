import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getProfile       = (id)              => api.get(`/profile/${id}`);
export const createProfile    = (data)            => api.post(`/profile`, data);
export const updateProfile    = (id, data)        => api.put(`/profile/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateSocialLinksAPI = (profileId, payload) => api.patch(`/profile/${profileId}/social-links`, payload);
export const generateAIBio    = (id)              => api.post(`/profile/${id}/generate-bio`);

export const addExperience    = (id, data)        => api.post(`/profile/${id}/experience`, data);
export const updateExperience = (id, xId, data)   => api.put(`/profile/${id}/experience/${xId}`, data);
export const deleteExperience = (id, xId)         => api.delete(`/profile/${id}/experience/${xId}`);

export const addEducation     = (id, data)        => api.post(`/profile/${id}/education`, data);
export const updateEducation  = (id, eId, data)   => api.put(`/profile/${id}/education/${eId}`, data);
export const deleteEducation  = (id, eId)         => api.delete(`/profile/${id}/education/${eId}`);

export const addSkill         = (id, data)        => api.post(`/profile/${id}/skills`, data);
export const deleteSkill      = (id, sId)         => api.delete(`/profile/${id}/skills/${sId}`);
export const endorseSkill     = (id, sId, data)   => api.post(`/profile/${id}/skills/${sId}/endorse`, data);

export const addCertification    = (id, data)        => api.post(`/profile/${id}/certifications`, data);
export const updateCertification = (id, cId, data)   => api.put(`/profile/${id}/certifications/${cId}`, data);
export const deleteCertification = (id, cId)         => api.delete(`/profile/${id}/certifications/${cId}`);

export default api;