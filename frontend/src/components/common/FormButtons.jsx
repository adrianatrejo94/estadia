// BotonesFormulario.jsx
import React from 'react';
import { Button } from 'primereact/button';

/**
 * Componente que replica el comportamiento del archivo compuesto JSF "cmp:botonesFormulario".
 * Está diseñado para mostrar:
 * - Un botón "Nuevo" (como en <p:commandButton>) alineado a la izquierda
 * - Botones de "Guardar" y "Cancelar" alineados a la derecha (como los botones de formulario)
 * 
 * Props:
 * @param {Function} onAdd - Acción que se ejecuta al hacer clic en "Nuevo" (equivalente a cc.attrs.actionAgregar)
 * @param {Function} onSave - Acción para guardar (crear o modificar)
 * @param {Function} onCancel - Acción para cancelar el formulario
 * @param {boolean} isEditing - Define si se está editando (cambia el texto de "Guardar" a "Modificar")
 * @param {boolean} loading - Indica si el botón está cargando (PrimeReact lo muestra con spinner)
 * @param {boolean} disabled - Desactiva los botones
 * @param {string} nombreBoton - Texto personalizado para el botón "Nuevo" (equivalente a cc.attrs.nombreBoton)
 * @param {boolean} mostrarNuevo - Muestra u oculta el botón "Nuevo"
 * @param {boolean} mostrarGuardar - Muestra u oculta el botón "Guardar"
 * @param {boolean} mostrarCancelar - Muestra u oculta el botón "Cancelar"
 * @param {string} className - Clases CSS extra para personalizar el contenedor
 */

const BotonesFormulario = ({
  onAdd,
  onSave,
  onCancel,
  isEditing = false,
  loading = false,
  disabled = false,
  nombreBoton = 'Nuevo',
  mostrarNuevo = true,
  mostrarGuardar = true,
  mostrarCancelar = true,
  className = ''
}) => {
  return (
    // Contenedor general, alineado a la izquierda por defecto
    <div className={`form-buttons p-d-flex p-ai-center p-jc-start ${className}`}>

      {/* BOTÓN NUEVO — Equivalente a <p:commandButton value="#{cc.attrs.nombreBoton}"> */}
      {mostrarNuevo && onAdd && (
        <Button
          label={nombreBoton}
          icon="pi pi-plus-circle" // ícono idéntico al de PrimeFaces
          className="p-button-info p-mr-2 p-mb-2"
          onClick={onAdd}
          title="Agregar un nuevo registro"
          disabled={disabled || loading}
          type="button"
        />
      )}

      {/* BOTONES DEL FORMULARIO: Cancelar y Guardar, alineados a la derecha */}
      <div className="p-ml-auto p-d-flex p-ai-center">
        {/* BOTÓN CANCELAR */}
        {mostrarCancelar && onCancel && (
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-secondary p-mr-2"
            onClick={onCancel}
            disabled={loading}
            type="button"
          />
        )}

        {/* BOTÓN GUARDAR / MODIFICAR */}
        {mostrarGuardar && onSave && (
          <Button
            label={isEditing ? 'Modificar' : 'Guardar'}
            icon="pi pi-check"
            className="p-button-success"
            onClick={onSave}
            disabled={disabled || loading}
            loading={loading}
            type="submit"
          />
        )}
      </div>
    </div>
  );
};

export default BotonesFormulario;
