import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { ChatResponse } from "@/entities/Chat";
import { getToken } from "@/shared/services/authService";

export const useGetAllChats = () => {
  const token = getToken();
  if (!token){
    throw new Error('Требуется авторизация')
  }
  console.log(token)
  return useQuery<ChatResponse[], Error>({
    queryKey: ["getChats"],
    queryFn: async () => {
      try {
        const response = await apiInstance.get(`/user/chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Чаты успешно вывелись", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Ошибка при получении чатов", error.message);
        throw error;
      }
    },
  });
};
