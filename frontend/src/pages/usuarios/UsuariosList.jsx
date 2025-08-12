import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { InputText } from 'primereact/inputtext';  
import { Button } from 'primereact/button';  
import Template from '../../components/layout/Template';  
import { useAuth } from '../../context/AuthContext';  
import { userService } from '../../services/userService';  
import BotonesFormulario from '../../components/common/BotonesFormulario';  
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';  
  
/**        
 * Componente UsuariosList - Lista de usuarios del sistema        
 * Equivalente a base/WEB/src/main/webapp/auth/administracion/usuarios/bandeja.xhtml        
 */  
const UsuariosList = () => {  
  const navigate = useNavigate();  
  const { hasAnyPermission } = useAuth();  
  
  const [usuarios, setUsuarios] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [globalFilter, setGlobalFilter] = useState('');  
  
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
      window.showGlobalMessage({  
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
    navigate(`/usuarios/editar/${usuario.idUsuario}`);  
  };  
  
  const handleDeleteUser = (id) => {  
    confirmDialog({  
      message: '¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.',  
      header: 'Confirmar Eliminación',  
      icon: 'pi pi-exclamation-triangle',  
      accept: async () => {  
        try {  
          await userService.deleteUser(id);  
          loadUsuarios();  
          window.showGlobalMessage({  
            severity: 'success',  
            summary: 'Éxito',  
            detail: 'Usuario eliminado exitosamente'  
          });  
        } catch (error) {  
          console.error("Error al eliminar usuario:", error);  
          window.showGlobalMessage({  
            severity: 'error',  
            summary: 'Error',  
            detail: 'Error al eliminar el usuario'  
          });  
        }  
      }  
    });  
  };  
  
  // Filtrar usuarios basado en el filtro global      
  const filteredUsuarios = usuarios.filter(usuario =>  
    !globalFilter ||  
    usuario.nombres?.toLowerCase().includes(globalFilter.toLowerCase()) ||  
    usuario.apellidoPaterno?.toLowerCase().includes(globalFilter.toLowerCase()) ||  
    usuario.apellidoMaterno?.toLowerCase().includes(globalFilter.toLowerCase()) ||  
    usuario.username?.toLowerCase().includes(globalFilter.toLowerCase()) ||  
    (usuario.idRol?.nombre || usuario.rol?.nombre || '').toLowerCase().includes(globalFilter.toLowerCase()) ||  
    (usuario.status ? 'Activo' : 'Inactivo').toLowerCase().includes(globalFilter.toLowerCase())  
  );  
  
  return (  
    <Template title="Administración Usuarios">  
      <ConfirmDialog />  
      <div className="usuarios-list-container">  
        {/* Título igual al arquetipo */}  
        <h2>Administración Usuarios</h2>  
        <br />  
  
        {/* Botón Agregar Nuevo */}  
        {hasAnyPermission(['ROLE_ALTA_ROLES']) && (  
          <BotonesFormulario  
            onAdd={handleAddNew}  
            nombreBoton="Agregar Nuevo"  
            mostrarNuevo={true}  
            mostrarGuardar={false}  
            mostrarCancelar={false}  
          />  
        )}  
  
        {/* Tabla de usuarios con estructura del arquetipo */}  
        {hasAnyPermission(['ROLE_BUSQUEDA_ROLES', 'ROLE_EDICION_ROLES']) && (  
          <div className="ui-datatable ui-widget">  
            {/* Header con filtro global - igual al arquetipo */}  
            <div className="ui-datatable-header ui-widget-header ui-corner-top sinFondo">  
              <div id="filtroTablaTareasGenerales">  
                <InputText  
                  id="globalFilter"  
                  value={globalFilter}  
                  onChange={(e) => setGlobalFilter(e.target.value)}  
                  placeholder="Búsqueda global"  
                  style={{ width: '25%', marginLeft: '75%' }}  
                />  
              </div>  
            </div>  
  
            {/* Tabla */}  
            <table className="ui-datatable-data ui-widget-content" style={{ width: '100%' }}>  
              <thead className="ui-datatable-thead">  
                <tr>  
                  <th className="ui-state-default centrado">  
                    <span>Nombre</span>  
                  </th>  
                  <th className="ui-state-default centrado">  
                    <span>Usuario</span>  
                  </th>  
                  <th className="ui-state-default centrado">  
                    <span>Rol</span>  
                  </th>  
                  <th className="ui-state-default centrado">  
                    <span>Estatus</span>  
                  </th>  
                  <th className="ui-state-default centrado">  
                    <span>Modificar</span>  
                  </th>  
                </tr>  
              </thead>  
              <tbody className="ui-datatable-data ui-widget-content">  
                {loading ? (  
                  <tr>  
                    <td colSpan="5" className="centrado">Cargando...</td>  
                  </tr>  
                ) : filteredUsuarios.length === 0 ? (  
                  <tr>  
                    <td colSpan="5" className="centrado">No se encontraron usuarios</td>  
                  </tr>  
                ) : (  
                  filteredUsuarios.slice(0, 5).map((usuario, index) => (  
                    <tr key={usuario.id || index} className={index % 2 === 0 ? 'ui-widget-content ui-datatable-even' : 'ui-widget-content ui-datatable-odd'}>  
                      <td className="centrado">  
                        <span>{`${usuario.nombres || ''} ${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.trim()}</span>  
                      </td>  
                      <td className="centrado">  
                        <span>{usuario.username}</span>  
                      </td>  
                      <td className="centrado">  
                        <span>{usuario.idRol?.nombre || usuario.rol?.nombre || ''}</span>  
                      </td>  
                      <td className="centrado">  
                        <span>{usuario.status ? 'Activo' : 'Inactivo'}</span>  
                      </td>  
                      <td className="centrado">  
                        {hasAnyPermission(['ROLE_EDICION_ROLES']) && (  
                          <img  
                            src="src/assets/verona-layout/images/caems/editar.png"  
                            style={{ width: '40px', cursor: 'pointer', marginRight: '10px' }}  
                            title="editar"  
                            onClick={() => handleEdit(usuario)}  
                            alt="Editar"  
                          />  
                        )}  
                        {hasAnyPermission(['ROLE_EDICION_ROLES']) && (  
                          <img  
                            src="src/assets/verona-layout/images/caems/eliminar.png"  
                            style={{ width: '40px', cursor: 'pointer' }}  
                            title="eliminar"  
                            onClick={() => handleDeleteUser(usuario.idUsuario)}  
                            alt="Eliminar"  
                          />  
                        )}  
                      </td>  
                    </tr>  
                  ))  
                )}  
              </tbody>  
            </table>  
  
            {/* Paginador simple */}  
            {filteredUsuarios.length > 5 && (  
              <div className="ui-datatable-footer ui-widget-header ui-corner-bottom">  
                <div className="ui-paginator ui-paginator-bottom ui-widget-header ui-corner-all">  
                  <span className="ui-paginator-current">  
                    1-{Math.min(5, filteredUsuarios.length)} de {filteredUsuarios.length} registros  
                  </span>  
                </div>  
              </div>  
            )}  
          </div>  
        )}  
      </div>  
    </Template>  
  );  
};  
  
export default UsuariosList;