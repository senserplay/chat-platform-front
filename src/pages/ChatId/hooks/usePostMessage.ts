import { CreateMessage } from "@/entities/Message";
import { apiInstance } from "@/shared/api/apiConfig";
import { getToken } from "@/shared/services/authService";
import { useMutation } from "@tanstack/react-query";

export const usePostMessage = () => {
  return useMutation<CreateMessage, Error, CreateMessage>({
    mutationKey: ["createMessage"],
    mutationFn: async (payload) => {
      const token = getToken();
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      console.log("create message payload", payload);
      const response = await apiInstance.post("/message", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("create message", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Создался новoe message!");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.detail);
      } else {
        console.error("Ошибка при создании message:", error);
      }
    },
  });
};
