import React, { useState, useEffect, useMemo } from 'react';      
import { useNavigate } from 'react-router-dom';      
import { InputText } from 'primereact/inputtext';      
import { Button } from 'primereact/button';      
import Template from '../../components/layout/Template';      
import { useAuth } from '../../context/AuthContext';      
import { userService } from '../../services/userService';      
import BotonesFormulario from '../../components/common/BotonesFormulario';      
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';  
import Paginator from '../../components/common/Paginator';  
import { usePagination } from '../../hooks/usePagination';  
    
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
      // Cambiar para cargar todos los usuarios, no solo 5    
      const response = await userService.getAllUsers(0, 100); // o sin límite si el API lo permite    
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
  const filteredUsuarios = useMemo(() => {    
    return usuarios.filter(usuario =>      
      !globalFilter ||      
      usuario.nombres?.toLowerCase().includes(globalFilter.toLowerCase()) ||      
      usuario.apellidoPaterno?.toLowerCase().includes(globalFilter.toLowerCase()) ||      
      usuario.apellidoMaterno?.toLowerCase().includes(globalFilter.toLowerCase()) ||      
      usuario.username?.toLowerCase().includes(globalFilter.toLowerCase()) ||      
      (usuario.idRol?.nombre || usuario.rol?.nombre || '').toLowerCase().includes(globalFilter.toLowerCase()) ||      
      (usuario.status ? 'Activo' : 'Inactivo').toLowerCase().includes(globalFilter.toLowerCase())      
    );    
  }, [usuarios, globalFilter]);    
  
  // Usar el hook de paginación  
  const {  
    currentPage,  
    rows,  
    paginatedData: paginatedUsuarios,  
    handlePageChange,  
    handleRowsChange  
  } = usePagination(filteredUsuarios);  
      
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
                ) : paginatedUsuarios.length === 0 ? (      
                  <tr>      
                    <td colSpan="5" className="centrado">No se encontraron usuarios</td>      
                  </tr>      
                ) : (      
                  paginatedUsuarios.map((usuario, index) => (      
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
      
            {/* Paginador reutilizable */}  
            <Paginator  
              data={filteredUsuarios}  
              currentPage={currentPage}  
              rows={rows}  
              onPageChange={handlePageChange}  
              onRowsChange={handleRowsChange}  
            />  
          </div>      
        )}      
      </div>      
    </Template>      
  );      
};      
      
export default UsuariosList;