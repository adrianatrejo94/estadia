import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../../context/AuthContext'; 
import logoVerona from '../../assets/verona-layout/images/logo-main.png'; 
import avatar from '../../assets/verona-layout/images/avatar.png';

/**        
 * Componente Topbar - Barra de navegación superior         
 */  
const Topbar = ({ toggleMenu, isMenuVisible }) => {  
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
  const [showUserMenu, setShowUserMenu] = useState(false);  
  
  /**        
   * Maneja el cambio de idioma        
   */  
  const handleLanguageChange = (e) => {  
    changeLanguage(e.target.value);  
    window.location.reload();  
  };  
  
  /**        
   * Maneja el clic en la información del usuario        
   * Muestra/oculta el menú desplegable        
   */  
  const handleUserDisplayClick = (e) => {  
    e.preventDefault();  
    setShowUserMenu(!showUserMenu);  
  };  
  
  // Maneja el cambio de contraseña        
  const handlePasswordChange = (e) => {  
    e.preventDefault();  
    // En React navegamos a una página en lugar de mostrar un diálogo modal        
    navigate('/cambio-contrasena');  
    setShowUserMenu(false);  
  };  
  
  /**        
   * Maneja las preferencias de plataforma        
   * Equivalente a onclick="PF('PreferenciasSesion').show()" del original        
   */  
  const handlePreferences = (e) => {  
    e.preventDefault();  
    // En React navegamos a una página en lugar de mostrar un diálogo modal        
    navigate('/preferencias');  
    setShowUserMenu(false);  
  };  
  
  /**        
   * Maneja el logout del usuario        
   * Equivalente a onclick="PF('WV_SinSesion2').show()" del original        
   */  
  const handleLogout = (e) => {  
    e.preventDefault();  
    logout(); // Ejecuta la función de logout del AuthContext      
    setShowUserMenu(false);  
  };  
  
  return (  
    // Contenedor principal del topbar - equivalente a <div class="topbar">        
    <div className="topbar">  
      <div className="topbar-main">  
        {/* Botón de menú hamburguesa */}  
        <a   
          href="#"   
          id="menu-button"  
          className={isMenuVisible ? 'menu-button-active' : ''}  
          onClick={(e) => {  
            e.preventDefault();  
            toggleMenu();  
          }}  
        >  
          <span className="pi pi-bars"></span>  
        </a>  
  
        {/* Logo de la aplicación */}  
        <a href="#" onClick={(e) => {  
          e.preventDefault();  
          navigate('/dashboard');  
        }}>  
          <img  
            src={logoVerona}  
            className="logo"  
            alt="Logo Verona"  
          />  
        </a>  
  
        {/* Selector de idioma nativo - equivalente a p:selectOneMenu del original */}  
        <select   
          className="ui-inputfield"  
          value={language}  
          onChange={handleLanguageChange}  
          style={{ marginLeft: '59%' }}  
        >  
          <option value="es_MX">Español</option>  
          <option value="en_US">English</option>  
        </select>  
  
        {/* Información del usuario */}  
        <a href="#" id="user-display" onClick={handleUserDisplayClick}>  
          <span className="username">{getUserFullName()}</span>  
          <span className="userrole">{getUserRole()}</span>  
          <img src={avatar} alt="Avatar" />  
        </a>  
  
        {/* Menú desplegable del usuario */}  
        {showUserMenu && (  
          <ul id="topbar-menu" className="fadeInDown animated topbar-menu-visible">  
            <li>  
              <a href="#" onClick={handlePasswordChange}>  
                <i className="topbar-icon pi pi-fw pi-cog"></i>  
                <span className="topbar-item-name">Cambio Contraseña</span>  
              </a>  
            </li>  
            <li>  
              <a href="#" onClick={handlePreferences}>  
                <i className="topbar-icon pi pi-fw pi-cog"></i>  
                <span className="topbar-item-name">Preferencias Plataforma</span>  
              </a>  
            </li>  
            <li>  
              <a href="#" onClick={handleLogout}>  
                <i className="topbar-icon pi pi-fw pi-sign-out"></i>  
                <span className="topbar-item-name">Salir</span>  
              </a>  
            </li>  
          </ul>  
        )}  
      </div>  
    </div>  
  );  
};  
  
export default Topbar;