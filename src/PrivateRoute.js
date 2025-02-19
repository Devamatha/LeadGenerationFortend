import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element: Component, requiredRole, ...rest }) => {
  const role = sessionStorage.getItem("role");
  const jwt = sessionStorage.getItem("jwt");

  const isTokenValid = () => {
    if (jwt) {
      try {
        const decodedToken = jwtDecode(jwt);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      } catch (error) {
        console.error("Invalid token:", error);
        return false;
      }
    }
    return false;
  };
  if (!role && !jwt) {
    sessionStorage.clear();
    localStorage.clear();
    return <Navigate to="/" replace={true} />;
  }
  if (!jwt || !isTokenValid()) {
    sessionStorage.clear();
    localStorage.clear();
    return <Navigate to="/" replace={true} />;
  }
  if (!requiredRole && role !== requiredRole && !jwt) {
    sessionStorage.clear();
    localStorage.clear();
    return <Navigate to="/" replace={true} />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
