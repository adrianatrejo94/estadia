import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import DataTable from "@/components/common/DataTable";
import FormButtons from "@/components/common/FormButtons";
import { userService } from "@/services/userService";

const UsuarioList = () => {
  const { hasRole } = useAuth(); // Verifica si el usuario tiene permisos
  const navigate = useNavigate();

  // Estado para guardar los usuarios obtenidos
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros y búsqueda
  const [globalFilter, setGlobalFilter] = useState("");

  // Paginación (adaptado del arquetipo JSF)
  const [pagination, setPagination] = useState({
    page: 0,
    rows: 10,
    totalRecords: 0,
  });

  // Cargar datos al montar el componente o al cambiar página
  useEffect(() => {
    fetchUsuarios();
  }, [pagination.page, pagination.rows]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      // Obtener usuarios con paginación simulada
      const data = await userService.buscar({
        page: pagination.page,
        size: pagination.rows,
      });
      setUsuarios(data.content); // contenido real
      setPagination(prev => ({ ...prev, totalRecords: data.totalElements }));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Botones de la barra superior
  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      {hasRole("ROLE_ADMIN") && (
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => navigate("/usuarios/form")}
        />
      )}
    </div>
  );

  const rightToolbarTemplate = () => (
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText
        type="search"
        placeholder="Buscar..."
        onInput={e => setGlobalFilter(e.target.value)}
      />
    </span>
  );

  // Columnas de la tabla, definidas con `useMemo` para rendimiento
  const columns = useMemo(() => [
    { field: "username", header: "Usuario" },
    { field: "nombre", header: "Nombre" },
    { field: "correo", header: "Correo" },
    { field: "roles", header: "Roles", body: row => row.roles?.join(", ") },
    {
      header: "Acciones",
      body: row => (
        <FormButtons
          onEdit={() => navigate(`/usuarios/form/${row.id}`)}
          onDelete={() => handleDeleteUser(row.id)}
        />
      ),
    },
  ], []);

  // Función para eliminar usuario
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await userService.eliminar(id);
      fetchUsuarios(); // recargar datos
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Usuarios</h2>

      {/* Barra de herramientas */}
      <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />

      {/* Tabla reutilizable */}
      <DataTable
        value={usuarios}
        columns={columns}
        loading={loading}
        globalFilter={globalFilter}
        paginator
        rows={pagination.rows}
        first={pagination.page * pagination.rows}
        totalRecords={pagination.totalRecords}
        onPageChange={(e) =>
          setPagination({
            ...pagination,
            page: Math.floor(e.first / e.rows),
            rows: e.rows,
          })
        }
      />
    </div>
  );
};

export default UsuarioList;

//Este componente se encargará de mostrar la lista de usuarios en una tabla, con funcionalidades de paginación, filtrado, y botones de acción para editar y eliminar, además de controlar la visibilidad de estos botones según los permisos del usuario.


