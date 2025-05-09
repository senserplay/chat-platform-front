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
