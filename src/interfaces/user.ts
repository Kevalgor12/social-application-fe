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
