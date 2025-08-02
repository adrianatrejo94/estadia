import React, { useState, useEffect } from 'react';    
import { useNavigate } from 'react-router-dom';    
import { Toast } from 'primereact/toast';    
import Template from '../../components/layout/Template';    
import DataTable from '../../components/common/DataTable';  
import BotonesFormulario from '../../components/common/BotonesFormulario';  
import { useAuth } from '../../context/AuthContext';    
import { userService } from '../../services/userService'; 
 
  
/**    
 * Componente UsuariosList - Lista de usuarios del sistema    
 * Equivalente a base/WEB/src/main/webapp/auth/administracion/usuarios/bandeja.xhtml    
 */    
const UsuariosList = () => {    
  const navigate = useNavigate();    
  const { hasAnyPermission } = useAuth();    
  const toast = React.useRef(null);    
      
  const [usuarios, setUsuarios] = useState([]);    
  const [loading, setLoading] = useState(true);    
    
  useEffect(() => {    
    loadUsuarios();    
  }, []);    
    
  const loadUsuarios = async () => {    
    try {    
      setLoading(true);  
      const response = await userService.getAllUsers(0, 5);  
      if (response.data) {  
        setUsuarios(response.data);  
      }  
    } catch (error) {    
      console.error('Error cargando usuarios:', error);    
      toast.current?.show({    
        severity: 'error',    
        summary: 'Error',    
        detail: 'Error al cargar los usuarios'    
      });    
    } finally {    
      setLoading(false);    
    }    
  };    
    
  const handleAddNew = () => {    
    navigate('/usuarios/nuevo');    
  };    
    
  const handleEdit = (usuario) => {    
    navigate(`/usuarios/editar/${usuario.id}`);    
  };    
  
  // Template para nombre completo - igual al arquetipo  
  const nombreBodyTemplate = (rowData) => {    
    return (    
      <span className="centrado">    
        {`${rowData.nombres || ''} ${rowData.apellidoPaterno || ''} ${rowData.apellidoMaterno || ''}`.trim()}  
      </span>    
    );    
  };  
  
  // Template para rol - igual al arquetipo  
  const rolBodyTemplate = (rowData) => {    
    return (    
      <span className="centrado">    
        {rowData.idRol?.nombre || rowData.rol?.nombre || ''}  
      </span>    
    );    
  };  
  
  const statusBodyTemplate = (rowData) => {    
    return (    
      <span className="centrado">    
        {rowData.status ? 'Activo' : 'Inactivo'}    
      </span>    
    );    
  };    
    
  const actionBodyTemplate = (rowData) => {    
    return (  
      <div className="centrado">  
        <img   
          src="src/assets/verona-layout/images/caems/editar.png"  
          style={{ width: '30px', cursor: 'pointer' }}  
          title="editar"  
          onClick={() => handleEdit(rowData)}  
          alt="Editar"  
        />  
      </div>  
    );  
  };    
  
  // Definir columnas siguiendo exactamente la estructura del arquetipo  
  const columns = [  
    {   
      field: "nombres",   
      header: "Nombre",  
      className: "centrado",  
      body: nombreBodyTemplate,  
      filterBy: "nombres"  
    },  
    {   
      field: "username",   
      header: "Usuario",  
      className: "centrado",  
      filterBy: "username"  
    },  
    {   
      field: "rol",   
      header: "Rol",  
      className: "centrado",  
      body: rolBodyTemplate,  
      filterBy: "rol"  
    },  
    {   
      field: "status",   
      header: "Estatus",  
      className: "centrado",  
      body: statusBodyTemplate,  
      filterBy: "status"  
    },  
    {   
      header: "Modificar",  
      className: "centrado",  
      body: actionBodyTemplate,  
      sortable: false  
    }  
  ];  
    
  return (    
    <Template title="Administración Usuarios">    
      <Toast ref={toast} />    
          
      <div className="usuarios-list-container">    
        {/* Título igual al arquetipo */}  
        <h2>Administración Usuarios</h2>  
        <br/>  
  
        {/* Botón Agregar Nuevo usando el componente personalizado - equivalente a cmp:botonAgregarNuevo */}  
        <div style={{ marginBottom: '1rem' }}>  
          <BotonesFormulario  
            onAdd={handleAddNew}  
            nombreBoton="Agregar Nuevo"  
            mostrarNuevo={true}  
            mostrarGuardar={false}  
            mostrarCancelar={false}  
          />  
        </div>  
  
        {/* Tabla usando el componente personalizado con configuración del arquetipo */}  
        <DataTable  
          data={usuarios}  
          columns={columns}  
          loading={loading}  
          paginator={true}  
          rows={5}  
          globalFilter={true}  
          sortable={true}  
          reflow={true}  
          emptyMessage="No se encontraron usuarios"  
          className="ui-datatable-striped"  
        />  
      </div>    
    </Template>    
  );    
};    
    
export default UsuariosList;