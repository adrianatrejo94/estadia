import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import { userService } from '../../services/userService';      // Servicio que gestiona llamadas al backend
import { useAuth } from '../../context/AuthContext';           // Hook de autenticación para verificar permisos
import FormButtons from '../../components/common/FormButtons'; // Componente reutilizable para botones de acción

const UsuarioForm = () => {
  // Obtener el parámetro `id` desde la URL para saber si estamos en modo edición o creación
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth(); // Función que evalúa permisos por rol
  const toast = useRef(null);

  // Estado del formulario (campos del usuario)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    username: '',
    email: '',
    telefono: '',
    idRol: null,
    status: true
  });

  // Otros estados
  const [loading, setLoading] = useState(false);             // Para deshabilitar botones mientras se guarda
  const [roles, setRoles] = useState([]);                    // Catálogo de roles disponibles
  const [isEditing, setIsEditing] = useState(false);         // Determina si estamos editando
  const [showPasswordReset, setShowPasswordReset] = useState(false); // Mostrar botón de reset
  const [errors, setErrors] = useState({});                  // Errores de validación

  // Ejecutar cuando cambia el `id` de la URL
  useEffect(() => {
    initializeForm(); // Cargar usuario si aplica
    loadRoles();      // Cargar catálogo de roles
  }, [id]);

  // Carga el usuario si se va a editar
  const initializeForm = async () => {
    if (id && id !== 'new') {
      setIsEditing(true);
      setShowPasswordReset(true);
      try {
        const userData = await userService.getUserById(id);
        setFormData(userData);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        showError('Error al cargar los datos del usuario');
      }
    } else {
      setIsEditing(false);
      setShowPasswordReset(false);
      // Reiniciar formulario vacío
      setFormData({
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        username: '',
        email: '',
        telefono: '',
        idRol: null,
        status: true
      });
    }
  };

  // Cargar lista de roles desde la API
  const loadRoles = async () => {
    try {
      const rolesData = await userService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  // Autogenerar nombre de usuario a partir de nombre y apellido paterno
  const generateUsername = () => {
    if (formData.nombres && formData.apellidoPaterno) {
      const nombres = formData.nombres.split(' ');
      const username = `${nombres[0]}.${formData.apellidoPaterno}`;
      setFormData(prev => ({ ...prev, username }));
    }
  };

  // Controlador de cambios de campo
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar errores si el usuario vuelve a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Auto-generar username si cambia nombre o apellido
    if (field === 'nombres' || field === 'apellidoPaterno') {
      setTimeout(generateUsername, 100);
    }
  };

  // Validación de campos obligatorios
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres?.trim()) {
      newErrors.nombres = 'El campo nombres es requerido';
    }
    if (!formData.apellidoPaterno?.trim()) {
      newErrors.apellidoPaterno = 'El campo apellido paterno es requerido';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'El campo email es requerido';
    }
    if (!formData.telefono) {
      newErrors.telefono = 'El campo teléfono es requerido';
    }
    if (!formData.idRol) {
      newErrors.idRol = 'Debe seleccionar un rol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar o actualizar usuario
  const handleSave = async () => {
    if (!validateForm()) {
      showError('Por favor corrija los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await userService.updateUser(id, formData);
        showSuccess('Registro modificado correctamente');
      } else {
        await userService.createUser(formData);
        showSuccess('Registro guardado correctamente, se enviará un email con la contraseña temporal');
      }
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      showError(isEditing ? 'No se pudo modificar el registro' : 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  // Restablecer contraseña (solo en edición)
  const handlePasswordReset = () => {
    confirmDialog({
      message: '¿Esta acción no puede revertirse, ¿Está seguro de proceder?',
      header: 'Advertencia',
      icon: 'pi pi-info',
      accept: async () => {
        try {
          await userService.resetPassword(id);
          showSuccess('Se enviará una contraseña temporal cuando guarde los cambios');
        } catch (error) {
          console.error('Error al restablecer contraseña:', error);
          showError('Error al restablecer la contraseña');
        }
      }
    });
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  const showSuccess = (message) => {
    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: message });
  };

  const showError = (message) => {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: message });
  };

  // Verificar permisos antes de mostrar formulario
  if (!hasPermission('ROLE_ALTA_ROLES')) {
    return <div>No tienes permisos para acceder a esta sección.</div>;
  }

  // Render del formulario
  return (
    <div className="usuario-form-container">
      <Toast ref={toast} />
      <ConfirmDialog />

      <h2>{isEditing ? 'Modificar Usuario' : 'Registrar Usuario'}</h2>

      <div className="p-fluid p-formgrid p-grid">
        {/* Campos del formulario */}
        <div className="p-field p-col-12 p-md-3">
          <label htmlFor="nombres">Nombres: *</label>
          <InputText
            id="nombres"
            value={formData.nombres}
            onChange={(e) => handleInputChange('nombres', e.target.value)}
            className={errors.nombres ? 'p-invalid' : ''}
            onBlur={generateUsername}
          />
          {errors.nombres && <small className="p-error">{errors.nombres}</small>}
        </div>

        <div className="p-field p-col-12 p-md-3">
          <label htmlFor="apellidoPaterno">Apellido Paterno: *</label>
          <InputText
            id="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={(e) => handleInputChange('apellidoPaterno', e.target.value)}
            className={errors.apellidoPaterno ? 'p-invalid' : ''}
            onBlur={generateUsername}
          />
          {errors.apellidoPaterno && <small className="p-error">{errors.apellidoPaterno}</small>}
        </div>

        <div className="p-field p-col-12 p-md-3">
          <label htmlFor="apellidoMaterno">Apellido Materno:</label>
          <InputText
            id="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={(e) => handleInputChange('apellidoMaterno', e.target.value)}
          />
        </div>

        <div className="p-field p-col-12 p-md-3">
          <label htmlFor="username">Username: *</label>
          <InputText
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div className="p-field p-col-12 p-md-4">
          <label htmlFor="email">Email: *</label>
          <InputText
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'p-invalid' : ''}
          />
          {errors.email && <small className="p-error">{errors.email}</small>}
        </div>

        <div className="p-field p-col-12 p-md-4">
          <label htmlFor="telefono">Teléfono: *</label>
          <InputNumber
            id="telefono"
            value={formData.telefono}
            onValueChange={(e) => handleInputChange('telefono', e.value)}
            useGrouping={false}
            className={errors.telefono ? 'p-invalid' : ''}
          />
          {errors.telefono && <small className="p-error">{errors.telefono}</small>}
        </div>

        <div className="p-field p-col-12 p-md-4">
          <label htmlFor="rol">Rol: *</label>
          <Dropdown
            id="rol"
            value={formData.idRol}
            options={roles}
            onChange={(e) => handleInputChange('idRol', e.value)}
            optionLabel="nombre"
            placeholder="Seleccione un rol"
            filter
            filterBy="nombre"
            className={errors.idRol ? 'p-invalid' : ''}
          />
          {errors.idRol && <small className="p-error">{errors.idRol}</small>}
        </div>

        {/* Restablecer contraseña */}
        {showPasswordReset && (
          <div className="p-field p-col-12 p-md-6">
            <label style={{ fontSize: 'medium' }}>Reestablecer contraseña</label>
            <div>
              <Button
                label="Reestablecer"
                icon="pi pi-refresh"
                className="p-button-warning"
                onClick={handlePasswordReset}
                type="button"
              />
            </div>
          </div>
        )}

        <div className="p-field p-col-12 p-md-6">
          <label htmlFor="status">Estatus:</label>
          <div>
            <InputSwitch
              id="status"
              checked={formData.status}
              onChange={(e) => handleInputChange('status', e.value)}
            />
          </div>
        </div>
      </div>

      {/* Botones de acción: Guardar, Cancelar */}
      <FormButtons
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={isEditing}
        loading={loading}
        mostrarNuevo={false}
        mostrarGuardar={true}
        mostrarCancelar={true}
      />
    </div>
  );
};

export default UsuarioForm;
