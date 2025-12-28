import type { AuthResponse, RegisterResponse } from "../store/authSlice";

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log(result);

  if (!res.ok) throw new Error("Login failed");

  return result;
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<RegisterResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Register failed");
  const result = await res.json();
  return result;
}

export async function signout(): Promise<AuthResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");
  const result = await res.json();
  return result;
}
