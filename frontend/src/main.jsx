import React from 'react';  
import ReactDOM from 'react-dom/client';  
import App from './App.jsx';
import './assets/primefaces-verona-green/theme.css';  
import 'primereact/resources/primereact.min.css';  
import 'primeicons/primeicons.css';  
import './assets/verona-layout/css/layout-bluegrey.css'; 
import './assets/verona-layout/css/estilosBase.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(  
  <React.StrictMode>  
    <App />  
  </React.StrictMode>,  
);