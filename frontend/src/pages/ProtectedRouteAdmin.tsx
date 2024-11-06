import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {

  const token = localStorage.getItem("token")
  return localStorage.getItem("isAdmin") == "True" ? element : <Navigate to="/adminLogin" />;
};

export default ProtectedRoute;