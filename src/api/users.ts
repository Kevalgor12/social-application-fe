import type { PostListResponse } from "./posts";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  countryCode: string | null;
  mobile: string | null;
  email: string;
  address: string | null;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export async function getUser(): Promise<ProfileResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/users/profile`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function updateUser(data: {
  firstName: string;
  lastName: string;
  countryCode: string;
  mobile: string;
  address: string;
}): Promise<ProfileResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/users/profile`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Update profile failed");
  const result = await res.json();
  return result;
}

export async function getUsersPosts(): Promise<PostListResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/posts`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch users posts");
  return res.json();
}
