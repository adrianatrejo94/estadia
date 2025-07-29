import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  
import { AuthProvider } from './context/AuthContext';  
import Login from './pages/Login';  
import Dashboard from './pages/Dashboard';  
import UsuariosList from './pages/usuarios/UsuariosList';  
import UsuarioForm from './pages/usuarios/UsuariosForm';  
import ProtectedRoute from './components/auth/ProtectedRoute';  
  
const App = () => {  
  return (  
    <AuthProvider>  
      <Router>  
        <Routes>  
          <Route path="/login" element={<Login />} />  
          <Route path="/" element={<Navigate to="/dashboard" replace />} />  
          <Route path="/dashboard" element={  
            <ProtectedRoute><Dashboard /></ProtectedRoute>  
          } />  
          <Route path="/usuarios" element={  
            <ProtectedRoute><UsuariosList /></ProtectedRoute>  
          } />  
          <Route path="/usuarios/nuevo" element={  
            <ProtectedRoute><UsuarioForm /></ProtectedRoute>  
          } />  
          <Route path="/usuarios/editar/:id" element={  
            <ProtectedRoute><UsuarioForm /></ProtectedRoute>  
          } />  
        </Routes>  
      </Router>  
    </AuthProvider>  
  );  
};  
  
export default App;