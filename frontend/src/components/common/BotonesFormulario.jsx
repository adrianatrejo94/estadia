import React from 'react'; 
import '../../assets/primefaces-verona-bluegrey/theme.css'; 
  
const BotonesFormulario = ({  
  onAdd,  
  onSave,  
  onCancel,  
  isEditing = false,  
  loading = false,  
  disabled = false,  
  nombreBoton = "Nuevo",  
  mostrarNuevo = true,  
  mostrarGuardar = true,  
  mostrarCancelar = true  
}) => {  
  return (  
    <>  
      {/* BOTÓN NUEVO */}  
      {mostrarNuevo && onAdd && (  
        <div style={{ marginBottom: '1rem' }}>  
          <button  
            type="button"  
            className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left ui-button-info"  
            onClick={onAdd}  
            disabled={disabled || loading}  
            title="Agregar un nuevo registro"  
          >  
            <span className="ui-button-icon-left pi pi-plus-circle"></span>  
            <span className="ui-button-text">{nombreBoton}</span>  
          </button>  
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
  
        {/* BOTÓN CANCELAR */}  
        {mostrarCancelar && onCancel && (  
          <button  
            type="button"  
            className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left ui-button-danger"  
            onClick={onCancel}  
            disabled={loading}  
          >  
            <span className="ui-button-icon-left pi pi-times"></span>  
            <span className="ui-button-text">Cancelar</span>  
          </button>  
        )}  
  
        {/* BOTÓN GUARDAR/MODIFICAR */}  
        {mostrarGuardar && onSave && (  
          <button  
            type="submit"  
            className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left ui-button-success"  
            onClick={onSave}  
            disabled={disabled || loading}  
          >  
            <span className="ui-button-icon-left pi pi-check"></span>  
            <span className="ui-button-text">{isEditing ? 'Modificar' : 'Guardar'}</span>  
            {loading && <span className="ui-button-icon-right pi pi-spin pi-spinner"></span>}  
          </button>  
        )}  
      </div>  
    </>  
  );  
};  
  
export default BotonesFormulario;