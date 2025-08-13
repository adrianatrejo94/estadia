import { useState, useMemo } from 'react';  
  
export const usePagination = (data, initialRows = 5) => {  
  const [currentPage, setCurrentPage] = useState(0);  
  const [rows, setRows] = useState(initialRows);  
  
  const paginatedData = useMemo(() => {  
    const start = currentPage * rows;  
    const end = start + rows;  
    return data.slice(start, end);  
  }, [data, currentPage, rows]);  
  
  const handlePageChange = (newPage) => {  
    setCurrentPage(newPage);  
  };  
  
  const handleRowsChange = (newRows) => {  
    setRows(newRows);  
    setCurrentPage(0);  
  };  
  
  return {  
    currentPage,  
    rows,  
    paginatedData,  
    handlePageChange,  
    handleRowsChange  
  };  
};