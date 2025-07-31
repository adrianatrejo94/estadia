// frontend/src/services/authService.js  
import api from './api';

/**  
 * Servicio de autenticación  
 * Equivalente a la lógica de base/WEB/src/main/java/.../ControllerLogin.java  
 */
export const authService = {
  /**  
   * Realiza el login del usuario  
   * Equivalente a la lógica de ControllerLogin.entrar()  
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        // Guardar token y datos del usuario  
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error en authService.login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  /**  
   * Cierra la sesión del usuario  
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales  
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  /**  
   * Verifica si el usuario está autenticado  
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },


  /**  
 * Verifica si el token actual es válido  
 */
  async verifyToken() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const response = await api.get('/auth/verify');
      return response.data.user;
    } catch (error) {
      console.error('Error verificando token:', error);
      return null;
    }
  },

  /**  
   * Obtiene el usuario actual  
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};