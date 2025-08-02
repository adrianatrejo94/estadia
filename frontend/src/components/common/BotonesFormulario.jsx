import React from 'react';  
import { Button } from 'primereact/button';  
  
const BotonesFormulario = ({    
  onAdd,           // ← Agregada para el botón Nuevo  
  onSave,    
  onCancel,    
  isEditing = false,    
  loading = false,    
  disabled = false,    
  nombreBoton = "Nuevo",  // ← Corregido el typo  
  mostrarNuevo = true,    // ← Agregada para controlar visibilidad  
  mostrarGuardar = true,    
  mostrarCancelar = true    
}) => {    
  return (    
    <>    
      {/* BOTÓN NUEVO - Como en cmp:botonAgregarNuevo */}  
      {mostrarNuevo && onAdd && (  
        <div style={{ marginBottom: '1rem' }}>  
          <Button  
            label={nombreBoton}  
            icon="pi pi-plus-circle"  
            className="ui-button-info p-mr-2 p-mb-2"  
            onClick={onAdd}  
            title="Agregar un nuevo registro"  
            disabled={disabled || loading}  
            type="button"  
          />  
        </div>  
      )}  
  
      <br/>    
      <div className="ui-panelgrid ui-panelgrid-blank sinBordes"     
           style={{     
             display: 'grid',    
             gridTemplateColumns: 'repeat(2, 1fr)',    
             marginLeft: 'auto',    
             textAlign: 'left',    
             width: '18%',    
             gap: '0.5rem'    
           }}>    
            
        {/* BOTÓN CANCELAR - Exacto al arquetipo */}    
        {mostrarCancelar && onCancel && (    
          <Button    
            label="Cancelar"    
            icon="pi pi-times"    
            className="ui-button-secondary p-mr-2"    
            onClick={onCancel}    
            disabled={loading}    
            type="button"    
          />    
        )}    
    
        {/* BOTÓN GUARDAR/MODIFICAR - Exacto al arquetipo */}    
        {mostrarGuardar && onSave && (    
          <Button    
            label={isEditing ? 'Modificar' : 'Guardar'}    
            icon="pi pi-check"    
            className="ui-button-success p-mr-2 p-mb-2"    
            onClick={onSave}    
            disabled={disabled || loading}    
            loading={loading}    
            type="submit"    
          />    
        )}    
      </div>    
    </>    
  );    
};  
  
export default BotonesFormulario;