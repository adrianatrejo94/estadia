import React, { useEffect, useState, useRef } from 'react';  
  
const VeronaGrowl = ({ messages, onRemove }) => {  
  const [visibleMessages, setVisibleMessages] = useState([]);  
  const timeoutsRef = useRef(new Map());  
  
  useEffect(() => {  
    // Procesar solo mensajes nuevos  
    const newMessages = messages.filter(msg =>   
      !visibleMessages.find(vm => vm.id === msg.id)  
    );  
      
    if (newMessages.length > 0) {  
      setVisibleMessages(prev => [...prev, ...newMessages]);  
        
      // Crear timeout solo para mensajes nuevos  
      newMessages.forEach((message) => {  
        const timeoutId = setTimeout(() => {  
          onRemove(message.id);  
          timeoutsRef.current.delete(message.id);  
        }, 5000); // Respeta los 5 segundos  
          
        timeoutsRef.current.set(message.id, timeoutId);  
      });  
    }  
  }, [messages]);  
  
  // Limpiar mensajes removidos  
  useEffect(() => {  
    setVisibleMessages(prev =>   
      prev.filter(vm => {  
        const exists = messages.find(m => m.id === vm.id);  
        if (!exists && timeoutsRef.current.has(vm.id)) {  
          clearTimeout(timeoutsRef.current.get(vm.id));  
          timeoutsRef.current.delete(vm.id);  
        }  
        return exists;  
      })  
    );  
  }, [messages]);  
  
  // Limpiar timeouts al desmontar  
  useEffect(() => {  
    return () => {  
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));  
    };  
  }, []);  
  
  const getSeverityClass = (severity) => {  
    switch (severity) {  
      case 'success': return 'ui-growl-success';  
      case 'info': return 'ui-growl-info';  
      case 'warn': return 'ui-growl-warn';  
      case 'error': return 'ui-growl-error';  
      default: return 'ui-growl-info';  
    }  
  };  
  
  return (  
    <div className="ui-growl" style={{   
      position: 'fixed',   
      top: '85px',   
      right: '20px',   
      zIndex: 9999   
    }}>  
      {visibleMessages.map((message) => (  
        <div   
          key={message.id}   
          className={`ui-growl-item-container ${getSeverityClass(message.severity)} growl-animate-in`}  
        >  
          <div className="ui-growl-item">  
            <div className="ui-growl-image"></div>  
            <div style={{   
              display: 'inline-block',   
              verticalAlign: 'top',   
              marginLeft: '0.5rem',  
              flex: 1  
            }}>  
              <div style={{ fontWeight: 'bold' }}>{message.summary}</div>  
              <div>{message.detail}</div>  
            </div>  
            <button   
              className="ui-icon-closethick"  
              onClick={() => onRemove(message.id)}  
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}  
            />  
          </div>  
        </div>  
      ))}  
    </div>  
  );  
};  
  
export default VeronaGrowl;