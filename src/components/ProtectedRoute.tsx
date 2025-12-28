import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" />;
}
