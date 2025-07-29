import React, { useState, useEffect } from 'react';  
import { useNavigate, useParams } from 'react-router-dom';  
import { InputText } from 'primereact/inputtext';  
import { InputTextarea } from 'primereact/inputtextarea';  
import { InputSwitch } from 'primereact/inputswitch';    
import { Toast } from 'primereact/toast';  
import Template from '../../components/layout/Template';  
import FormButtons from '../../components/common/FormButtons';  
import { rolesService } from '../../services/rolesService';  
import PickList from '../../components/common/PickList';
  
/**  
 * Componente RoleForm - Formulario de creación/edición de roles  
 * Equivalente a base/WEB/src/main/webapp/auth/administracion/roles/formulario.xhtml  
 *   
 * Funcionalidades principales:  
 * - Formulario para crear/editar roles  
 * - PickList para selección de funciones/menús  
 * - Validación de campos requeridos  
 * - Verificación de duplicidad de nombres  
 * - Integración con FormButtons para acciones  
 */  
const RoleForm = () => {  
  const navigate = useNavigate();  
  const { id } = useParams();  
  const toast = React.useRef(null);  
    
  // Estados equivalentes a ControllerCatRoles  
  const [isEditing, setIsEditing] = useState(false);  
  const [loading, setLoading] = useState(false);  
  const [originalName, setOriginalName] = useState('');  
    
  // Estado del formulario - equivalente a CatRoles nuevo  
  const [formData, setFormData] = useState({  
    nombre: '',  
    descripcion: '',  
    status: true  
  });  
    
  // Estado para el PickList - equivalente a DualListModel<CatMenus> listaMenus  
  const [availableMenus, setAvailableMenus] = useState([]);  
  const [selectedMenus, setSelectedMenus] = useState([]);  
    
  const [errors, setErrors] = useState({});  
  
  useEffect(() => {  
    if (id && id !== 'nuevo') {  
      setIsEditing(true);  
      loadRole(id);  
    } else {  
      setIsEditing(false);  
      loadAvailableMenus();  
    }  
  }, [id]);  
  
  /**  
   * Carga un rol para edición  
   * Equivalente a la lógica de edición en ControllerCatRoles.init() case 2  
   */  
  const loadRole = async (roleId) => {  
    try {  
      setLoading(true);  
      const response = await rolesService.findById(roleId);  
        
      if (response.success) {  
        const role = response.data;  
        setFormData({  
          nombre: role.nombre,  
          descripcion: role.descripcion,  
          status: role.status  
        });  
        setOriginalName(role.nombre);  
          
        // Cargar menús asignados al rol - equivalente a listaMenus.getTarget()  
        if (role.menusRolesList) {  
          const assignedMenus = role.menusRolesList.map(mr => mr.idMenu);  
          setSelectedMenus(assignedMenus);  
        }  
          
        loadAvailableMenus(role.menusRolesList?.map(mr => mr.idMenu.idMenu) || []);  
      } else {  
        showError(response.message);  
      }  
    } catch (error) {  
      console.error('Error cargando rol:', error);  
      showError('Error al cargar el rol');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  /**  
   * Carga menús disponibles para asignar  
   * Equivalente a buscarMenusDisponibles() de ControllerCatRoles  
   */  
  const loadAvailableMenus = async (excludedIds = []) => {  
    try {  
      let response;  
      if (excludedIds.length > 0) {  
        response = await rolesService.getAvailableMenusExcluding(excludedIds);  
      } else {  
        response = await rolesService.getAvailableMenus();  
      }  
        
      if (response.success) {  
        setAvailableMenus(response.data);  
      } else {  
        showError(response.message);  
      }  
    } catch (error) {  
      console.error('Error cargando menús:', error);  
      showError('Error al cargar menús disponibles');  
    }  
  };  
  
  const handleInputChange = (field, value) => {  
    setFormData(prev => ({ ...prev, [field]: value }));  
      
    // Limpiar error del campo  
    if (errors[field]) {  
      setErrors(prev => ({ ...prev, [field]: null }));  
    }  
  };  
  
  const validateForm = () => {  
    const newErrors = {};  
  
    if (!formData.nombre?.trim()) {  
      newErrors.nombre = 'El campo nombre es requerido';  
    }  
  
    if (selectedMenus.length === 0) {  
      newErrors.menus = 'Debe seleccionar al menos una función';  
    }  
  
    setErrors(newErrors);  
    return Object.keys(newErrors).length === 0;  
  };  
  
  /**  
   * Verifica duplicidad de nombre  
   * Equivalente a la lógica de verificaDuplicidad en ControllerCatRoles.guardar()  
   */  
  const checkDuplicateName = async () => {  
    if (isEditing && formData.nombre === originalName) {  
      return false; // No hay cambio en el nombre  
    }  
  
    try {  
      const response = await rolesService.checkDuplicate(  
        formData.nombre,   
        isEditing ? id : null  
      );  
      return response.isDuplicate;  
    } catch (error) {  
      console.error('Error verificando duplicidad:', error);  
      return false;  
    }  
  };  
  
  /**  
   * Maneja el guardado del rol  
   * Equivalente al método guardar() de ControllerCatRoles  
   */  
  const handleSave = async () => {  
    if (!validateForm()) {  
      return;  
    }  
  
    // Verificar duplicidad  
    const isDuplicate = await checkDuplicateName();  
    if (isDuplicate) {  
      showError(`Ya existe un registro con el identificador: ${formData.nombre}`);  
      return;  
    }  
  
    try {  
      setLoading(true);  
        
      // Preparar datos con menús seleccionados - equivalente a llenadoMenusRoles()  
      const roleData = {  
        ...formData,  
        menusRolesList: selectedMenus.map(menu => ({  
          idMenu: menu,  
          idRol: isEditing ? { idRol: parseInt(id) } : null  
        }))  
      };  
  
      let response;  
      if (isEditing) {  
        response = await rolesService.update(id, roleData);  
      } else {  
        response = await rolesService.create(roleData);  
      }  
  
      if (response.success) {  
        showSuccess(  
          isEditing ? 'Registro modificado correctamente' : 'Registro guardado correctamente'  
        );  
        setTimeout(() => navigate('/roles'), 1500);  
      } else {  
        showError(response.message);  
      }  
    } catch (error) {  
      console.error('Error guardando rol:', error);  
      showError('Error al guardar el rol');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  /**  
   * Maneja la cancelación  
   * Equivalente al método cancelar() de ControllerCatRoles  
   */  
  const handleCancel = () => {  
    navigate('/roles');  
  };  
  
  const showError = (message) => {  
    toast.current?.show({  
      severity: 'error',  
      summary: 'Error',  
      detail: message,  
      life: 8000  
    });  
  };  
  
  const showSuccess = (message) => {  
    toast.current?.show({  
      severity: 'success',  
      summary: 'Éxito',  
      detail: message,  
      life: 3000  
    });  
  };  
  
  /**  
   * Template para items del PickList  
   * Equivalente al template de p:column en el PickList original  
   */  
  const itemTemplate = (item) => {  
    return (  
      <div className="p-d-flex p-ai-center">  
        <span>{item.nombre}</span>  
      </div>  
    );  
  };  
  
  return (  
    <Template title={isEditing ? 'Modificar Rol' : 'Registrar Rol'}>  
      <Toast ref={toast} />  
        
      <div className="role-form-container">  
        <h2>{isEditing ? 'Modificar Rol' : 'Registrar Rol'}</h2>  
  
        {/* Formulario principal - equivalente a p:panelGrid del original */}  
        <div className="p-fluid">  
          <div className="p-grid">  
            {/* Campo Nombre - equivalente a líneas 27-29 del original */}  
            <div className="p-col-12 p-md-4">  
              <label htmlFor="nombre">Nombre:*</label>  
              <InputText  
                id="nombre"  
                value={formData.nombre}  
                onChange={(e) => handleInputChange('nombre', e.target.value)}  
                className={errors.nombre ? 'p-invalid' : ''}  
                disabled={loading}  
              />  
              {errors.nombre && (  
                <small className="p-error">{errors.nombre}</small>  
              )}  
            </div>  
  
            {/* Campo Descripción - equivalente a líneas 32-34 del original */}  
            <div className="p-col-12 p-md-4">  
              <label htmlFor="descripcion">Descripción:*</label>  
              <InputTextarea  
                id="descripcion"  
                value={formData.descripcion}  
                onChange={(e) => handleInputChange('descripcion', e.target.value)}  
                rows={5}  
                cols={50}  
                disabled={loading}  
              />  
            </div>  
  
            {/* Campo Estatus - equivalente a líneas 37-40 del original */}  
            <div className="p-col-12 p-md-4">  
              <label htmlFor="status">Estatus:</label>  
              <InputSwitch  
                id="status"  
                checked={formData.status}  
                onChange={(e) => handleInputChange('status', e.value)}  
                disabled={loading}  
              />  
            </div>  
          </div>  
  
          {/* PickList para Funciones - equivalente a líneas 46-70 del original */}  
          <div className="p-field">  
            <label>Funciones*</label>  
            <PickList  
              source={availableMenus}  
              target={selectedMenus}  
              onChange={(e) => {  
                setAvailableMenus(e.source);  
                setSelectedMenus(e.target);  
                // Limpiar error de menús  
                if (errors.menus && e.target.length > 0) {  
                  setErrors(prev => ({ ...prev, menus: null }));  
                }  
              }}  
              itemTemplate={itemTemplate}  
              sourceHeader="Disponibles"  
              targetHeader="Seleccionados"  
              sourceStyle={{ height: '300px' }}  
              targetStyle={{ height: '300px' }}  
              showSourceControls={true}  
              showTargetControls={true}  
              sourceFilterPlaceholder="Buscar funciones disponibles"  
              targetFilterPlaceholder="Buscar funciones seleccionadas"  
              disabled={loading}  
            />  
            {errors.menus && (  
              <small className="p-error">{errors.menus}</small>  
            )}  
          </div>  
  
          {/* Botones del formulario - equivalente a cmp:botonesFormulario */}  
          <FormButtons  
            onSave={handleSave}  
            onCancel={handleCancel}  
            isEditing={isEditing}  
            loading={loading}  
          />  
        </div>  
      </div>  
    </Template>  
  );  
};  
  
export default RoleForm;