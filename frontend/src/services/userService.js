import { apiClient } from './api';  
  
export const userService = {  
  // Equivalente a buscar() - línea 182-184  
  getAllUsers: async (page = 0, size = 5) => {  
    return await apiClient.get(`/usuarios?page=${page}&size=${size}`);  
  },  
  
  // Equivalente a guardar()  
  createUser: async (userData) => {  
    return await apiClient.post('/usuarios', userData);  
  },  
  
  // Equivalente a actualizar()  
  updateUser: async (id, userData) => {  
    return await apiClient.put(`/usuarios/${id}`, userData);  
  },  
  
  // Equivalente a cambiaPaginaEdicion() 
  getUserById: async (id) => {  
    return await apiClient.get(`/usuarios/${id}`);  
  },  
  
  // Equivalente a buscarRoles()   
  getRoles: async () => {  
    return await apiClient.get('/usuarios/roles/available');  
  },  
  
  // Equivalente a reestablecer()   
  resetPassword: async (userId) => {  
    return await apiClient.put(`/usuarios/${userId}/reset-password`);  
  },  
  
  // Función para eliminar usuario   
  deleteUser: async (id) => {  
    return await apiClient.delete(`/usuarios/${id}`);  
  }  
};