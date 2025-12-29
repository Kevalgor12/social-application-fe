export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface AuthData {
  user: User;
  accessToken: string;
  tokenType: "Bearer";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}
