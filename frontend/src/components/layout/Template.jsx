import React, { useEffect, useRef } from 'react';        
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
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);        
    const [showInactivityDialog, setShowInactivityDialog] = React.useState(false);        
          
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);        
            
    const toggleMenu = () => {        
        setIsMenuVisible(!isMenuVisible);        
    };        
          
    const toast = useRef(null);        
  
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
        
            <div className="layout-wrapper layout-menu-static">       
                <Topbar toggleMenu={toggleMenu} />        
                        
                <div className="layout-menu-container">        
                    <Menu isVisible={isMenuVisible} />        
                </div>        
                        
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
        
            {/* Diálogos de logout */}        
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