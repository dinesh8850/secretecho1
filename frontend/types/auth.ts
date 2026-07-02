export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface AuthError {
  message: string;
}
