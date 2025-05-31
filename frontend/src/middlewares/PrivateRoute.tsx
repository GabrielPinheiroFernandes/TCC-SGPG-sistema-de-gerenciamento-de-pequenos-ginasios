import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");

  // Se não tiver token, redireciona para login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Senão, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default PrivateRoute;
