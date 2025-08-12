import { apiClient } from './api';  
  
/**  
 * Servicio de roles  
 * Equivalente a la lógica de base/WEB/src/main/java/.../ControllerCatRoles.java  
 * Maneja todas las operaciones CRUD de roles y permisos  
 */  
export const rolesService = {  
  /**  
   * Obtiene todos los roles  
   * Equivalente al método buscar() de ControllerCatRoles  
   */  
  async findAll() {  
    try {  
      const response = await apiClient.get('/roles');  
      return {  
        success: true,  
        data: response.data || response,  
        message: 'Roles cargados correctamente'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.findAll:', error);  
      return {  
        success: false,  
        data: [],  
        message: error.message || 'Error al cargar los roles'  
      };  
    }  
  },  
  
  /**  
   * Obtiene un rol por ID  
   * Equivalente a la lógica de edición en ControllerCatRoles  
   */  
  async findById(id) {  
    try {  
      const response = await apiClient.get(`/roles/${id}`);  
      return {  
        success: true,  
        data: response.data || response,  
        message: 'Rol encontrado'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.findById:', error);  
      return {  
        success: false,  
        data: null,  
        message: error.message || 'Error al buscar el rol'  
      };  
    }  
  },  
  
  /**  
   * Crea un nuevo rol */  
  async create(rolData) {  
    try {  
      const response = await apiClient.post('/roles', rolData); 
      if (response.success !== undefined){
        return response;
      } 
      return {  
        success: true,  
        data: response.data || response,  
        message: 'Rol creado correctamente'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.create:', error);  
      return {  
        success: false,  
        data: null,  
        message: error.message || 'Error al crear el rol'  
      };  
    }  
  },  
  
  /**  
   * Actualiza un rol existente */  
  async update(id, rolData) {  
    try {  
      const response = await apiClient.put(`/roles/${id}`, rolData);  
      return {  
        success: true,  
        data: response.data || response,  
        message: 'Rol actualizado correctamente'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.update:', error);  
      return {  
        success: false,  
        data: null,  
        message: error.message || 'Error al actualizar el rol'  
      };  
    }  
  },  
  
  /**  
   * Elimina un rol */  
  async delete(id) {  
    try {  
      const response = await apiClient.delete(`/roles/${id}`);  
      return {  
        success: true,  
        data: response.data || response,  
        message: 'Rol eliminado correctamente'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.delete:', error);  
      return {  
        success: false,  
        data: null,  
        message: error.message || 'Error al eliminar el rol'  
      };  
    }  
  },  
  
  /**  
   * Obtiene todos los menús disponibles para asignar a roles  
   * Equivalente al método buscarTodosMenusDisponibles() del CatRolesRepository  
   */  
  async getAvailableMenus() {  
    try {  
      const response = await apiClient.get('/roles/menus/available');  
      return {  
        success: true,  
        data: response.data || response,  
        message: 'Menús disponibles cargados'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.getAvailableMenus:', error);  
      return {  
        success: false,  
        data: [],  
        message: error.message || 'Error al cargar menús disponibles'  
      };  
    }  
  },  
  
  /**  
   * Obtiene menús disponibles excluyendo los ya asignados  
   * Equivalente al método buscarMenusDisponibles(ids) del CatRolesRepository  
   */  
  async getAvailableMenusExcluding(excludedIds) {  
    try {  
      const response = await apiClient.post('/roles/menus/available-excluding', {  
        excludedIds: excludedIds || []  
      });  
      return {  
        success: true,  
        data: response.data || response,  
        message: 'Menús filtrados cargados'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.getAvailableMenusExcluding:', error);  
      return {  
        success: false,  
        data: [],  
        message: error.message || 'Error al cargar menús filtrados'  
      };  
    }  
  },  
  
  /**  
   * Verifica si existe duplicidad en el nombre del rol  
   * Equivalente a la lógica de verificaDuplicidad en ControllerCatRoles.guardar()  
   */  
  async checkDuplicate(nombre, excludeId = null) {  
    try {  
      const params = new URLSearchParams({ nombre });  
      if (excludeId) {  
        params.append('excludeId', excludeId);  
      }  
        
      const response = await apiClient.get(`/roles/check-duplicate?${params}`);  
      return {  
        success: true,  
        isDuplicate: response.isDuplicate || false,  
        message: response.message || 'Verificación completada'  
      };  
    } catch (error) {  
      console.error('Error en rolesService.checkDuplicate:', error);  
      return {  
        success: false,  
        isDuplicate: false,  
        message: error.message || 'Error al verificar duplicidad'  
      };  
    }  
  }  
};  
  
export default rolesService;