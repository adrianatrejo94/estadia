import React from 'react';    
import ReactDOM from 'react-dom/client';  
import { HelmetProvider } from 'react-helmet-async'     
import App from './App.jsx';  
import './assets/primefaces-verona-bluegrey/theme.css';
import 'primereact/resources/primereact.min.css';    
import 'primeicons/primeicons.css';   
import './assets/verona-layout/css/primeicons.css';
import './assets/verona-layout/css/primeflex.min.css'
import './assets/verona-layout/css/layout-bluegrey.css'; 

//import './assets/verona-layout/css/estilosBase.css';  


import './assets/sass/variables/_theme.scss';
import './assets/sass/theme/designer/_components.scss';  


  
ReactDOM.createRoot(document.getElementById('root')).render(    
  <React.StrictMode>    
    <HelmetProvider>  
      <App />  
    </HelmetProvider>  
  </React.StrictMode>,  
);