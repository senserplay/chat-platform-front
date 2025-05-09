import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { ChatResponse } from "@/entities/Chat";
import { getToken } from "@/shared/services/authService";

export const useGetChatId = (chatUuid:string) => {
  const token = getToken();
  if (!token){
    throw new Error('Требуется авторизация')
  }
  console.log(token)
  return useQuery<ChatResponse, Error>({
    queryKey: ["getChatId", chatUuid],
    enabled: !!chatUuid,

    queryFn: async () => {
      try {
        const response = await apiInstance.get(`/chat/${chatUuid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Чат успешно вывелся", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Ошибка при получении чата айди", error.message);
        throw error;
      }
    },
  });
};
