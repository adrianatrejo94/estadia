import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { Dropdown } from 'primereact/dropdown';  
import { Button } from 'primereact/button';  
import { useAuth } from '../../context/AuthContext';  
  
/**  
 * Componente Topbar - Barra de navegación superior  
 *   
 * Funcionalidades principales:  
 * - Botón de menú hamburguesa  
 * - Logo de la aplicación  
 * - Selector de idioma  
 * - Información del usuario logueado  
 * - Menú desplegable con opciones de usuario  
 */  
const Topbar = () => {  
  // Hook de navegación de React Router para cambiar de página  
  const navigate = useNavigate();  
    
  // Extraemos funciones y datos del contexto de autenticación  
  // Equivalente a #{administradorPaginas} en el JSF original  
  const {   
    user,                // Usuario actual logueado  
    language,            // Idioma actual (es_MX o en_US)  
    changeLanguage,      // Función para cambiar idioma  
    logout,              // Función para cerrar sesión  
    getUserFullName,     // Función helper para obtener nombre completo  
    getUserRole          // Función helper para obtener rol del usuario  
  } = useAuth();  
    
  // Estado local para controlar la visibilidad del menú desplegable del usuario  
  const [showUserMenu, setShowUserMenu] = useState(false);  
  
  // Opciones de idioma - equivalente a f:selectItem en topbar_2.xhtml líneas 23-24  
  const languageOptions = [  
    { value: 'es_MX', label: 'Español' },    // #{msg['generico.idioma.es']}  
    { value: 'en_US', label: 'English' }     // #{msg['generico.idioma.en']}  
  ];  
  
  /**  
   * Maneja el cambio de idioma  
   * Equivalente a valueChangeListener="#{administradorPaginas.changeLang}"   
   * y onchange="submit();" del original  
   */  
  const handleLanguageChange = (e) => {  
    changeLanguage(e.value);  
    // Equivalente a oncomplete="location.reload()" en el JSF original  
    window.location.reload();  
  };  
  
  /**  
   * Maneja el clic en la información del usuario  
   * Muestra/oculta el menú desplegable  
   */  
  const handleUserDisplayClick = () => {  
    setShowUserMenu(!showUserMenu);  
  };  
  
  /**  
   * Maneja el cambio de contraseña  
   * Equivalente a onclick="PF('dlgContrasena').show()" del original  
   */  
  const handlePasswordChange = () => {  
    // En React navegamos a una página en lugar de mostrar un diálogo modal  
    navigate('/cambio-contrasena');  
    setShowUserMenu(false);  
  };  
  
  /**  
   * Maneja las preferencias de plataforma  
   * Equivalente a onclick="PF('PreferenciasSesion').show()" del original  
   */  
  const handlePreferences = () => {  
    // En React navegamos a una página en lugar de mostrar un diálogo modal  
    navigate('/preferencias');  
    setShowUserMenu(false);  
  };  
  
  /**  
   * Maneja el logout del usuario  
   * Equivalente a onclick="PF('WV_SinSesion2').show()" del original  
   */  
  const handleLogout = () => {  
    logout(); // Ejecuta la función de logout del AuthContext  
    setShowUserMenu(false);  
  };  
  
  return (  
    // Contenedor principal del topbar - equivalente a <div class="topbar">  
    <div className="topbar">  
      {/* Formulario principal - equivalente a <h:form id="formTop"> */}  
      <form id="formTop">  
        {/* Contenedor principal de elementos del topbar */}  
        <div className="topbar-main">  
            
          {/* Botón del menú hamburguesa - equivalente a líneas 12-14 del original */}  
          <a href="#" id="menu-button">  
            <span className="pi pi-bars"></span>  
          </a>  
  
          {/* Logo de la aplicación - equivalente a líneas 15-17 del original */}  
          {/* h:link outcome="/auth/home.caems" con p:graphicImage */}  
          <a href="#" onClick={() => navigate('/dashboard')}>  
            <img   
              src="/verona-layout/images/caems/CAEMS-bco.png"   
              className="logo"   
              alt="Logo CAEMS"  
            />  
          </a>  
  
          {/* Selector de idioma - equivalente a líneas 21-26 del original */}  
          {/* p:selectOneMenu value="#{administradorPaginas.idioma}" */}  
          <div style={{ marginLeft: '59%' }}>  
            <Dropdown  
              value={language}                    // Idioma actual del usuario  
              options={languageOptions}           // Opciones español/inglés  
              onChange={handleLanguageChange}     // Función de cambio de idioma  
              placeholder="Seleccionar idioma"  
            />  
          </div>  
  
          {/* Información del usuario - equivalente a líneas 28-32 del original */}  
          {/* <a href="#" id="user-display"> con spans para username y userrole */}  
          <a   
            href="#"   
            id="user-display"  
            onClick={handleUserDisplayClick}  
          >  
            {/* Nombre completo del usuario - equivalente a #{administradorPaginas.usuarioSesion.nombres} etc. */}  
            <span className="username">{getUserFullName()}</span>  
              
            {/* Rol del usuario - equivalente a #{administradorPaginas.usuarioSesion.idRol.nombre} */}  
            <span className="userrole">{getUserRole()}</span>  
              
            {/* Avatar del usuario - equivalente a p:graphicImage name="images/avatar.png" */}  
            <img src="/verona-layout/images/avatar.png" alt="Avatar" />  
          </a>  
  
          {/* Menú desplegable del usuario - equivalente a líneas 35-76 del original */}  
          {/* <ul id="topbar-menu" class="fadeInDown animated"> */}  
          {showUserMenu && (  
            <ul id="topbar-menu" className="fadeInDown animated topbar-menu-visible">  
                
              {/* Opción: Cambio de contraseña */}  
              {/* Equivalente a p:commandLink onclick="PF('dlgContrasena').show()" */}  
              <li>  
                <Button  
                  label="Cambio Contraseña"  
                  icon="pi pi-fw pi-cog"                    // Mismo icono del original  
                  className="p-button-text topbar-item"  
                  onClick={handlePasswordChange}  
                />  
              </li>  
  
              {/* Opción: Preferencias de plataforma */}  
              {/* Equivalente a p:commandLink onclick="PF('PreferenciasSesion').show()" */}  
              <li>  
                <Button  
                  label="Preferencias Plataforma"  
                  icon="pi pi-fw pi-cog"                    // Mismo icono del original  
                  className="p-button-text topbar-item"  
                  onClick={handlePreferences}  
                />  
              </li>  
  
              {/* Opción: Salir/Logout */}  
              {/* Equivalente a p:commandLink onclick="PF('WV_SinSesion2').show()" */}  
              <li>  
                <Button  
                  label="Salir"  
                  icon="pi pi-fw pi-sign-out"               // Icono más apropiado para logout  
                  className="p-button-text topbar-item"  
                  onClick={handleLogout}  
                />  
              </li>  
            </ul>  
          )}  
        </div>  
      </form>  
    </div>  
  );  
};  
  
export default Topbar;