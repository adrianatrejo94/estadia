import { apiClient } from './api';  
  
export const userService = {  
  // Equivalente a buscar() - línea 182-184  
  getAllUsers: async (page = 0, size = 5) => {  
    return await apiClient.get(`/usuarios?page=${page}&size=${size}`);  
  },  
  
  // Equivalente a guardar() - líneas 126-157  
  createUser: async (userData) => {  
    return await apiClient.post('/usuarios', userData);  
  },  
  
  // Equivalente a actualizar() - líneas 160-174  
  updateUser: async (id, userData) => {  
    return await apiClient.put(`/usuarios/${id}`, userData);  
  },  
  
  // Equivalente a cambiaPaginaEdicion() - líneas 192-196  
  getUserById: async (id) => {  
    return await apiClient.get(`/usuarios/${id}`);  
  },  
  
  // Equivalente a buscarRoles() - líneas 83-85  
  getRoles: async () => {  
    return await apiClient.get('/roles');  
  },  
  
  // Equivalente a reestablecer() - líneas 95-103  
  resetPassword: async (userId) => {  
    return await apiClient.post(`/usuarios/${userId}/reset-password`);  
  },  
  
  // Función para eliminar usuario (no existe en el Java pero es común en CRUD)  
  deleteUser: async (id) => {  
    return await apiClient.delete(`/usuarios/${id}`);  
  }  
};