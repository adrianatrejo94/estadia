import React, { useEffect, useRef, useState } from 'react';  
import { Helmet } from 'react-helmet-async';  
import { Toast } from 'primereact/toast';  
import { Dialog } from 'primereact/dialog';  
import { Button } from 'primereact/button';  
import { ProgressSpinner } from 'primereact/progressspinner';  
import { useAuth } from '../../context/AuthContext';  
import '../../assets/verona-layout/css/layout-bluegrey.css';  
import '../../assets/primefaces-verona-blue/theme.css';  
// componentes de layout   
import Topbar from './Topbar';  
import Menu from './Menu';  
import Footer from './Footer';  
  
const Template = ({ children, title = 'PrimeFaces Verona' }) => {  
    const { isAuthenticated, logout } = useAuth();  
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);  
    const [showInactivityDialog, setShowInactivityDialog] = useState(false);  
    const [menuCollapsed, setMenuCollapsed] = useState(true); // Inicializar como colapsado  
    const toast = useRef(null);  
  
    // Función simplificada para manejar el toggle del menú  
    const toggleMenu = () => {  
        setMenuCollapsed(!menuCollapsed);  
        // Trigger resize event para que otros componentes se ajusten  
        setTimeout(() => {  
            window.dispatchEvent(new Event('resize'));  
        }, 300);  
    };  
  
    // Restaurar estado del menú desde localStorage  
    useEffect(() => {  
        const savedMenuState = localStorage.getItem('menuCollapsed');  
        if (savedMenuState !== null) {  
            setMenuCollapsed(JSON.parse(savedMenuState));  
        }  
    }, []);  
  
    // Guardar estado cuando cambie  
    useEffect(() => {  
        localStorage.setItem('menuCollapsed', JSON.stringify(menuCollapsed));  
    }, [menuCollapsed]);  
  
    useEffect(() => {  
        // Crear mock de PrimeFaces ANTES de cargar scripts  
        if (!window.PrimeFaces) {  
            window.PrimeFaces = {  
                widget: {  
                    BaseWidget: {  
                        extend: function(obj) {  
                            function Widget(cfg) {  
                                this.cfg = cfg || {};  
                                this.id = cfg?.id;  
                                if (this.init) this.init(cfg);  
                            }  
                            Widget.prototype._super = function() {};  
                            for (let prop in obj) {  
                                Widget.prototype[prop] = obj[prop];  
                            }  
                            return Widget;  
                        }  
                    }  
                },  
                widgets: {},  
                ajax: { RESOURCE: null },  
                VeronaConfigurator: {},  
                locales: {}  
            };  
  
            window.PF = function(widgetVar) {  
                return window.PrimeFaces.widgets[widgetVar];  
            };  
        }  
  
        // Cargar jQuery primero, luego layout.js  
        let jqueryScript = null;  
        let layoutScript = null;  
  
        jqueryScript = document.createElement('script');  
        jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';  
        jqueryScript.onload = () => {  
            // Cargar layout.js después de jQuery  
            layoutScript = document.createElement('script');  
            layoutScript.src = '/src/assets/verona-layout/js/layout.js';  
  
            // Inicializar el widget de Verona después de cargar layout.js  
            layoutScript.onload = () => {  
                setTimeout(() => {  
                    if (window.PrimeFaces && window.PrimeFaces.widget.Verona) {  
                        new window.PrimeFaces.widget.Verona({  
                            id: 'VeronaMenuWidget'  
                        });  
                    }  
                }, 100);  
            };  
  
            document.head.appendChild(layoutScript);  
        };  
        document.head.appendChild(jqueryScript);  
  
        return () => {  
            if (jqueryScript && document.head.contains(jqueryScript)) {  
                document.head.removeChild(jqueryScript);  
            }  
            if (layoutScript && document.head.contains(layoutScript)) {  
                document.head.removeChild(layoutScript);  
            }  
        };  
    }, []);  
  
    // Estilos CSS específicos para el menú lateral  
    useEffect(() => {  
        const style = document.createElement('style');  
        style.textContent = `  
            .layout-menu-wrapper {  
                position: fixed !important;  
                top: 60px !important;  
                left: -250px !important;  
                width: 250px !important;  
                height: calc(100vh - 60px) !important;  
                background-color: #37474f !important;  
                z-index: 999 !important;  
                transition: left 0.3s ease !important;  
                display: block !important;  
            }  
  
            .layout-menu-wrapper.layout-menu-wrapper-active {  
                left: 0 !important;  
            }  
  
            .layout-menu-container {  
                height: 100% !important;  
                overflow-y: auto !important;  
                padding-top: 15px !important;  
            }  
  
            .layout-menu {  
                background-color: transparent !important;  
                list-style-type: none !important;  
                margin: 0 !important;  
                padding: 0 !important;  
            }  
  
            .layout-menu li a {  
                color: #ffffff !important;  
                border-bottom: 1px solid rgba(255,255,255,0.1) !important;  
                display: block !important;  
                padding: 12px 16px !important;  
                text-decoration: none !important;  
                white-space: nowrap !important;  
                position: relative !important;  
                box-sizing: border-box !important;  
            }  
  
            .layout-menu li a:hover {  
                background-color: rgba(255,255,255,0.1) !important;  
            }  
  
            .layout-menu li.active-menuitem > a {  
                color: #ffffff !important;  
            }  
  
            .layout-menu ul {  
                background-color: rgba(0,0,0,0.2) !important;  
            }  
  
            .layout-menu ul li a {  
                padding-left: 32px !important;  
                border-top: 0 none !important;  
            }  
  
            .layout-menu li.active-menuitem > ul {  
                z-index: 1 !important;  
            }  
        `;  
        document.head.appendChild(style);  
  
        return () => {  
            if (document.head.contains(style)) {  
                document.head.removeChild(style);  
            }  
        };  
    }, []);  
  
    // Función global para mensajes  
    useEffect(() => {  
        window.showGlobalMessage = ({ severity, summary, detail }) => {  
            toast.current?.show({ severity, summary, detail, life: 8000 });  
        };  
        return () => delete window.showGlobalMessage;  
    }, []);  
  
    const handleLogout = async () => {  
        await logout();  
        setShowLogoutDialog(false);  
    };  
  
    const handleInactivityLogout = async () => {  
        await logout();  
        setShowInactivityDialog(false);  
    };  
  
    return (  
        <>  
            <Helmet>  
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />  
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />  
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />  
                <meta name="apple-mobile-web-app-capable" content="yes" />  
                <title>{title}</title>  
            </Helmet>  
  
            <div className={`layout-wrapper layout-menu-static ${menuCollapsed ? 'layout-menu-static-inactive' : ''}`}>  
                <Topbar toggleMenu={toggleMenu} menuCollapsed={menuCollapsed} />  
                <Menu isVisible={!menuCollapsed} />  
  
                <div className="layout-main">  
                    <div className="layout-content">  
                        <form id="formGlobal">  
                            <Toast  
                                ref={toast}  
                                position="top-right"  
                                life={8000}  
                            />  
                            {children}  
                        </form>  
                    </div>  
                    <Footer />  
                </div>  
            </div>  
  
            <Dialog  
                visible={showLogoutDialog}  
                onHide={() => setShowLogoutDialog(false)}  
                header="Cierre de Sesión"  
                modal={true}  
                style={{ width: '30%' }}  
                draggable={false}  
                closable={false}  
            >  
                <div className="p-grid">  
                    <div className="p-col-12">  
                        <p>¿Está seguro que desea salir?</p>  
                    </div>  
                    <div className="p-col-12" style={{ marginLeft: '70%' }}>  
                        <Button  
                            label="Aceptar"  
                            className="p-button-success"  
                            onClick={handleLogout}  
                        />  
                    </div>  
                </div>  
            </Dialog>  
  
            <Dialog  
                visible={showInactivityDialog}  
                onHide={() => setShowInactivityDialog(false)}  
                header="Cierre de Sesión"  
                modal={true}  
                style={{ width: '30%' }}  
                draggable={false}  
                closable={false}  
            >  
                <div className="p-grid">  
                    <div className="p-col-12">  
                        <p>Estimado usuario por inactividad se ha cerrado su sesión, por favor volver a ingresar</p>  
                    </div>  
                    <div className="p-col-12" style={{ marginLeft: '70%' }}>  
                        <Button  
                            label="Aceptar"  
                            className="p-button-success"  
                            onClick={handleInactivityLogout}  
                        />  
                    </div>  
                </div>  
            </Dialog>  
  
            <div style={{ position: 'fixed', right: '7px', bottom: '7px', width: '32px', height: '32px' }}>  
                <ProgressSpinner style={{ width: '32px', height: '32px' }} strokeWidth="4" />  
            </div>  
        </>  
    );  
};  
  
export default Template;