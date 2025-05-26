import { InviteResponse } from "@/entities/Invite";
import { apiInstance } from "@/shared/api/apiConfig";
import { getToken } from "@/shared/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useInviteUser = (token_invite:string) => {
  return useMutation<InviteResponse, Error, void>({
    mutationKey: ["inviteUser"],
    mutationFn: async () => {
      const token = getToken();
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      const response = await apiInstance.post(`/invite/accept/${token_invite}`, undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("invite user data", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("inxite user success!");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.detail);
      } else {
        console.error("invite user error:", error);
      }
    },
  });
};
