import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Menu = () => {
    const navigate = useNavigate();
    const { hasPermission, hasAnyPermission } = useAuth();  // Accede a funciones de permisos del usuario
    const [activeMenus, setActiveMenus] = useState({});  // Estado local para saber qué submenús están activos

    // Función para cambiar de página
    const handleNavigation = (path) => {
        navigate(path);
    };

    // Muestra/oculta submenús al hacer clic en una sección padre
    const toggleSubmenu = (menuKey) => {
        setActiveMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    return (
        <div className="layout-menu-wrapper">   {/* Contenedor general del menú lateral */}
            <div className="layout-menu-container">   {/* Contenedor que define los estilos del menú */}
                <form id="menuform">
                    <ul className="layout-menu">  {/* Lista principal del menú */}
                        {/* Dashboard */}
                        <li role="menuitem">
                            <a
                                href="#"
                                className="ui-menuitem-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation('/dashboard');
                                }}
                            >
                                <span className="ui-menuitem-icon pi pi-fw pi-home"></span>
                                <span className="ui-menuitem-text">Dashboard</span>
                            </a>
                        </li>

                        {/* Administración */}
                        <li role="menuitem" className={activeMenus.admin ? 'active-menuitem' : ''}>
                            <a
                                href="#"
                                className="ui-menuitem-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleSubmenu('admin');
                                }}
                            >
                                <span className="ui-menuitem-icon pi pi-fw pi-cog"></span>
                                <span className="ui-menuitem-text">Administración</span>
                                <span className="layout-submenu-toggler pi pi-fw pi-angle-down"></span>
                            </a>
                            <ul style={{ display: activeMenus.admin ? 'block' : 'none' }}>

                                {/* Submenú: Roles (solo si el usuario tiene permiso) */}
                                {hasAnyPermission(['ROLE_BUSQUEDA_ROLES', 'ROLE_EDICION_ROLES', 'ROLE_ALTA_ROLES']) && (
                                    <li role="menuitem">
                                        <a
                                            href="#"
                                            className="ui-menuitem-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavigation('/roles');
                                            }}
                                        >
                                            <span className="ui-menuitem-icon pi pi-fw pi-lock"></span>
                                            <span className="ui-menuitem-text">Administración roles</span>
                                        </a>
                                    </li>
                                )}

                                {/* Submenú: Usuarios */}
                                <li role="menuitem">
                                    <a
                                        href="#"
                                        className="ui-menuitem-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation('/usuarios');
                                        }}
                                    >
                                        <span className="ui-menuitem-icon pi pi-fw pi-users"></span>
                                        <span className="ui-menuitem-text">Administración Usuarios</span>
                                    </a>
                                </li>

                                {/* Configuración Plataforma - Submenú anidado */}
                                <li role="menuitem" className={activeMenus.config ? 'active-menuitem' : ''}>
                                    <a
                                        href="#"
                                        className="ui-menuitem-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSubmenu('config');
                                        }}
                                    >
                                        <span className="ui-menuitem-icon pi pi-fw pi-cog"></span>
                                        <span className="ui-menuitem-text">Configuración Plataforma</span>
                                        <span className="layout-submenu-toggler pi pi-fw pi-angle-down"></span>
                                    </a>
                                    <ul style={{ display: activeMenus.config ? 'block' : 'none' }}>
                                        <li role="menuitem">
                                            <a
                                                href="#"
                                                className="ui-menuitem-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigation('/configuracion/mensajeria');
                                                }}
                                            >
                                                <span className="ui-menuitem-icon pi pi-fw pi-envelope"></span>
                                                <span className="ui-menuitem-text">Configuración Mensajería</span>
                                            </a>
                                        </li>
                                        <li role="menuitem">
                                            <a
                                                href="#"
                                                className="ui-menuitem-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavigation('/configuracion/preferencias');
                                                }}
                                            >
                                                <span className="ui-menuitem-icon pi pi-fw pi-star-fill"></span>
                                                <span className="ui-menuitem-text">Preferencias Plataforma</span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        {/* Administración Catálogos */}
                        <li role="menuitem" className={activeMenus.catalogos ? 'active-menuitem' : ''}>
                            <a
                                href="#"
                                className="ui-menuitem-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleSubmenu('catalogos');
                                }}
                            >
                                <span className="ui-menuitem-icon pi pi-fw pi-cog"></span>
                                <span className="ui-menuitem-text">Administración Catálogos</span>
                                <span className="layout-submenu-toggler pi pi-fw pi-angle-down"></span>
                            </a>
                            <ul style={{ display: activeMenus.catalogos ? 'block' : 'none' }}>
                                <li role="menuitem">
                                    <a
                                        href="#"
                                        className="ui-menuitem-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation('/catalogos/dispositivos');
                                        }}
                                    >
                                        <span className="ui-menuitem-icon pi pi-fw pi-tablet"></span>
                                        <span className="ui-menuitem-text">Dispositivos</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a
                                        href="#"
                                        className="ui-menuitem-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation('/catalogos/empresas');
                                        }}
                                    >
                                        <span className="ui-menuitem-icon pi pi-fw pi-chart-pie"></span>
                                        <span className="ui-menuitem-text">Empresas</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a
                                        href="#"
                                        className="ui-menuitem-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation('/catalogos/indicadores');
                                        }}
                                    >
                                        <span className="ui-menuitem-icon pi pi-fw pi-chart-pie"></span>
                                        <span className="ui-menuitem-text">Indicadores</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        {/* Reportes */}
                        <li role="menuitem" className={activeMenus.reportes ? 'active-menuitem' : ''}>
                            <a
                                href="#"
                                className="ui-menuitem-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleSubmenu('reportes');
                                }}
                            >
                                <span className="ui-menuitem-icon pi pi-fw pi-compass"></span>
                                <span className="ui-menuitem-text">Reportes</span>
                                <span className="layout-submenu-toggler pi pi-fw pi-angle-down"></span>
                            </a>
                            <ul style={{ display: activeMenus.reportes ? 'block' : 'none' }}>
                                <li role="menuitem">
                                    <a
                                        href="#"
                                        className="ui-menuitem-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation('/reportes/historico');
                                        }}
                                    >
                                        <span className="ui-menuitem-icon pi pi-fw pi-prime"></span>
                                        <span className="ui-menuitem-text">Consulta Histórico</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a
                                        href="#"
                                        className="ui-menuitem-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation('/reportes/graficos');
                                        }}
                                    >
                                        <span className="ui-menuitem-icon pi pi-fw pi-desktop"></span>
                                        <span className="ui-menuitem-text">Gráficos</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    );
};

export default Menu;