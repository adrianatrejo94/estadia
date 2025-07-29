import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../context/AuthContext';
// componentes de layout 
import Topbar from './Topbar';
import Menu from './Menu';
import Footer from './Footer';

const Template = ({ children, title = 'PrimeFaces Verona' }) => {
    // Accedemos al contexto de autenticación para verificar sesión o cerrar sesión
    const { isAuthenticated, logout } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
    const [showInactivityDialog, setShowInactivityDialog] = React.useState(false);
    const toast = useRef(null);

    useEffect(() => {
        // Cargar scripts de Verona - equivalente a h:outputScript  
        const scripts = [
            '/verona-layout/js/layout.js',
            '/verona-layout/js/prism.js',
            '/verona-layout/js/validacionesCA.js'
        ];

        const loadedScripts = scripts.map(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
            return script;
        });

        return () => {
            loadedScripts.forEach(script => {
                if (document.head.contains(script)) {
                    document.head.removeChild(script);
                }
            });
        };
    }, []);

    // Función global para mensajes - equivalente a p:growl  
    useEffect(() => {
        window.showGlobalMessage = ({ severity, summary, detail }) => {
            toast.current?.show({ severity, summary, detail, life: 8000 });
        };
        return () => delete window.showGlobalMessage;
    }, []);

    // Acción al confirmar cierre de sesión manual
    const handleLogout = async () => {
        await logout();
        setShowLogoutDialog(false);
    };

    // Acción al confirmar cierre de sesión por inactividad
    const handleInactivityLogout = async () => {
        await logout();
        setShowInactivityDialog(false);
    };

    // Estructura del layout visual
    return (
        <>
            {/* Meta tags - equivalente a h:head */}
            <Helmet>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <title>{title}</title>
            </Helmet>

            {/* Estructura principal - equivalente a layout-wrapper */}
            <div className="layout-wrapper layout-menu-static">
                {/* Topbar - equivalente a ui:include topbar */}
                <Topbar />

                {/* Menu lateral */}
                <Menu />

                {/* Contenido principal - equivalente a layout-main */}
                <div className="layout-main">
                    <div className="layout-content">
                        {/* Formulario global - equivalente a h:form id="formGlobal" */}
                        <form id="formGlobal">
                            {/* Toast global - equivalente a p:growl */}
                            <Toast
                                ref={toast}
                                position="top-right"
                                life={8000}
                                showDetail={true}
                                showSummary={true}
                            />

                            {/* Contenido de la página */}
                            {children}
                        </form>
                    </div>

                    {/* Footer - equivalente a ui:include footer */}
                    <Footer />
                </div>
            </div>

            {/* Dialog logout manual - equivalente a p:dialog WV_SinSesion2 */}
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

            {/* Dialog inactividad - equivalente a p:dialog WV_SinSesion */}
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

            {/* Indicador AJAX - equivalente a p:ajaxStatus */}
            <div style={{ position: 'fixed', right: '7px', bottom: '7px', width: '32px', height: '32px' }}>
                <ProgressSpinner style={{ width: '32px', height: '32px' }} strokeWidth="4" />
            </div>
        </>
    );
};

export default Template;