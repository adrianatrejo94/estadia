// frontend/src/services/api.js
import axios from 'axios';

/**
 * Cliente HTTP centralizado (reemplaza a GeneraPeticionRest.java)
 * - Agrega el token automáticamente
 * - Aplica lógica de reintentos
 * - Muestra logs de URL y respuesta
 * - Maneja errores de forma consistente
 */

// Usa la variable de entorno de Vite para configurar la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: agrega token y log de URL
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log similar a GeneraPeticionRest.java
    console.log('############### url de envío:', config.url);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejo de errores + retry
api.interceptors.response.use(
  (response) => {
    console.log('############### json de respuesta:', response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry logic (hasta 3 intentos)
    if (!originalRequest._retry && (originalRequest._retryCount || 0) < 3) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      console.log('############### intento de envío:', originalRequest._retryCount);
      console.log('############### url:', originalRequest.url);

      await new Promise(resolve => setTimeout(resolve, 1000));
      return api(originalRequest);
    }

    // Si el error es 401 → limpiar sesión y redirigir
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Métodos HTTP estándar que puedes usar en tus servicios
export const apiClient = {
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  post: async (url, data, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  put: async (url, data, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
};

// Formateo estándar de errores para mostrar mensajes útiles
const formatError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Error del servidor',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      message: 'Error de conexión',
      status: 0,
      data: null,
    };
  } else {
    return {
      message: error.message || 'Error desconocido',
      status: -1,
      data: null,
    };
  }
};

export default api;
