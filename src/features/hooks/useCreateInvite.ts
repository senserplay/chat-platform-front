import { InviteRequest, InviteResponse } from "@/entities/Invite";
import { apiInstance } from "@/shared/api/apiConfig";
import { getToken } from "@/shared/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useCreateInvite = () => {
  return useMutation<InviteResponse, Error, InviteRequest>({
    mutationKey: ["createInvite"],
    mutationFn: async (payload) => {
      const token = getToken();
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      console.log("create invite payload", payload);
      const response = await apiInstance.post("/invite", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("create invite", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Создался новoe invite!");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.detail);
      } else {
        console.error("Ошибка при создании invite:", error);
      }
    },
  });
};
