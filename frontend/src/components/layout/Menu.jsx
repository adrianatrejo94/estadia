import React, { useState, useEffect } from 'react';    
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
  
    // Efecto para manejar las animaciones de slideDown/slideUp  
    useEffect(() => {  
        const submenus = document.querySelectorAll('.layout-menu ul');  
        submenus.forEach(submenu => {  
            const parentLi = submenu.parentElement;  
            const menuKey = parentLi.getAttribute('data-menu-key');  
              
            if (activeMenus[menuKey]) {  
                submenu.style.display = 'block';  
                // Simular slideDown  
                submenu.style.maxHeight = submenu.scrollHeight + 'px';  
                submenu.style.opacity = '1';  
            } else {  
                // Simular slideUp  
                submenu.style.maxHeight = '0px';  
                submenu.style.opacity = '0';  
                setTimeout(() => {  
                    if (!activeMenus[menuKey]) {  
                        submenu.style.display = 'none';  
                    }  
                }, 300);  
            }  
        });  
    }, [activeMenus]);  
    
    return (    
        <div className={`layout-menu-wrapper ${isVisible ? 'layout-menu-wrapper-active' : ''}`}>    
            <div className="layout-menu-container">    
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
                    <li   
                        role="menuitem"   
                        className={activeMenus.admin ? 'active-menuitem' : ''}  
                        data-menu-key="admin"  
                    >    
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
                            <span className={`layout-submenu-toggler pi pi-fw ${activeMenus.admin ? 'pi-angle-up' : 'pi-angle-down'}`}></span>    
                        </a>    
                        <ul style={{   
                            display: 'none',  
                            maxHeight: '0px',  
                            opacity: '0',  
                            overflow: 'hidden',  
                            transition: 'all 0.3s ease-in-out'  
                        }}>    
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
    
                            <li   
                                role="menuitem"   
                                className={activeMenus.config ? 'active-menuitem' : ''}  
                                data-menu-key="config"  
                            >    
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
                                    <span className={`layout-submenu-toggler pi pi-fw ${activeMenus.config ? 'pi-angle-up' : 'pi-angle-down'}`}></span>    
                                </a>    
                                <ul style={{   
                                    display: 'none',  
                                    maxHeight: '0px',  
                                    opacity: '0',  
                                    overflow: 'hidden',  
                                    transition: 'all 0.3s ease-in-out'  
                                }}>    
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
                    <li   
                        role="menuitem"   
                        className={activeMenus.catalogos ? 'active-menuitem' : ''}  
                        data-menu-key="catalogos"  
                    >    
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
                            <span className={`layout-submenu-toggler pi pi-fw ${activeMenus.catalogos ? 'pi-angle-up' : 'pi-angle-down'}`}></span>    
                        </a>    
                        <ul style={{   
                            display: 'none',  
                            maxHeight: '0px',  
                            opacity: '0',  
                            overflow: 'hidden',  
                            transition: 'all 0.3s ease-in-out'  
                        }}>    
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
                    <li   
                        role="menuitem"   
                        className={activeMenus.reportes ? 'active-menuitem' : ''}  
                        data-menu-key="reportes"  
                    >    
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
                            <span className={`layout-submenu-toggler pi pi-fw ${activeMenus.reportes ? 'pi-angle-up' : 'pi-angle-down'}`}></span>    
                        </a>    
                        <ul style={{   
                            display: 'none',  
                            maxHeight: '0px',  
                            opacity: '0',  
                            overflow: 'hidden',  
                            transition: 'all 0.3s ease-in-out'  
                        }}>    
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
            </div>    
        </div>    
    );    
};    
    
export default Menu;