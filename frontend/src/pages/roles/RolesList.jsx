import React, { useState, useEffect } from 'react';    
import { useNavigate } from 'react-router-dom';    
import { InputText } from 'primereact/inputtext';    
import { Button } from 'primereact/button';    
import { Toast } from 'primereact/toast';    
import Template from '../../components/layout/Template';    
import { useAuth } from '../../context/AuthContext';    
import rolesService from '../../services/rolesService';  
  
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
  const toast = React.useRef(null);    
      
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
   * Equivalente a cambiaPaginaAlta() de ControllerCatRoles    
   */    
  const handleAddNew = () => {    
    navigate('/roles/nuevo');    
  };    
    
  /**    
   * Navega a la página de edición de rol    
   * Equivalente a cambiaPaginaEdicion() de ControllerCatRoles    
   */    
  const handleEdit = (rol) => {    
    navigate(`/roles/editar/${rol.idRol}`);    
  };    
  
  // Filtrar roles basado en el filtro global  
  const filteredRoles = roles.filter(rol =>   
    !globalFilter ||   
    rol.nombre?.toLowerCase().includes(globalFilter.toLowerCase()) ||  
    (rol.status ? 'Activo' : 'Inactivo').toLowerCase().includes(globalFilter.toLowerCase())  
  );  
  
  return (    
    <Template title="Administración Roles">    
      <Toast ref={toast} />    
          
      <div className="roles-list-container">    
        {/* Título igual al arquetipo */}  
        <h2>Administración Roles</h2>  
        <br/>  
  
        {/* Botón Agregar Nuevo - equivalente a cmp:botonAgregarNuevo */}  
        {hasAnyPermission(['ROLE_ALTA_ROLES']) && (  
          <div style={{ marginBottom: '1rem' }}>  
            <Button    
              label="Agregar Nuevo"    
              icon="pi pi-plus"    
              className="p-button-success"    
              onClick={handleAddNew}    
            />    
          </div>  
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
                ) : filteredRoles.length === 0 ? (  
                  <tr>  
                    <td colSpan="3" className="centrado">No se encontraron roles</td>  
                  </tr>  
                ) : (  
                  filteredRoles.slice(0, 5).map((rol, index) => (  
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
                            src="/images/caems/editar.png"  
                            style={{ width: '40px', cursor: 'pointer' }}  
                            title="editar"  
                            onClick={() => handleEdit(rol)}  
                            alt="Editar"  
                          />  
                        )}  
                      </td>  
                    </tr>  
                  ))  
                )}  
              </tbody>  
            </table>  
  
            {/* Paginador simple */}  
            {filteredRoles.length > 5 && (  
              <div className="ui-datatable-footer ui-widget-header ui-corner-bottom">  
                <div className="ui-paginator ui-paginator-bottom ui-widget-header ui-corner-all">  
                  <span className="ui-paginator-current">  
                    1-{Math.min(5, filteredRoles.length)} de {filteredRoles.length} registros  
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
    
export default RolesList;