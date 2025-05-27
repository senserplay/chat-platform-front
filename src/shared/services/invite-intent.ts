export const saveInviteIntent = (token: string) => {
    sessionStorage.setItem("inviteToken", token);
    sessionStorage.setItem("invitePending", "1");
  };
  export const clearInviteIntent = () => {
    sessionStorage.removeItem("inviteToken");
    sessionStorage.removeItem("invitePending");
  };
  export const getInviteIntent = (): string | null => {
    return sessionStorage.getItem("inviteToken");
  };
  export const hasInvitePending = (): boolean => {
    return sessionStorage.getItem("invitePending") === "1";
  };