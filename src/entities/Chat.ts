export interface ChatResponse {
  uuid: string;
  title: string;
  owner_id: number;
  is_open: boolean;
  created_at: string;
  updated_at: string;
}
export interface CreateChatRequest {
  title: string;
}
export interface PatchChatRequest {
  uuid: string;
  title: string;
  is_open: boolean;
}
export interface UsersInChatResponse{
  id: number;
  username: string;
  password: string;
  email: string;
  created_at: string; 
  updated_at: string; 
}