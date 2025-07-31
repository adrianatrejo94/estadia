import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../context/AuthContext';
import '../../assets/verona-layout/css/layout-bluegrey.css'; // o el tema que uses  
import '../../assets/primefaces-verona-blue/theme.css'; 
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
        let jqueryScript = null;
        let layoutScript = null;


        jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        jqueryScript.onload = () => {

            //cargar script
            layoutScript = document.createElement('script');
            layoutScript.src = '/src/assets/verona-layout/js/layout.js';
            layoutScript.onload = () => {
                if (window.VeronaLayout) {
                    window.VeronaLayout.init();
                }
            };
            document.head.appendChild(layoutScript);
        };

        document.head.appendChild(jqueryScript);

        return () => {
            // Cleanup ambos scripts  
            if (jqueryScript && document.head.contains(jqueryScript)) {
                document.head.removeChild(jqueryScript);
            }
            if (layoutScript && document.head.contains(layoutScript)) {
                document.head.removeChild(layoutScript);
            }

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
                <div className="layout-main">
                    <div className="layout-content">
                        {/* Formulario global - equivalente a h:form id="formGlobal" */}
                        <form id="formGlobal">
                            {/* Toast global - equivalente a p:growl */}
                            <Toast
                                ref={toast}
                                position="top-right"
                                life={8000}
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