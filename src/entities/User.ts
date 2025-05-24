export interface UserResponse {
  username: string;
  password: string;
  id: number;
  updated_at: string;
  email: string;
  created_at: string;
}
export interface UpdateUserRequest {
  username: string;
  password: string;
}
