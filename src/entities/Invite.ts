export interface InviteResponse {
  token: string;
  email: string;
  chat_uuid: string;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface InviteRequest {
  email: string;
  chat_uuid: string;
}
export interface LocationState {
  from?: { pathname: string };
}
