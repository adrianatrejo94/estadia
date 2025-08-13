import React, { useState, useEffect, useMemo } from 'react';      
import { useNavigate } from 'react-router-dom';      
import { InputText } from 'primereact/inputtext';      
import { Button } from 'primereact/button';      
//import { Toast } from 'primereact/toast';      
import Template from '../../components/layout/Template';      
import { useAuth } from '../../context/AuthContext';      
import rolesService from '../../services/rolesService';    
import BotonesFormulario from '../../components/common/BotonesFormulario';  
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';  
import Paginator from '../../components/common/Paginator';  
import { usePagination } from '../../hooks/usePagination';  
  
/**      
 * Componente RolesList - Lista de roles del sistema      
 * Equivalente a base/WEB/src/main/webapp/auth/administracion/roles/bandeja.xhtml      
 *       
 * Funcionalidades principales:      
 * - Tabla paginada con filtros      
 * - Búsqueda global      
 * - Botón para agregar nuevo rol      
 * - Botón de edición por fila      
 * - Control de acceso basado en roles      
 */      
const RolesList = () => {      
  const navigate = useNavigate();      
  const { user, hasAnyPermission } = useAuth();      
  //const toast = React.useRef(null);      
        
  // Estados equivalentes a ControllerCatRoles      
  const [roles, setRoles] = useState([]);      
  const [loading, setLoading] = useState(true);      
  const [globalFilter, setGlobalFilter] = useState('');      
      
  useEffect(() => {      
    loadRoles();      
  }, []);      
      
  /**      
   * Carga la lista de roles      
   * Equivalente al método buscar() de ControllerCatRoles      
   */      
  const loadRoles = async () => {      
    try {      
      setLoading(true);    
      const response = await rolesService.findAll();    
      if (response.success) {    
        setRoles(response.data);    
      } else {    
        toast.current?.show({    
            severity: 'error',    
            summary: 'Error',    
            detail: response.message    
        });    
      }    
    } catch (error) {      
      console.error('Error cargando roles:', error);      
      toast.current?.show({      
        severity: 'error',      
        summary: 'Error',      
        detail: 'Error al cargar los roles'      
      });      
    } finally {      
      setLoading(false);      
    }      
  };      
      
  /**      
   * Navega a la página de creación de nuevo rol            
   */      
  const handleAddNew = () => {      
    navigate('/roles/nuevo');      
  };      
      
  /**      
   * Navega a la página de edición de rol            
   */      
  const handleEdit = (rol) => {      
    navigate(`/roles/editar/${rol.idRol}`);      
  };      
  
  const handleDeleteRol = (id) => {  
      confirmDialog({  
        message: '¿Estás seguro de eliminar este rol? Esta acción no se puede deshacer.',  
        header: 'Confirmar Eliminación',  
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',  
        accept: async () => {  
          try {  
            await rolesService.delete(id);  
            loadRoles();    
            window.showGlobalMessage({  
              severity: 'success',  
              summary: 'Éxito',  
              detail: 'Rol eliminado correctamente'  
            });  
          } catch (error) {  
            console.error("Error al eliminar rol:", error);  
            window.showGlobalMessage({  
              severity: 'error',  
              summary: 'Error',  
              detail: 'Error al eliminar el rol'  
            });  
          }  
        }  
      });  
    };  
  
  // Filtrar roles basado en el filtro global    
  const filteredRoles = useMemo(() => {  
    return roles.filter(rol =>     
      !globalFilter ||     
      rol.nombre?.toLowerCase().includes(globalFilter.toLowerCase()) ||    
      (rol.status ? 'Activo' : 'Inactivo').toLowerCase().includes(globalFilter.toLowerCase())    
    );  
  }, [roles, globalFilter]);  
  
  // Usar el hook de paginación  
  const {  
    currentPage,  
    rows,  
    paginatedData: paginatedRoles,  
    handlePageChange,  
    handleRowsChange  
  } = usePagination(filteredRoles);  
    
  return (      
    <Template title="Administración Roles">            
      <ConfirmDialog />  
      <div className="roles-list-container">      
        {/* Título igual al arquetipo */}    
        <h2>Administración Roles</h2>    
        <br/>    
    
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
    
        {/* Tabla de roles con estructura del arquetipo */}    
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
                    <td colSpan="3" className="centrado">Cargando...</td>    
                  </tr>    
                ) : paginatedRoles.length === 0 ? (    
                  <tr>    
                    <td colSpan="3" className="centrado">No se encontraron roles</td>    
                  </tr>    
                ) : (    
                  paginatedRoles.map((rol, index) => (    
                    <tr key={rol.idRol || index} className={index % 2 === 0 ? 'ui-widget-content ui-datatable-even' : 'ui-widget-content ui-datatable-odd'}>    
                      <td className="centrado">    
                        <span>{rol.nombre}</span>    
                      </td>    
                      <td className="centrado">    
                        <span>{rol.status ? 'Activo' : 'Inactivo'}</span>    
                      </td>    
                      <td className="centrado">    
                        {hasAnyPermission(['ROLE_EDICION_ROLES']) && (    
                          <img     
                            src="src/assets/verona-layout/images/caems/editar.png"    
                            style={{ width: '40px', cursor: 'pointer', marginRight: '10px' }}    
                            title="editar"    
                            onClick={() => handleEdit(rol)}    
                            alt="Editar"    
                          />    
                        )}    
                        {hasAnyPermission(['ROLE_EDICION_ROLES']) && (  
                          <img  
                            src="src/assets/verona-layout/images/caems/eliminar.png"  
                            style={{ width: '40px', cursor: 'pointer' }}  
                            title="eliminar"  
                            onClick={() => handleDeleteRol(rol.idRol)}  
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
              data={filteredRoles}  
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
      
export default RolesList;