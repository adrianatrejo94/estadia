import React, { useState, useEffect, useMemo } from 'react';  
import '../../assets/primefaces-verona-green/theme.css'; 
//import '../../styles/components/DataTable.css';  
  
const DataTable = ({  
    data = [],  //datos a mostrar en la tabla  
    columns = [],  //columnas definidas  
    paginator = true,  //activar/desactivar paginacion  
    rows = 10,  //filas por pagina  
    selection = null,  //filas seleccionadas  
    onSelectionChange = () => { },  //funcion llamada al cambiar seleccion  
    selectionMode = 'multiple', // 'single' | 'multiple'    
    globalFilter = true,  // Activa o desactiva filtro global  
    sortable = true,    // Activa ordenamiento por columnas  
    reflow = true,     // Controla el reflow para responsividad  
    emptyMessage = 'No hay registros para mostrar',  
    className = '',  
    expandableRows = false,  
    rowExpansionTemplate = null,  
    onRowToggle = () => { }     // Función llamada al expandir/colapsar fila  
}) => {  
    const [currentPage, setCurrentPage] = useState(0);  
    const [sortField, setSortField] = useState(null);  
    const [sortOrder, setSortOrder] = useState(1); // 1 for asc, -1 for desc    
    const [globalFilterValue, setGlobalFilterValue] = useState('');  
    const [selectedRows, setSelectedRows] = useState(selection || []);  
    const [expandedRows, setExpandedRows] = useState({});  
  
    // Filtrado global basado en el arquetipo    
    const filteredData = useMemo(() => {  
        if (!globalFilterValue) return data;  
  
        return data.filter(item =>  
            Object.values(item).some(value =>  
                value?.toString().toLowerCase().includes(globalFilterValue.toLowerCase())  
            )  
        );  
    }, [data, globalFilterValue]);  
  
    // Ordena los datos si hay un campo seleccionado para ordenar    
    const sortedData = useMemo(() => {  
        if (!sortField) return filteredData;  
  
        return [...filteredData].sort((a, b) => {  
            const aVal = getNestedValue(a, sortField);  
            const bVal = getNestedValue(b, sortField);  
  
            if (aVal < bVal) return -1 * sortOrder;  
            if (aVal > bVal) return 1 * sortOrder;  
            return 0;  
        });  
    }, [filteredData, sortField, sortOrder]);  
  
    // Divide los datos según la página actual y cantidad de filas    
    const paginatedData = useMemo(() => {  
        if (!paginator) return sortedData;  
  
        const start = currentPage * rows;  
        const end = start + rows;  
        return sortedData.slice(start, end);  
    }, [sortedData, currentPage, rows, paginator]);  
  
    const totalPages = Math.ceil(sortedData.length / rows);  //Total de paginas  
  
    const getNestedValue = (obj, path) => {  
        return path.split('.').reduce((o, p) => o?.[p], obj);  
    };  
      
    // Cambia el ordenamiento de columnas  
    const handleSort = (field) => {  
        if (!sortable) return;  
  
        if (sortField === field) {  
            setSortOrder(sortOrder * -1);  
        } else {  
            setSortField(field);  
            setSortOrder(1);  
        }  
    };  
      
    // Maneja la selección de filas  
    const handleRowSelection = (row, isSelected) => {  
        let newSelection;  
  
        if (selectionMode === 'single') {  
            newSelection = isSelected ? [row] : [];  
        } else {  
            if (isSelected) {  
                newSelection = [...selectedRows, row];  
            } else {  
                newSelection = selectedRows.filter(r => r.id !== row.id);  
            }  
        }  
  
        setSelectedRows(newSelection);  
        onSelectionChange(newSelection);  
    };  
  
    // Selecciona/deselecciona todos los elementos visibles  
    const handleSelectAll = (isSelected) => {  
        if (selectionMode !== 'multiple') return;  
  
        const newSelection = isSelected ? [...paginatedData] : [];  
        setSelectedRows(newSelection);  
        onSelectionChange(newSelection);  
    };  
  
    const isRowSelected = (row) => {  
        return selectedRows.some(r => r.id === row.id);  
    };  
      
    // Expande/colapsa una fila  
    const toggleRowExpansion = (row) => {  
        const newExpandedRows = { ...expandedRows };  
        if (newExpandedRows[row.id]) {  
            delete newExpandedRows[row.id];  
        } else {  
            newExpandedRows[row.id] = true;  
        }  
        setExpandedRows(newExpandedRows);  
        onRowToggle(row);  
    };  
  
    // Componente de paginación con estilos Verona  
    const renderPaginator = () => {  
        if (!paginator || totalPages <= 1) return null;  
  
        const startRecord = currentPage * rows + 1;  
        const endRecord = Math.min((currentPage + 1) * rows, sortedData.length);  
  
        return (  
            <div className="ui-datatable-footer ui-widget-header ui-corner-bottom">  
                <div className="ui-paginator ui-paginator-bottom ui-widget-header ui-corner-all">  
                    <div className="paginator-left">  
                        <select  
                            value={rows}  
                            onChange={(e) => {  
                                setCurrentPage(0);  
                            }}  
                            className="ui-paginator-rpp-options"  
                        >  
                            <option value={5}>5</option>  
                            <option value={10}>10</option>  
                            <option value={15}>15</option>  
                        </select>  
                        <span className="ui-paginator-current">  
                            {startRecord}-{endRecord} de {sortedData.length} registros  
                        </span>  
                    </div>  
  
                    <div className="paginator-right">  
                        <button  
                            onClick={() => setCurrentPage(0)}  
                            disabled={currentPage === 0}  
                            className="paginator-button"  
                        >  
                            ⟪  
                        </button>  
                        <button  
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}  
                            disabled={currentPage === 0}  
                            className="paginator-button"  
                        >  
                            ⟨  
                        </button>  
  
                        {Array.from({ length: totalPages }, (_, i) => (  
                            <button  
                                key={i}  
                                onClick={() => setCurrentPage(i)}  
                                className={`paginator-button ${currentPage === i ? 'active' : ''}`}  
                            >  
                                {i + 1}  
                            </button>  
                        ))}  
  
                        <button  
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}  
                            disabled={currentPage === totalPages - 1}  
                            className="paginator-button"  
                        >  
                            ⟩  
                        </button>  
                        <button  
                            onClick={() => setCurrentPage(totalPages - 1)}  
                            disabled={currentPage === totalPages - 1}  
                            className="paginator-button"  
                        >  
                            ⟫  
                        </button>  
                    </div>  
                </div>  
            </div>  
        );  
    };  
  
    return (  
        <div className={`ui-datatable ui-widget ${className} ${reflow ? 'reflow' : ''}`}>  
            {/* Header con filtro global - basado en el arquetipo */}  
            {globalFilter && (  
                <div className="datatable-header sinFondo">  
                    <div id="filtroTablaTareasGenerales">                         
                        <input  
                            type="text"  
                            id="globalFilter"  
                            placeholder="Búsqueda global"  
                            value={globalFilterValue}  
                            onChange={(e) => setGlobalFilterValue(e.target.value)}  
                            className="global-filter"  
                            style={{ width: '25%', marginLeft: '75%' }}  
                        />                       
                    </div>  
                </div>  
            )}  
  
            <div className="datatable-content">  
                <table className="ui-datatable-data ui-widget-content">  
                    <thead className="ui-datatable-thead">  
                        <tr>  
                            {/* Columna de selección múltiple */}  
                            {selectionMode === 'multiple' && (  
                                <th className="selection-column ui-state-default">  
                                    <input  
                                        type="checkbox"  
                                        onChange={(e) => handleSelectAll(e.target.checked)}  
                                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}  
                                    />  
                                </th>  
                            )}  
  
                            {/* Columna de expansión */}  
                            {expandableRows && (  
                                <th className="expansion-column ui-state-default" style={{ width: '2rem' }}>  
                                </th>  
                            )}  
  
                            {/* Columnas de datos */}  
                            {columns.map((col, index) => (  
                                <th  
                                    key={index}  
                                    className={`ui-state-default ${col.className || ''} ${col.sortable !== false && sortable ? 'sortable' : ''}`}  
                                    style={col.style}  
                                    onClick={() => col.sortable !== false && handleSort(col.field)}  
                                >  
                                    {col.header}  
                                    {col.sortable !== false && sortable && sortField === col.field && (  
                                        <span className={`sort-icon ${sortOrder === 1 ? 'asc' : 'desc'}`}>  
                                            {sortOrder === 1 ? '↑' : '↓'}  
                                        </span>  
                                    )}  
                                </th>  
                            ))}  
                        </tr>  
                    </thead>  
  
                    <tbody className="ui-datatable-data ui-widget-content">  
                        {paginatedData.length === 0 ? (  
                            <tr>  
                                <td colSpan={columns.length + (selectionMode === 'multiple' ? 1 : 0) + (expandableRows ? 1 : 0)}>  
                                    {emptyMessage}  
                                </td>  
                            </tr>  
                        ) : (  
                            paginatedData.map((row, rowIndex) => (  
                                <React.Fragment key={row.id || rowIndex}>  
                                    <tr className={`${isRowSelected(row) ? 'selected' : ''} ${rowIndex % 2 === 0 ? 'ui-datatable-even' : 'ui-datatable-odd'}`}>  
                                        {/* Celda de selección */}  
                                        {selectionMode === 'multiple' && (  
                                            <td className="selection-column">  
                                                <input  
                                                    type="checkbox"  
                                                    checked={isRowSelected(row)}  
                                                    onChange={(e) => handleRowSelection(row, e.target.checked)}  
                                                />  
                                            </td>  
                                        )}  
  
                                        {/* Celda de expansión */}  
                                        {expandableRows && (  
                                            <td className="expansion-column">  
                                                <button  
                                                    onClick={() => toggleRowExpansion(row)}  
                                                    className="row-toggler"  
                                                >  
                                                    {expandedRows[row.id] ? '−' : '+'}  
                                                </button>  
                                            </td>  
                                        )}  
  
                                        {/* Celdas de datos */}  
                                        {columns.map((col, colIndex) => (  
                                            <td  
                                                key={colIndex}  
                                                className={col.className || ''}  
                                                style={col.style}  
                                            >  
                                                {col.body ?  
                                                    col.body(row) :  
                                                    getNestedValue(row, col.field)  
                                                }  
                                            </td>  
                                        ))}  
                                    </tr>  
  
                                    {/* Fila expandida */}  
                                    {expandableRows && expandedRows[row.id] && rowExpansionTemplate && (  
                                        <tr className="expanded-row">  
                                            <td colSpan={columns.length + (selectionMode === 'multiple' ? 1 : 0) + 1}>  
                                                {rowExpansionTemplate(row)}  
                                            </td>  
                                        </tr>  
                                    )}  
                                </React.Fragment>  
                            ))  
                        )}  
                    </tbody>  
                </table>  
            </div>  
  
            {renderPaginator()}  
        </div>  
    );  
};  
  
export default DataTable;