import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../../styles/ConfirmDialog.css';
import Template from '../../components/layout/Template';

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import BotonesFormulario from '../../components/common/BotonesFormulario';

const UsuarioForm = () => {
  // Obtener el parámetro `id` desde la URL para saber si estamos en modo edición o creación  
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission, hasAnyPermission } = useAuth(); // Función que evalúa permisos por rol  

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
  const [passwordResetPending, setPasswordResetPending] = useState(false); // NUEVO: Flag para reset pendiente  

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
        setFormData(userData.data);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        showError('Error al cargar los datos del usuario');
      }
    } else {
      setIsEditing(false);
      setShowPasswordReset(false);
      setPasswordResetPending(false); // NUEVO: Resetear flag  
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
      const response = await userService.getRoles();
      // Extraer solo el array de datos de la respuesta    
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setRoles([]); // Asegurar que siempre sea un array    
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
  const validateForm = async () => {
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
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
    }

    if (!formData.idRol) {
      newErrors.idRol = 'Debe seleccionar un rol';
    }

    // Validaciones de unicidad  
    if (formData.email?.trim()) {
      try {
        const emailCheck = await userService.checkEmailDuplicate(
          formData.email,
          isEditing ? id : null
        );
        if (emailCheck.isDuplicate) {
          newErrors.email = 'Este email ya está registrado por otro usuario';
        }
      } catch (error) {
        console.error('Error validando email:', error);
      }
    }

    if (formData.telefono && /^\d{10}$/.test(formData.telefono)) {
      try {
        const telefonoCheck = await userService.checkTelefonoDuplicate(
          formData.telefono,
          isEditing ? id : null
        );
        if (telefonoCheck.isDuplicate) {
          newErrors.telefono = 'Este teléfono ya está registrado';
        }
      } catch (error) {
        console.error('Error validando teléfono:', error);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // MODIFICADO: Guardar o actualizar usuario con lógica de reset pendiente  
  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      showError('Por favor corrija los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await userService.updateUser(id, formData);

        // Ejecutar reset de contraseña si está pendiente  
        if (passwordResetPending) {
          await userService.resetPassword(id);
          showSuccess('Usuario modificado y contraseña restablecida correctamente');
        } else {
          showSuccess('Registro modificado correctamente');
        }
      } else {
        await userService.createUser(formData);
        showSuccess('Registro guardado correctamente, se enviará un email con la contraseña temporal');
      }
      setTimeout(() => {
        navigate('/usuarios');
      }, 1000);

    } catch (error) {
      console.error('Error al guardar usuario:', error);
      showError(isEditing ? 'No se pudo modificar el registro' : 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  // MODIFICADO: Restablecer contraseña (solo marca el flag, no ejecuta inmediatamente)  
  const handlePasswordReset = () => {
    confirmDialog({
      message: '¿Está seguro de restablecer la contraseña? Se aplicará cuando guarde los cambios.',
      header: 'Advertencia',
      icon: 'pi pi-info',
      accept: () => {
        setPasswordResetPending(true);
        showSuccess('La contraseña se restablecerá cuando guarde los cambios');
      }
    });
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  const showSuccess = (message) => {
    window.showGlobalMessage({
      severity: 'success',
      summary: 'Éxito',
      detail: message
    });
  };

  const showError = (message) => {
    window.showGlobalMessage({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  };

  // Verificar permisos antes de mostrar formulario  
  if (!hasPermission('ROLE_ALTA_ROLES')) {
    return <div>No tienes permisos para acceder a esta sección.</div>;
  }

  // Render del formulario  
  return (
    <Template title={isEditing ? 'Modificar Usuario' : 'Registrar Usuario'}>
      <ConfirmDialog />

      <div className="card">

        <h2>{isEditing ? 'Modificar Usuario' : 'Registrar Usuario'}</h2>

        {/* Estructura exacta del arquetipo: panelGrid con 4 columnas */}
        <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>

          {/* Primera fila: 4 campos como en el arquetipo */}
          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="nombres">nombres:*</label>
            <InputText
              id="nombres"
              value={formData.nombres}
              onChange={(e) => handleInputChange('nombres', e.target.value)}
              className={errors.nombres ? 'p-invalid' : ''}
              onBlur={generateUsername}
              required
            />
            {errors.nombres && <small className="p-error">{errors.nombres}</small>}
          </div>

          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="apellidoPaterno">Apelido paterno:*</label>
            <InputText
              id="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={(e) => handleInputChange('apellidoPaterno', e.target.value)}
              className={errors.apellidoPaterno ? 'p-invalid' : ''}
              onBlur={generateUsername}
              required
            />
            {errors.apellidoPaterno && <small className="p-error">{errors.apellidoPaterno}</small>}
          </div>

          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="apellidoMaterno">Apelido materno*</label>
            <InputText
              id="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={(e) => handleInputChange('apellidoMaterno', e.target.value)}
            />
          </div>

          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="username">Username*</label>
            <InputText
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>

          {/* Segunda fila: email, teléfono, rol */}
          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="email">email*</label>
            <InputText
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'p-invalid' : ''}
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="telefono">telefono*</label>
            <InputNumber
              id="telefono"
              value={formData.telefono}
              onValueChange={(e) => handleInputChange('telefono', e.value?.toString() || '')}
              className={errors.telefono ? 'p-invalid' : ''}
              useGrouping={false}
              maxLength={10}
            />
            {errors.telefono && <small className="p-error">{errors.telefono}</small>}
          </div>


          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="rol">Rol*:</label>
            <Dropdown
              id="rol"
              value={formData.idRol}
              options={roles}
              onChange={(e) => handleInputChange('idRol', e.value)}
              optionLabel="nombre"
              optionValue="idRol"
              placeholder="Seleccione un rol"
              filter
              filterMatchMode="startsWith"
              className={errors.idRol ? 'p-invalid' : ''}
              required
            />
            {errors.idRol && <small className="p-error">{errors.idRol}</small>}
          </div>

          {/* Cuarta columna vacía en segunda fila */}
          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
          </div>

          {/* Tercera fila: Restablecer contraseña */}
          {showPasswordReset && (
            <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
              <label style={{ fontSize: 'medium' }}>
                Reestablecer contraseña
                {passwordResetPending && <span style={{ color: 'orange', marginLeft: '10px' }}>(Pendiente)</span>}
              </label>
              <Button
                label={passwordResetPending ? "Marcado para restablecer" : "Reestablecer"}
                onClick={handlePasswordReset}
                type="button"
                className={passwordResetPending ? "p-button-success" : "p-button-warning"}
                disabled={passwordResetPending}
              />
            </div>
          )}

          {/* Cuarta fila: Status */}
          <div className="ui-panelgrid ui-panelgrid-blank ui-g sinBordes">
            <label htmlFor="status">Estatus:</label>
            <InputSwitch
              id="status"
              checked={formData.status}
              onChange={(e) => handleInputChange('status', e.value)}
            />
          </div>
        </div>

        {/* Botones usando el componente equivalente a cmp:botonesFormulario */}
        <BotonesFormulario
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={isEditing}
          loading={loading}
          mostrarNuevo={false}
          mostrarGuardar={true}
          mostrarCancelar={true}
        />
      </div>
    </Template>

  );
};

export default UsuarioForm