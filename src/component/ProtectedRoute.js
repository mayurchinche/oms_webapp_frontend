import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { token, role } = useSelector((state) => state.auth);
  
    if (!token) {
      return <Navigate to="/login" />;
    }
  
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/login" />; // Redirect unauthorized users
    }
  
    return children;
  };

export default ProtectedRoute;
