import React, { useState, useEffect, useRef } from 'react';          
import { useNavigate } from 'react-router-dom';          
import { useAuth } from '../context/AuthContext';          
import logo from '../assets/verona-layout/images/logo-dark.png';       
import VeronaGrowl from '../components/common/VeronaGrowl';    
import '../assets/primefaces-verona-bluegrey/theme.css';    
        
/**          
 * Componente Login - Página de inicio de sesión              
 */          
const Login = () => {          
  const navigate = useNavigate();          
  const { login, isAuthenticated, setAuthenticatedManually } = useAuth();          
            
  // Estados del formulario         
  const [formData, setFormData] = useState({          
    usuario: '',         
    password: ''         
  });          
            
  const [loading, setLoading] = useState(false);          
  const [errors, setErrors] = useState({});           
  const [showPassword, setShowPassword] = useState(false);        
      
  // Estados para el VeronaGrowl (igual que en Template)    
  const [messages, setMessages] = useState([]);      
  const messageIdRef = useRef(0);    
          
  // Configurar window.showGlobalMessage exactamente igual que en Template    
  useEffect(() => {        
    window.showGlobalMessage = ({ severity, summary, detail }) => {        
      const newMessage = {      
        id: ++messageIdRef.current,      
        severity,      
        summary,      
        detail      
      };      
      setMessages(prev => [...prev, newMessage]);      
    };        
    return () => delete window.showGlobalMessage;        
  }, []);      
    
  const removeMessage = (id) => {      
    setMessages(prev => prev.filter(msg => msg.id !== id));      
  };     
    
  // Redireccionar si ya está autenticado          
  useEffect(() => {          
    if (isAuthenticated) {          
      navigate('/dashboard');          
    }          
  }, [isAuthenticated, navigate]);          
          
  // Limpiar sesión al cargar          
  useEffect(() => {          
    const clearSession = () => {          
      localStorage.clear();          
      sessionStorage.clear();          
    };          
    clearSession();          
  }, []);          
          
  const handleInputChange = (field, value) => {          
    setFormData(prev => ({ ...prev, [field]: value }));          
    if (errors[field]) {          
      setErrors(prev => ({ ...prev, [field]: null }));          
    }          
  };          
          
  const validateForm = () => {          
    const newErrors = {};          
    if (!formData.usuario?.trim()) {          
      newErrors.usuario = 'El campo usuario es requerido';          
    }          
    if (!formData.password?.trim()) {          
      newErrors.password = 'El campo contraseña es requerido';          
    }          
    setErrors(newErrors);          
    return Object.keys(newErrors).length === 0;          
  };          
      
  // Funciones para mostrar diferentes tipos de notificaciones    
  const showError = (message) => {    
    if (window.showGlobalMessage) {    
      window.showGlobalMessage({    
        severity: 'error',    
        summary: 'Error',    
        detail: message    
      });    
    }    
  };    
    
  const showWarning = (message) => {    
    if (window.showGlobalMessage) {    
      window.showGlobalMessage({    
        severity: 'warn',    
        summary: 'Advertencia',    
        detail: message    
      });    
    }    
  };    
    
  const showSuccess = (message) => {    
    if (window.showGlobalMessage) {    
      window.showGlobalMessage({    
        severity: 'success',    
        summary: 'Éxito',    
        detail: message    
      });    
    }    
  };    
          
  const handleLogin = async (e) => {          
    e.preventDefault();          
    if (!validateForm()) {          
      return;          
    }          
    setLoading(true);    
    
    let result = null;
      
    try {          
      const result = await login(formData.usuario, formData.password);          
        
      if (result.success) {          
        showSuccess('Inicio de sesión exitoso');      
        // Mantener loading activo y navegar después del delay  
        setTimeout(() => { 
          setAuthenticatedManually(true);     
          navigate('/dashboard');   
          setLoading(false);     
        }, 3000); // 3 segundos para ver el mensaje  
        return; // Salir aquí para evitar el finally  
      } else {          
        if (result.message === 'Usuario inactivo') {      
          showWarning('El usuario no existe o está inactivo');      
        } else if (result.message === 'Perfil inactivo') {      
          showWarning('El perfil del usuario está inactivo');      
        } else if (result.message === 'Credenciales incorrectas') {      
          showError('Usuario o contraseña incorrectos');      
        } else {      
          showError(result.message || 'Error al iniciar sesión');      
        }      
      }          
    } catch (error) {          
      // Mostrar el error tanto en consola como en growl  
      console.error('Error en login:', error);          
      showError(`Error al iniciar sesión: ${error.message || 'Intente nuevamente.'}`);          
    } finally {          
      // Solo ejecutar finally si NO fue exitoso  
      if (!result?.success) {  
        setLoading(false);          
      }  
    }          
  };          
          
  return (          
    <div className="login-body">          
      <VeronaGrowl    
        messages={messages}    
        onRemove={removeMessage}    
      />    
                
      <div className="login-panel ui-fluid">          
        <form onSubmit={handleLogin}>          
          <div className="grid">          
            <div className="col-12 logo-container">          
              <img src={logo} alt="Logo" />          
              <h1>Login To Your Account</h1>          
              <h2>WELCOME</h2>          
            </div>          
          
            <div className="col-12">          
              <input        
                type="text"        
                className={`ui-inputfield ${errors.usuario ? 'ui-state-error' : ''}`}        
                placeholder="Usuario"        
                value={formData.usuario}        
                onChange={(e) => handleInputChange('usuario', e.target.value)}        
                disabled={loading}        
              />        
              {errors.usuario && (          
                <small className="p-error">{errors.usuario}</small>          
              )}          
            </div>          
          
            <div className="col-12">          
              <div className="ui-inputgroup">        
                <input        
                  type={showPassword ? "text" : "password"}        
                  className={`ui-inputfield ${errors.password ? 'ui-state-error' : ''}`}        
                  placeholder="Contraseña"        
                  value={formData.password}        
                  onChange={(e) => handleInputChange('password', e.target.value)}        
                  disabled={loading}        
                />        
                <button        
                  type="button"        
                  className="ui-button ui-button-icon-only ui-inputgroup-addon"        
                  onClick={() => setShowPassword(!showPassword)}        
                  disabled={loading}        
                >        
                  <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}></i>        
                </button>        
              </div>        
              {errors.password && (          
                <small className="p-error">{errors.password}</small>          
              )}          
            </div>          
          
            <div className="col-12 button-container">          
              <button        
                type="submit"        
                className="ui-button ui-button-success rounded-button ui-button-raised"        
                disabled={loading}        
              >        
                {loading ? (        
                  <i className="pi pi-spin pi-spinner"></i>        
                ) : (        
                  <i className="pi pi-user"></i>        
                )}        
                <span className="ui-button-text">Entrar</span>        
              </button>        
            </div>          
          </div>          
        </form>          
      </div>          
    </div>          
  );          
};          
          
export default Login;