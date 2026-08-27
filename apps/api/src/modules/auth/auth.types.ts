export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}
