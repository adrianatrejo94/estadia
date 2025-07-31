import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { Dropdown } from 'primereact/dropdown';  
import { Button } from 'primereact/button';  
import { useAuth } from '../../context/AuthContext'; 
import Menu from './Menu'; // Importar el componente Menu 
  
/**  
 * Componente Topbar - Barra de navegación superior   
 */  
const Topbar = () => {  
  // Hook de navegación de React Router para cambiar de página  
  const navigate = useNavigate();  
    
  // Extraemos funciones y datos del contexto de autenticación  
    
  const {   
    user,                // Usuario actual logueado  
    language,            // Idioma actual (es_MX o en_US)  
    changeLanguage,      // Función para cambiar idioma  
    logout,              // Función para cerrar sesión  
    getUserFullName,     // Función helper para obtener nombre completo  
    getUserRole          // Función helper para obtener rol del usuario  
  } = useAuth();  
    
  // Estado local para controlar la visibilidad del menú desplegable del usuario  
  //const [showUserMenu, setShowUserMenu] = useState(false);  
  
  // Opciones de idioma - equivalente a f:selectItem en topbar_2.xhtml líneas 23-24  
  const languageOptions = [  
    { value: 'es_MX', label: 'Español' },    // #{msg['generico.idioma.es']}  
    { value: 'en_US', label: 'English' }     // #{msg['generico.idioma.en']}  
  ];  
  
  /**  
   * Maneja el cambio de idioma  
   */  
  const handleLanguageChange = (e) => {  
    changeLanguage(e.value);    
    window.location.reload();  
  };  
  
  /**  
   * Maneja el clic en la información del usuario  
   * Muestra/oculta el menú desplegable  
   */  
  //const handleUserDisplayClick = () => {  
    //setShowUserMenu(!showUserMenu);  
  //};  
  
    
  //Maneja el cambio de contraseña  
  const handlePasswordChange = () => {  
    // En React navegamos a una página en lugar de mostrar un diálogo modal  
    navigate('/cambio-contrasena');  
  };  
  
  /**  
   * Maneja las preferencias de plataforma  
   * Equivalente a onclick="PF('PreferenciasSesion').show()" del original  
   */  
  const handlePreferences = () => {  
    // En React navegamos a una página en lugar de mostrar un diálogo modal  
    navigate('/preferencias');  
  };  
  
  /**  
   * Maneja el logout del usuario  
   * Equivalente a onclick="PF('WV_SinSesion2').show()" del original  
   */  
  const handleLogout = () => {  
    logout(); // Ejecuta la función de logout del AuthContext  
  };  
  
  return (  
    // Contenedor principal del topbar - equivalente a <div class="topbar">  
    <div className="topbar"> 
     <form id="formTop">    
        <div className="topbar-main">
            
          <a href="#" id="menu-button">  
            <span className="pi pi-bars"></span>  
          </a>  
  
          {/* Logo de la aplicación */} 
          <a href="#" onClick={() => navigate('/dashboard')}>  
            <img   
              src="src/assets/verona-layout/images/caems/CAEMS-bco.png"   
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
  
          {/* Información del usuario */}  
          <a href="#" id="user-display">  

            <span className="username">{getUserFullName()}</span> {/* Nombre completo del usuario */}  
            <span className="userrole">{getUserRole()}</span>  {/* Rol del usuario */}  
            <img src="src/assets/verona-layout/images/avatar.png" alt="Avatar" />  
          </a>  
  
          {/* Menú desplegable del usuario */}    
            <ul id="topbar-menu" className="fadeInDown animated">                   
              <li>  
                <Button  
                  label="Cambio Contraseña"  
                  icon="pi pi-fw pi-cog"                      
                  className="p-button-text topbar-item"  
                  onClick={handlePasswordChange}  
                />  
              </li>  
              <li>  
                <Button  
                  label="Preferencias Plataforma"  
                  icon="pi pi-fw pi-cog"                    
                  className="p-button-text topbar-item"  
                  onClick={handlePreferences}  
                />  
              </li>  
              <li>  
                <Button  
                  label="Salir"  
                  icon="pi pi-fw pi-sign-out"              
                  className="p-button-text topbar-item"  
                  onClick={handleLogout}  
                />  
              </li>  
            </ul>  
        </div> 

        <Menu /> {/* Componente Menu lateral */} 
      </form>  
    </div>  
  );  
};  
  
export default Topbar;