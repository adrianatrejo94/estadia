import React from 'react';  
import logo from '../../assets/verona-layout/images/logo-dark.png';  
  
/**  
 * Componente Footer - Pie de página de la aplicación   
 */  
const Footer = () => {  
  return (  
    // Contenedor principal con clase clearfix como en el original  
    <div className="footer clearfix">  
      {/* Logo */}  
      <img   
        src={logo}   
        alt="Logo Verona"  
      />  
        
      {/* Nombre de la aplicación original - equivalente a span class="app-name" */}  
      <span className="app-name">VERONA</span>  
        
      {/* Sección derecha del footer con enlaces reales */}  
      <div className="footer-right">  
        {/* Enlaces originales del arquetipo con URLs reales */}  
        <a href="https://github.com/primefaces" target="_blank" rel="noopener noreferrer">  
          <i className="pi pi-github"></i>  
        </a>  
        <a href="https://www.facebook.com/groups/primefaces" target="_blank" rel="noopener noreferrer">  
          <i className="pi pi-facebook"></i>  
        </a>  
        <a href="http://twitter.com/primefaces" target="_blank" rel="noopener noreferrer">  
          <i className="pi pi-twitter"></i>  
        </a>  
          
        {/* Copyright original */}  
        <span>All Rights Reserved - 2025</span>  
      </div>  
    </div>  
  );  
};  
  
export default Footer;