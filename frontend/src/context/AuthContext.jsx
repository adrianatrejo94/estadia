import React, { createContext, useContext, useState, useEffect } from 'react';  
import { authService } from '../services/authService';  
  
// Crear el contexto de autenticación  
const AuthContext = createContext();  
  
// Hook personalizado para usar el contexto de autenticación  
export const useAuth = () => {  
  const context = useContext(AuthContext);  
  if (!context) {  
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');  
  }  
  return context;  
};  
  
// Proveedor del contexto de autenticación  
export const AuthProvider = ({ children }) => {  
  const [user, setUser] = useState(null);  
  const [userPermissions, setUserPermissions] = useState([]);  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [loading, setLoading] = useState(true);  
  const [language, setLanguage] = useState('es_MX'); // Equivalente a idioma en AdministradorPaginas  
  
  // Inicializar el contexto al cargar la aplicación  
  useEffect(() => {  
    initializeAuth();  
  }, []);  
  
  const initializeAuth = async () => {  
    try {  
      const token = localStorage.getItem('authToken');  
      if (token) {  
        // Verificar si el token es válido y obtener información del usuario  
        const userData = await authService.verifyToken();  
        if (userData) {  
          setUser(userData);  
          setUserPermissions(extractPermissions(userData.idRol));  
          setIsAuthenticated(true);  
        } else {  
          // Token inválido, limpiar localStorage  
          localStorage.removeItem('authToken');  
        }  
      }  
    } catch (error) {  
      console.error('Error al inicializar autenticación:', error);  
      localStorage.removeItem('authToken');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Extraer permisos del rol del usuario - equivalente a obtenerGrantedAuthorityDeFuncionalidad  
  const extractPermissions = (role) => {  
    if (!role || !role.menusRolesList) return [];  
      
    return role.menusRolesList.map(menuRole => menuRole.idMenu.springSecurity);  
  };  
  
  // Función de login - equivalente a entrar() en ControllerLogin  
  const login = async (credentials) => {  
    try {  
      setLoading(true);  
      const response = await authService.login(credentials);  
        
      if (response.user && response.token) {  
        // Verificar que el usuario esté activo  
        if (!response.user.status) {  
          throw new Error('Usuario inactivo');  
        }  
          
        // Verificar que el rol esté activo  
        if (!response.user.idRol.status) {  
          throw new Error('Perfil inactivo');  
        }  
  
        // Guardar token en localStorage  
        localStorage.setItem('authToken', response.token);  
          
        // Establecer estado de autenticación  
        setUser(response.user);  
        setUserPermissions(extractPermissions(response.user.idRol));  
        setIsAuthenticated(true);  
          
        return { success: true };  
      } else {  
        throw new Error('Credenciales incorrectas');  
      }  
    } catch (error) {  
      console.error('Error en login:', error);  
      return {   
        success: false,   
        message: error.message || 'Error de autenticación'   
      };  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Función de logout - equivalente a salir() en ControllerLogin  
  const logout = async () => {  
    try {  
      await authService.logout();  
    } catch (error) {  
      console.error('Error al hacer logout:', error);  
    } finally {  
      // Limpiar estado local independientemente del resultado  
      localStorage.removeItem('authToken');  
      setUser(null);  
      setUserPermissions([]);  
      setIsAuthenticated(false);  
    }  
  };  
  
  // Cambiar idioma - equivalente a changeLang en AdministradorPaginas  
  const changeLanguage = (newLanguage) => {  
    setLanguage(newLanguage);  
    localStorage.setItem('userLanguage', newLanguage);  
    // Aquí podrías recargar los recursos de idioma si es necesario  
  };  
  
  // Verificar si el usuario tiene un permiso específico  
  const hasPermission = (permission) => {  
    return userPermissions.includes(permission);  
  };  
  
  // Verificar si el usuario tiene alguno de los permisos especificados  
  const hasAnyPermission = (permissions) => {  
    return permissions.some(permission => userPermissions.includes(permission));  
  };  
  
  // Verificar si el usuario tiene todos los permisos especificados  
  const hasAllPermissions = (permissions) => {  
    return permissions.every(permission => userPermissions.includes(permission));  
  };  
  
  // Actualizar contraseña - equivalente a actualizaContrasena en ControllerLogin  
  const updatePassword = async (newPassword) => {  
    try {  
      const result = await authService.updatePassword(newPassword);  
      if (result.success) {  
        // Actualizar el flag de primer inicio  
        setUser(prevUser => ({  
          ...prevUser,  
          primerInicio: false  
        }));  
      }  
      return result;  
    } catch (error) {  
      console.error('Error al actualizar contraseña:', error);  
      return { success: false, message: 'Error al actualizar contraseña' };  
    }  
  };  
  
  // Verificar si es el primer inicio del usuario  
  const isFirstLogin = () => {  
    return user?.primerInicio || false;  
  };  
  
  // Obtener nombre completo del usuario  
  const getUserFullName = () => {  
    if (!user) return '';  
    return `${user.nombres} ${user.apellidoPaterno} ${user.apellidoMaterno}`.trim();  
  };  
  
  // Obtener nombre del rol del usuario  
  const getUserRole = () => {  
    return user?.idRol?.nombre || '';  
  };  
  
  const value = {  
    // Estado  
    user,  
    userPermissions,  
    isAuthenticated,  
    loading,  
    language,  
      
    // Funciones de autenticación  
    login,  
    logout,  
    updatePassword,  
      
    // Funciones de permisos  
    hasPermission,  
    hasAnyPermission,  
    hasAllPermissions,  
      
    // Funciones de utilidad  
    changeLanguage,  
    isFirstLogin,  
    getUserFullName,  
    getUserRole,  
  };  
  
  return (  
    <AuthContext.Provider value={value}>  
      {children}  
    </AuthContext.Provider>  
  );  
};  
  
export { AuthContext };