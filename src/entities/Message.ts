export interface MessageResponse {
  id: number;
  user_id: number;
  chat_uuid: string;
  text: string;
  created_at: string;
}
export interface CreateMessage {
    chat_uuid: string;
    text: string;
}
