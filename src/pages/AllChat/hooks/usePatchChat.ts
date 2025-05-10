import { CreateChatRequest, ChatResponse, PatchChatRequest } from "@/entities/Chat";
import { apiInstance } from "@/shared/api/apiConfig";
import { getToken } from "@/shared/services/authService";
import { useMutation } from "@tanstack/react-query";

export const usePatchChat = () => {
  return useMutation<ChatResponse, Error, PatchChatRequest>({
    mutationKey: ["editChat"],
    mutationFn: async (payload) => {
      const token = getToken();
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      console.log("payload", payload);
      const response = await apiInstance.patch("/chat", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("edit chat successful", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("edit succes chat!");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.detail);
      } else {
        console.error("Ошибка при edit chat:", error);
      }
    },
  });
};
