import React, { useState, useEffect } from 'react';  
import { PickList as PrimePickList } from 'primereact/picklist';  
import '../../assets/primefaces-verona-bluegrey/theme.css';
import '../../styles/components/PickList.css'  
  
/**  
 * Componente PickList reutilizable  
 * Equivalente a p:pickList de PrimeFaces usado en roles/formulario.xhtml  
 *   
 * Funcionalidades principales:  
 * - Selección dual de elementos (disponibles/seleccionados)  
 * - Filtros de búsqueda en ambas listas  
 * - Controles de movimiento y ordenamiento  
 * - Template personalizable para items  
 * - Responsive design  
 */  
const PickList = ({  
  source = [],  
  target = [],  
  onChange,  
  itemTemplate,  
  sourceHeader = "Disponibles",  
  targetHeader = "Seleccionados",  
  sourceStyle = { height: '300px' },  
  targetStyle = { height: '300px' },  
  showSourceControls = true,  
  showTargetControls = true,  
  sourceFilterPlaceholder = "Buscar disponibles",  
  targetFilterPlaceholder = "Buscar seleccionados",  
  showSourceFilter = true,  
  showTargetFilter = true,  
  showCheckbox = true,  
  filterMatchMode = "contains",  
  responsive = "true",  
  disabled = false,  
  required = false,  
  className = ""  
}) => {  
  const [sourceItems, setSourceItems] = useState(source);  
  const [targetItems, setTargetItems] = useState(target);  
  
  useEffect(() => {  
    setSourceItems(source);  
  }, [source]);  
  
  useEffect(() => {  
    setTargetItems(target);  
  }, [target]);  
  
  /**  
   * Maneja los cambios en el PickList  
   * Equivalente al valueChangeListener del p:pickList original  
   */  
  const handleChange = (e) => {  
    setSourceItems(e.source);  
    setTargetItems(e.target);  
      
    if (onChange) {  
      onChange({  
        source: e.source,  
        target: e.target  
      });  
    }  
  };  
  
  /**  
   * Template por defecto para items  
   * Equivalente al p:column del PickList original  
   */  
  const defaultItemTemplate = (item) => {  
    if (itemTemplate) {  
      return itemTemplate(item);  
    }  
      
    return (  
      <div className="picklist-item-content">  
        <span>{item.nombre || item.name || item.label || item.toString()}</span>  
      </div>  
    );  
  };  
  
  return (  
    <div className={`verona-picklist-wrapper ${className}`}>  
      <PrimePickList  
        source={sourceItems}  
        target={targetItems}  
        onChange={handleChange}  
        itemTemplate={defaultItemTemplate}  
        sourceHeader={sourceHeader}  
        targetHeader={targetHeader}  
        sourceStyle={sourceStyle}  
        targetStyle={targetStyle}  
        showSourceControls={showSourceControls}  
        showTargetControls={showTargetControls}  
        sourceFilterPlaceholder={sourceFilterPlaceholder}  
        targetFilterPlaceholder={targetFilterPlaceholder}  
        showSourceFilter={showSourceFilter}  
        showTargetFilter={showTargetFilter}  
        filterMatchMode={filterMatchMode}  
        responsive={responsive}  
        disabled={disabled}  
        className={`verona-picklist ${required ? 'p-invalid' : ''}`}  
      />  
    </div>  
  );  
};  
  
export default PickList;