import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import Template from '../../components/layout/Template';
import BotonesFormulario from '../../components/common/BotonesFormulario';
import { rolesService } from '../../services/rolesService';
import '../../styles/RoleForm.css';


/**  
 * Componente RoleForm - Formulario de creación/edición de roles  
 */
const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  

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

  // Estado para las listas de menús  
  const [availableMenus, setAvailableMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);

  // Filtros para búsqueda  
  const [availableFilter, setAvailableFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

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

        // Cargar menús asignados al rol  
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

  // Funciones para mover elementos entre listas  
  const moveToAssigned = () => {
    if (selectedAvailable.length === 0) return;

    const newAssigned = [...selectedMenus, ...selectedAvailable];
    const newAvailable = availableMenus.filter(menu =>
      !selectedAvailable.some(selected => selected.idMenu === menu.idMenu)
    );

    setSelectedMenus(newAssigned);
    setAvailableMenus(newAvailable);
    setSelectedAvailable([]);

    // Limpiar error de menús si hay elementos seleccionados  
    if (errors.menus && newAssigned.length > 0) {
      setErrors(prev => ({ ...prev, menus: null }));
    }
  };

  const moveToAvailable = () => {
    if (selectedAssigned.length === 0) return;

    const newAvailable = [...availableMenus, ...selectedAssigned];
    const newAssigned = selectedMenus.filter(menu =>
      !selectedAssigned.some(selected => selected.idMenu === menu.idMenu)
    );

    setAvailableMenus(newAvailable);
    setSelectedMenus(newAssigned);
    setSelectedAssigned([]);
  };

  const moveAllToAssigned = () => {
    const newAssigned = [...selectedMenus, ...availableMenus];
    setSelectedMenus(newAssigned);
    setAvailableMenus([]);
    setSelectedAvailable([]);

    if (errors.menus) {
      setErrors(prev => ({ ...prev, menus: null }));
    }
  };

  const moveAllToAvailable = () => {
    const newAvailable = [...availableMenus, ...selectedMenus];
    setAvailableMenus(newAvailable);
    setSelectedMenus([]);
    setSelectedAssigned([]);
  };

  // Filtrar listas  
  const getFilteredAvailable = () => {
    if (!availableFilter) return availableMenus;
    return availableMenus.filter(menu =>
      menu.nombre.toLowerCase().includes(availableFilter.toLowerCase())
    );
  };

  const getFilteredAssigned = () => {
    if (!assignedFilter) return selectedMenus;
    return selectedMenus.filter(menu =>
      menu.nombre.toLowerCase().includes(assignedFilter.toLowerCase())
    );
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
   */
  const checkDuplicateName = async () => {
    if (isEditing && formData.nombre === originalName) {
      return false;
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
   */
  const handleSave = async () => {
    console.log('=== INICIO handleSave ===');
    console.log('formData:', formData);
    console.log('selectedMenus:', selectedMenus);
    console.log('selectedMenus.length:', selectedMenus.length);

    if (!validateForm()) {
      console.log('=== VALIDACIÓN FALLÓ ===');
      console.log('errors:', errors);
      return;
    }
    console.log('=== VALIDACIÓN PASÓ ===');


    try {
      setLoading(true);

      // Preparar datos con menús seleccionados  
      const roleData = {
        ...formData,
        menusRolesList: selectedMenus.map(menu => ({
          idMenu: menu.idMenu || menu,
          ///idRol: isEditing ? parseInt(id) : null
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

        setTimeout(() => navigate('/roles'), 1000);
      } else {
        showError(response.message || 'Error al procesar la solicitud');
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
   */
  const handleCancel = () => {
    navigate('/roles');
  };

  const showError = (message) => {
    window.showGlobalMessage({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 8000,
    });
  };

  const showSuccess = (message) => {
    window.showGlobalMessage({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 5000,
    });
  };

  /**  
   * Template para items de las listas  
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

      <div className="role-form-container">
        <h2>{isEditing ? 'Modificar Rol' : 'Registrar Rol'}</h2>

        {/* Formulario principal */}
        <div className="p-fluid">
          <div className="p-grid">
            {/* Campo Nombre */}
            <div className="p-col-12 p-md-6">
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

            {/* Campo Descripción */}
            <div className="p-col-12 p-md-6">
              <label htmlFor="descripcion">Descripción:</label>
              <InputTextarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Campo Estatus */}
            <div className="p-col-12 p-md-6">
              <label htmlFor="status">Estatus:</label>
              <InputSwitch
                id="status"
                checked={formData.status}
                onChange={(e) => handleInputChange('status', e.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Sección de Asignación de Funciones */}
          <div className="functions-section">
            <label>Funciones*</label>
            {errors.menus && (
              <small className="p-error" style={{ display: 'block', marginBottom: '0.5rem' }}>
                {errors.menus}
              </small>
            )}

            <div className="functions-grid">
              {/* Lista de Funciones Disponibles */}
              <div className="list-container">
                <h4>Disponibles</h4>
                <InputText
                  placeholder="Buscar funciones disponibles..."
                  value={availableFilter}
                  onChange={(e) => setAvailableFilter(e.target.value)}
                />
                <ListBox
                  value={selectedAvailable}
                  options={getFilteredAvailable()}
                  onChange={(e) => setSelectedAvailable(e.value)}
                  optionLabel="nombre"
                  itemTemplate={itemTemplate}
                  multiple
                  disabled={loading}
                />
              </div>

              {/* Botones de Control */}
              <div className="control-buttons">
                <Button
                  icon="pi pi-angle-right"
                  onClick={moveToAssigned}
                  disabled={selectedAvailable.length === 0 || loading}
                  tooltip="Mover seleccionados"
                />
                <Button
                  icon="pi pi-angle-double-right"
                  onClick={moveAllToAssigned}
                  disabled={availableMenus.length === 0 || loading}
                  tooltip="Mover todos"
                />
                <Button
                  icon="pi pi-angle-left"
                  onClick={moveToAvailable}
                  disabled={selectedAssigned.length === 0 || loading}
                  tooltip="Quitar seleccionados"
                />
                <Button
                  icon="pi pi-angle-double-left"
                  onClick={moveAllToAvailable}
                  disabled={selectedMenus.length === 0 || loading}
                  tooltip="Quitar todos"
                />
              </div>

              {/* Lista de Funciones Seleccionadas */}
              <div className="list-container">
                <h4>Seleccionados</h4>
                <InputText
                  placeholder="Buscar funciones seleccionadas..."
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                />
                <ListBox
                  value={selectedAssigned}
                  options={getFilteredAssigned()}
                  onChange={(e) => setSelectedAssigned(e.value)}
                  optionLabel="nombre"
                  itemTemplate={itemTemplate}
                  multiple
                  disabled={loading}
                />
              </div>
            </div>
          </div>



          {/* Botones del formulario */}
          <BotonesFormulario
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