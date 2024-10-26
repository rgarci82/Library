import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAdmin: boolean;
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAdmin, element }) => {
  return isAdmin ? element : <Navigate to="/adminLogin" />;
};

export default ProtectedRoute;