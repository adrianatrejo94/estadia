import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';  
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
  const { user } = useAuth();  
  const toast = React.useRef(null);  
    
  // Estados equivalentes a ControllerCatRoles  
  const [roles, setRoles] = useState([]);  
  const [filteredRoles, setFilteredRoles] = useState([]);  
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
        setFilteredRoles(response.data);
      }  else {
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
  
  /**  
   * Template para la columna de estado  
   * Equivalente a la lógica de status en el DataTable original  
   */  
  const statusBodyTemplate = (rowData) => {  
    return (  
      <span className={`status-badge ${rowData.status ? 'status-active' : 'status-inactive'}`}>  
        {rowData.status ? 'Activo' : 'Inactivo'}  
      </span>  
    );  
  };  
  
  /**  
   * Template para la columna de acciones  
   * Equivalente a la columna "Modificar" del original  
   */  
  const actionBodyTemplate = (rowData) => {  
    return (  
      <Button  
        icon="pi pi-pencil"  
        className="p-button-rounded p-button-text"  
        onClick={() => handleEdit(rowData)}  
        tooltip="Editar"  
        tooltipOptions={{ position: 'top' }}  
      />  
    );  
  };  
  
  /**  
   * Header de la tabla con filtro global  
   * Equivalente al f:facet header del DataTable original  
   */  
  const renderHeader = () => {  
    return (  
      <div className="table-header">  
        <h2>Administración Roles</h2>  
        <div className="p-input-icon-left">  
          <i className="pi pi-search" />  
          <InputText  
            value={globalFilter}  
            onChange={(e) => setGlobalFilter(e.target.value)}  
            placeholder="Buscar roles..."  
            style={{ width: '300px' }}  
          />  
        </div>  
      </div>  
    );  
  };  
  
  return (  
    <Template title="Administración Roles">  
      <Toast ref={toast} />  
        
      <div className="roles-list-container">  
        {/* Botón Agregar Nuevo - equivalente a cmp:botonAgregarNuevo */}  
        {/* Nota: En el original está protegido por sec:authorize access="hasRole('ROLE_ALTA_ROLES')" */}  
        <div className="mb-3">  
          <Button  
            label="Agregar Nuevo"  
            icon="pi pi-plus"  
            className="p-button-success"  
            onClick={handleAddNew}  
          />  
        </div>  
  
        {/* Tabla de roles - equivalente a p:dataTable del original */}  
        <DataTable  
          value={filteredRoles}  
          loading={loading}  
          paginator  
          rows={5}  
          rowsPerPageOptions={[5, 10, 15]}  
          currentPageReportTemplate="{first}-{last} de {totalRecords} registros"  
          paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"  
          globalFilter={globalFilter}  
          header={renderHeader()}  
          emptyMessage="No se encontraron roles"  
          className="p-datatable-gridlines"  
          responsiveLayout="scroll"  
        >  
          {/* Columna Nombre - equivalente a p:column headerText="Nombre" */}  
          <Column  
            field="nombre"  
            header="Nombre"  
            sortable  
            filter  
            filterPlaceholder="Buscar por nombre"  
            style={{ minWidth: '200px' }}  
          />  
  
          {/* Columna Descripción */}  
          <Column  
            field="descripcion"  
            header="Descripción"  
            sortable  
            filter  
            filterPlaceholder="Buscar por descripción"  
            style={{ minWidth: '300px' }}  
          />  
  
          {/* Columna Estatus - equivalente a p:column headerText="Estatus" */}  
          <Column  
            field="status"  
            header="Estatus"  
            body={statusBodyTemplate}  
            sortable  
            filter  
            filterElement={  
              <select onChange={(e) => setGlobalFilter(e.target.value)}>  
                <option value="">Todos</option>  
                <option value="Activo">Activo</option>  
                <option value="Inactivo">Inactivo</option>  
              </select>  
            }  
            style={{ minWidth: '120px' }}  
          />  
  
          {/* Columna Modificar - equivalente a p:column headerText="Modificar" */}  
          {/* Nota: En el original está protegido por sec:authorize access="hasRole('ROLE_EDICION_ROLES')" */}  
          <Column  
            header="Acciones"  
            body={actionBodyTemplate}  
            exportable={false}  
            style={{ minWidth: '100px', textAlign: 'center' }}  
          />  
        </DataTable>  
      </div>  
    </Template>  
  );  
};  
  
export default RolesList;