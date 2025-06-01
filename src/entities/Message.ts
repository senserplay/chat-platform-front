export interface MessageResponse {
  username:string;
  message:MessageInterface
}
export interface CreateMessage {
  chat_uuid: string;
  text: string;
}
export interface MessageInterface{
  id: number;
  user_id: number;
  chat_uuid: string;
  text: string;
  created_at: string;
}