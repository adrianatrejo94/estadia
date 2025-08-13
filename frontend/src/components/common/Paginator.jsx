import React from 'react';  
  
const Paginator = ({  
  data = [],  
  currentPage = 0,  
  rows = 5,  
  onPageChange,  
  onRowsChange  
}) => {  
  const totalPages = Math.ceil(data.length / rows);  
    
  if (data.length <= rows) return null;  
  
  const startRecord = currentPage * rows + 1;  
  const endRecord = Math.min((currentPage + 1) * rows, data.length);  
  
  return (  
    <div className="ui-datatable-footer ui-widget-header ui-corner-bottom">  
      <div className="ui-paginator ui-paginator-bottom ui-widget-header ui-corner-all">  
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>  
            
          {/* Lado izquierdo - Selector de filas y contador */}  
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>  
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>  
              <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Mostrar:</span>  
              <select  
                value={rows}  
                onChange={(e) => {  
                  onRowsChange(parseInt(e.target.value));  
                  onPageChange(0);  
                }}  
                className="ui-paginator-rpp-options"  
                style={{  
                  padding: '0.25rem 0.5rem',  
                  border: '1px solid #e9ecef',  
                  borderRadius: '3px',  
                  backgroundColor: '#ffffff',  
                  fontSize: '0.9rem'  
                }}  
              >  
                <option value={5}>5</option>  
                <option value={10}>10</option>  
                <option value={15}>15</option>  
                <option value={25}>25</option>  
              </select>  
              <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>registros</span>  
            </div>  
              
            <span className="ui-paginator-current" style={{   
              fontSize: '0.9rem',   
              color: '#495057',  
              fontWeight: '500'  
            }}>  
              {startRecord}-{endRecord} de {data.length} registros  
            </span>  
          </div>  
  
          {/* Lado derecho - Controles de navegación */}  
          <div className="ui-paginator-pages" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>  
            {/* Primera página */}  
            <button  
              onClick={() => onPageChange(0)}  
              disabled={currentPage === 0}  
              className={`ui-paginator-first ${currentPage === 0 ? 'ui-state-disabled' : ''}`}  
              style={{  
                width: '2.286em',  
                height: '2.286em',  
                border: '1px solid transparent',  
                borderRadius: '3px',  
                backgroundColor: currentPage === 0 ? '#f8f9fa' : '#ffffff',  
                color: currentPage === 0 ? '#adb5bd' : '#6c757d',  
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',  
                display: 'flex',  
                alignItems: 'center',  
                justifyContent: 'center',  
                fontSize: '1rem',  
                transition: 'all 0.2s'  
              }}  
              onMouseEnter={(e) => {  
                if (currentPage !== 0) {  
                  e.target.style.backgroundColor = '#e9ecef';  
                  e.target.style.color = '#495057';  
                }  
              }}  
              onMouseLeave={(e) => {  
                if (currentPage !== 0) {  
                  e.target.style.backgroundColor = '#ffffff';  
                  e.target.style.color = '#6c757d';  
                }  
              }}  
            >  
              ⟪  
            </button>  
  
            {/* Página anterior */}  
            <button  
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}  
              disabled={currentPage === 0}  
              className={`ui-paginator-prev ${currentPage === 0 ? 'ui-state-disabled' : ''}`}  
              style={{  
                width: '2.286em',  
                height: '2.286em',  
                border: '1px solid transparent',  
                borderRadius: '3px',  
                backgroundColor: currentPage === 0 ? '#f8f9fa' : '#ffffff',  
                color: currentPage === 0 ? '#adb5bd' : '#6c757d',  
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',  
                display: 'flex',  
                alignItems: 'center',  
                justifyContent: 'center',  
                fontSize: '1rem',  
                transition: 'all 0.2s'  
              }}  
              onMouseEnter={(e) => {  
                if (currentPage !== 0) {  
                  e.target.style.backgroundColor = '#e9ecef';  
                  e.target.style.color = '#495057';  
                }  
              }}  
              onMouseLeave={(e) => {  
                if (currentPage !== 0) {  
                  e.target.style.backgroundColor = '#ffffff';  
                  e.target.style.color = '#6c757d';  
                }  
              }}  
            >  
              ⟨  
            </button>  
  
            {/* Números de página */}  
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {  
              let pageNum;  
              if (totalPages <= 7) {  
                pageNum = i;  
              } else if (currentPage < 4) {  
                pageNum = i;  
              } else if (currentPage > totalPages - 4) {  
                pageNum = totalPages - 7 + i;  
              } else {  
                pageNum = currentPage - 3 + i;  
              }  
  
              return (  
                <button  
                  key={pageNum}  
                  onClick={() => onPageChange(pageNum)}  
                  className={`ui-paginator-page ${currentPage === pageNum ? 'ui-state-active' : ''}`}  
                  style={{  
                    minWidth: '2.286em',  
                    height: '2.286em',  
                    border: '1px solid transparent',  
                    borderRadius: '3px',  
                    backgroundColor: currentPage === pageNum ? '#f7cb00' : '#ffffff',  
                    color: currentPage === pageNum ? '#2d353c' : '#6c757d',  
                    cursor: 'pointer',  
                    display: 'flex',  
                    alignItems: 'center',  
                    justifyContent: 'center',  
                    fontSize: '0.9rem',  
                    fontWeight: currentPage === pageNum ? '600' : '400',  
                    transition: 'all 0.2s',  
                    padding: '0 0.5rem'  
                  }}  
                  onMouseEnter={(e) => {  
                    if (currentPage !== pageNum) {  
                      e.target.style.backgroundColor = '#e9ecef';  
                      e.target.style.color = '#495057';  
                    }  
                  }}  
                  onMouseLeave={(e) => {  
                    if (currentPage !== pageNum) {  
                      e.target.style.backgroundColor = '#ffffff';  
                      e.target.style.color = '#6c757d';  
                    }  
                  }}  
                >  
                  {pageNum + 1}  
                </button>  
              );  
            })}  
  
            {/* Página siguiente */}  
            <button  
              onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}  
              disabled={currentPage === totalPages - 1}  
              className={`ui-paginator-next ${currentPage === totalPages - 1 ? 'ui-state-disabled' : ''}`}  
              style={{  
                width: '2.286em',  
                height: '2.286em',  
                border: '1px solid transparent',  
                borderRadius: '3px',  
                backgroundColor: currentPage === totalPages - 1 ? '#f8f9fa' : '#ffffff',  
                color: currentPage === totalPages - 1 ? '#adb5bd' : '#6c757d',  
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',  
                display: 'flex',  
                alignItems: 'center',  
                justifyContent: 'center',  
                fontSize: '1rem',  
                transition: 'all 0.2s'  
              }}  
              onMouseEnter={(e) => {  
                if (currentPage !== totalPages - 1) {  
                  e.target.style.backgroundColor = '#e9ecef';  
                  e.target.style.color = '#495057';  
                }  
              }}  
              onMouseLeave={(e) => {  
                if (currentPage !== totalPages - 1) {  
                  e.target.style.backgroundColor = '#ffffff';  
                  e.target.style.color = '#6c757d';  
                }  
              }}  
            >  
              ⟩  
            </button>  
  
            {/* Última página */}  
            <button  
              onClick={() => onPageChange(totalPages - 1)}  
              disabled={currentPage === totalPages - 1}  
              className={`ui-paginator-last ${currentPage === totalPages - 1 ? 'ui-state-disabled' : ''}`}  
              style={{  
                width: '2.286em',  
                height: '2.286em',  
                border: '1px solid transparent',  
                borderRadius: '3px',  
                backgroundColor: currentPage === totalPages - 1 ? '#f8f9fa' : '#ffffff',  
                color: currentPage === totalPages - 1 ? '#adb5bd' : '#6c757d',  
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',  
                display: 'flex',  
                alignItems: 'center',  
                justifyContent: 'center',  
                fontSize: '1rem',  
                transition: 'all 0.2s'  
              }}  
              onMouseEnter={(e) => {  
                if (currentPage !== totalPages - 1) {  
                  e.target.style.backgroundColor = '#e9ecef';  
                  e.target.style.color = '#495057';  
                }  
              }}  
              onMouseLeave={(e) => {  
                if (currentPage !== totalPages - 1) {  
                  e.target.style.backgroundColor = '#ffffff';  
                  e.target.style.color = '#6c757d';  
                }  
              }}  
            >  
              ⟫  
            </button>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  
  
export default Paginator;