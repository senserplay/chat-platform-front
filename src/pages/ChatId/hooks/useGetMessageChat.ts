import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { getToken } from "@/shared/services/authService";
import { MessageResponse } from "@/entities/Message";

export const useGetMessageChat = (chatUuid:string) => {
  const token = getToken();
  if (!token){
    throw new Error('Требуется авторизация')
  }
  
  return useQuery<MessageResponse[], Error>({
    queryKey: ["getMessageChat", chatUuid],
    enabled: !!chatUuid,

    queryFn: async () => {
      try {
        const response = await apiInstance.get(`/message/chat/${chatUuid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("сообщения чата успешно загружены", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Ошибка при получении сообщений чата ", error.message);
        throw error;
      }
    },
    
  });
};
