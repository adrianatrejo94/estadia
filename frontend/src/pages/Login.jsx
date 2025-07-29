import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { InputText } from 'primereact/inputtext';  
import { Password } from 'primereact/password';  
import { Button } from 'primereact/button';  
import { Toast } from 'primereact/toast';  
import { useAuth } from '../context/AuthContext';  
import logo from '../assets/verona-layout/images/logo-dark.png';

  
/**  
 * Componente Login - Página de inicio de sesión  
 * Equivalente a base/WEB/src/main/webapp/login.xhtml  
 *   
 * Funcionalidades principales:  
 * - Formulario de login con usuario y contraseña  
 * - Validación de campos requeridos  
 * - Integración con AuthContext para autenticación  
 * - Redirección automática al dashboard después del login  
 * - Manejo de errores de autenticación  
 */  
const Login = () => {  
  const navigate = useNavigate();  
  const { login, isAuthenticated } = useAuth();  
  const toast = React.useRef(null);  
    
  // Estados del formulario 
  const [formData, setFormData] = useState({  
    usuario: '',     // Equivalente a private String usuario 
    password: ''     // Equivalente a private String password 
  });  
    
  const [loading, setLoading] = useState(false);  // Estado para mostrar spinner en el botón  
  const [errors, setErrors] = useState({});   // Estado para manejar errores de validación
  
  // Redireccionar si ya está autenticado  
  useEffect(() => {  
    if (isAuthenticated) {  
      navigate('/dashboard');  
    }  
  }, [isAuthenticated, navigate]);  
  
  // Limpiar sesión al cargar - equivalente a borrarSesion() del original  
  useEffect(() => {  
    // Equivalente a p:remoteCommand name="borrarSesion()" actionListener="#{login.salir()}"  
    const clearSession = () => {  
      localStorage.clear();  
      sessionStorage.clear();  
    };  
    clearSession();  
  }, []);  
  
  const handleInputChange = (field, value) => {  
    setFormData(prev => ({ ...prev, [field]: value }));  
      
    // Limpiar error del campo cuando el usuario empiece a escribir  
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
  
  /**  
   * Maneja el proceso de login  
   * Equivalente al método entrar() en ControllerLogin.java  
   */  
  const handleLogin = async (e) => {  
    e.preventDefault();  
      
    if (!validateForm()) {  
      return;  
    }  
  
    setLoading(true);  
      
    try {  
      // Llamada al AuthContext que maneja la lógica de autenticación  
      // Equivalente a la validación en ControllerLogin.entrar()  
      const success = await login(formData.usuario, formData.password);  
        
      if (success) {  
        // Equivalente a la redirección en ControllerLogin:  
        // FacesContext.getCurrentInstance().getExternalContext().redirect(WebGenerico.contexto() + "/auth/dashboard.ca");  
        navigate('/dashboard');  
      } else {  
        showError('Usuario o contraseña incorrectos');  
      }  
    } catch (error) {  
      console.error('Error en login:', error);  
      showError('Error al iniciar sesión. Intente nuevamente.');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const showError = (message) => {  
    toast.current?.show({   
      severity: 'error',   
      summary: 'Error',   
      detail: message,  
      life: 8000   
    });  
  };  
  
  return (  
    // Estructura HTML equivalente al login.xhtml original  
    <div className="login-body">  
      <Toast ref={toast} position="top-right" life={8000} />  
        
      {/* Panel de login - equivalente a login-panel ui-fluid */}  
      <div className="login-panel ui-fluid">  
        <form onSubmit={handleLogin}>  
          <div className="grid">  
            {/* Logo y títulos - equivalente a logo-container */}  
            <div className="col-12 logo-container">  
              <img   
                src={logo}   
                alt="Logo"   
              />  
              <h1>Login To Your Account</h1>  
              <h2>WELCOME</h2>  
            </div>  
  
            {/* Campo Usuario - equivalente a p:inputText placeholder="Usuario" */}  
            <div className="col-12">  
              <InputText  
                placeholder="Usuario"  
                value={formData.usuario}  
                onChange={(e) => handleInputChange('usuario', e.target.value)}  
                className={errors.usuario ? 'p-invalid' : ''}  
                disabled={loading}  
              />  
              {errors.usuario && (  
                <small className="p-error">{errors.usuario}</small>  
              )}  
            </div>  
  
            {/* Campo Contraseña - equivalente a p:password placeholder="Contraseña" */}  
            <div className="col-12">  
              <Password  
                placeholder="Contraseña"  
                value={formData.password}  
                onChange={(e) => handleInputChange('password', e.target.value)}  
                className={errors.password ? 'p-invalid' : ''}  
                feedback={false}  
                toggleMask  
                disabled={loading}  
              />  
              {errors.password && (  
                <small className="p-error">{errors.password}</small>  
              )}  
            </div>  
  
            {/* Botón de login - equivalente a p:commandButton actionListener="#{login.entrar()}" */}  
            <div className="col-12 button-container">  
              <Button  
                type="submit"  
                label="Entrar"  
                icon="pi pi-user"  
                className="ui-button-success rounded-button ui-button-raised"  
                loading={loading}  
                disabled={loading}  
              />  
            </div>  
          </div>  
        </form>  
      </div>  
    </div>  
  );  
};  
  
export default Login;