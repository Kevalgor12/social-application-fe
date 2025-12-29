import type { JSX } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../store/hooks";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
