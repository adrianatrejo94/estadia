import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../../context/AuthContext';  
  
const Menu = ({ isVisible = true }) => {  
    const navigate = useNavigate();  
    const { hasPermission, hasAnyPermission } = useAuth();  
    const [activeMenus, setActiveMenus] = useState({});  
  
    const handleNavigation = (path) => {  
        navigate(path);  
    };  
  
    const toggleSubmenu = (menuKey) => {  
        setActiveMenus(prev => ({  
            ...prev,  
            [menuKey]: !prev[menuKey]  
        }));  
    };  
  
    return (  
        <div className={`layout-menu-wrapper ${isVisible ? 'layout-menu-wrapper-active' : ''}`}>  
            <div className="layout-menu-container">  
                {/* Eliminamos el <form> aquí */}  
                <ul className="layout-menu">  
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
                {/* Cerramos sin el </form> */}  
            </div>  
        </div>  
    );  
};  
  
export default Menu;