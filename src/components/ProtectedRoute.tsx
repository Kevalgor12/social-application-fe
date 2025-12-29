import type { JSX } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../store/hooks";

export default function ProtectedRoute({
  children,
  navigateTo,
}: {
  children: JSX.Element;
  navigateTo?: string;
}) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to={navigateTo || "/login"} />;
}
