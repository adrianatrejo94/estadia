import React, { Children } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ Children }) => {
    const { isAuthenticated, loading } = useAuth();

    if ( loading ) {
        return <div>Cargando...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace/>;

};

export default ProtectedRoute;