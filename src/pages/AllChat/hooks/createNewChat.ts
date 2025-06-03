import { CreateChatRequest, ChatResponse } from "@/entities/Chat";
import { apiInstance } from "@/shared/api/apiConfig";
import { getToken } from "@/shared/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useCreateNewChat = () => {
  return useMutation<ChatResponse, Error, CreateChatRequest>({
    mutationKey: ["createChat"],
    mutationFn: async (title) => {
      const token = getToken();
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      console.log("title", title);
      const response = await apiInstance.post("/chat", title, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("create chat", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Создался новый chat!");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.detail);
      } else {
        console.error("Ошибка при создании chat:", error);
      }
    },
  });
};
