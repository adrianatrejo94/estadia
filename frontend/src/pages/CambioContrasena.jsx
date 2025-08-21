import React, { useState } from 'react';  
import { Card } from 'primereact/card';  
import { Password } from 'primereact/password';  
import { useAuth } from '../context/AuthContext';  
import { useNavigate } from 'react-router-dom';  
import Template from '../components/layout/Template';  
import BotonesFormulario from '../components/common/BotonesFormulario';  
  
const CambioContrasena = () => {  
  const { updatePassword, getUserFullName } = useAuth();  
  const navigate = useNavigate();  
  const [password1, setPassword1] = useState('');  
  const [password2, setPassword2] = useState('');  
  const [loading, setLoading] = useState(false);  
    
  const showMessage = (severity, summary, detail) => {  
    window.showGlobalMessage({ severity, summary, detail });  
  };  
    
  const handleSave = async () => {  
    if (!password1 || !password2) {  
      showMessage('warn', 'Campos requeridos', 'Todos los campos son obligatorios');  
      return;  
    }  
  
    if (password1 !== password2) {  
      showMessage('error', 'Error de validación', 'Las contraseñas no coinciden');  
      return;  
    }  
  
    setLoading(true);  
    try {  
      const result = await updatePassword(password1);  
      if (result.success) {  
        showMessage('success', 'Éxito', 'Contraseña actualizada correctamente');  
        setTimeout(() => navigate('/dashboard'), 2000);  
      } else {  
        showMessage('error', 'Error', result.message || 'Error al actualizar contraseña');  
      }  
    } catch (error) {  
      showMessage('error', 'Error', 'Error al actualizar contraseña');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleCancel = () => {  
    navigate('/dashboard');  
  };  
  
  const passwordHeader = <div className="font-bold mb-3">Selecciona una contraseña</div>;  
  const passwordFooter = (  
    <>  
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>  
        <p className="mt-0 mb-2 font-semibold">Sugerencias:</p>  
        <ul className="pl-2 ml-2 mt-0 mb-0 line-height-3">  
          <li>Al menos una minúscula</li>  
          <li>Al menos una mayúscula</li>  
          <li>Al menos un número</li>  
          <li>Al menos un carácter especial</li>  
          <li>Mínimo 8 caracteres</li>  
        </ul>  
      </div>  
    </>  
  );  
  
  return (  
    <Template title="Cambio de Contraseña">  
      <div className="grid justify-content-center">  
        {/* Card más ancho: de xl:col-8 a xl:col-10 */}  
        <div className="col-12 md:col-12 lg:col-10 xl:col-10">  
          <Card   
            title="Cambio de Contraseña"   
            subTitle={`Usuario: ${getUserFullName()}`}  
            className="shadow-4 border-round-lg card"  
          >  
            <div className="p-fluid">  
              <div className="grid">  
                <div className="col-12 md:col-6">  
                  <div className="field">  
                    <label htmlFor="password1" className="block text-900 font-medium mb-2">  
                      Nueva Contraseña *  
                    </label>  
                    <Password  
                      id="password1"  
                      value={password1}  
                      onChange={(e) => setPassword1(e.target.value)}  
                      placeholder="Ingrese su nueva contraseña"  
                      toggleMask  
                      className="w-full"  
                      inputClassName="w-full p-3"  
                      feedback={true}  
                      header={passwordHeader}  
                      footer={passwordFooter}  
                      promptLabel="Ingrese una contraseña"  
                      weakLabel="Débil"  
                      mediumLabel="Medio"  
                      strongLabel="Fuerte"  
                      maxLength={12}  
                    />  
                  </div>  
                </div>  
  
                <div className="col-12 md:col-6">  
                  <div className="field">  
                    <label htmlFor="password2" className="block text-900 font-medium mb-2">  
                      Confirmar Contraseña *  
                    </label>  
                    <Password  
                      id="password2"  
                      value={password2}  
                      onChange={(e) => setPassword2(e.target.value)}  
                      placeholder="Confirme su nueva contraseña"  
                      toggleMask  
                      className="w-full"  
                      inputClassName="w-full p-3"  
                      feedback={false}  
                      maxLength={12}  
                    />  
                  </div>  
                </div>  
              </div>  
  
              {/* Removí el Divider para quitar la línea negra */}  
                
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>  
                <div style={{ width: '50%' }}>  
                  <BotonesFormulario  
                    onSave={handleSave}  
                    onCancel={handleCancel}  
                    isEditing={false}  
                    loading={loading}  
                    mostrarNuevo={false}  
                    mostrarGuardar={true}  
                    mostrarCancelar={true}  
                  />  
                </div>  
              </div>  
            </div>  
          </Card>  
        </div>  
      </div>  
    </Template>  
  );  
};  
  
export default CambioContrasena;