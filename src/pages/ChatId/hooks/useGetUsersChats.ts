import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { UsersInChatResponse } from "@/entities/Chat";
import { getToken } from "@/shared/services/authService";

export const useGetUsersChats = (chatUuid:string) => {
  const token = getToken();
  if (!token){
    throw new Error('Требуется авторизация')
  }
  console.log(token)
  return useQuery<UsersInChatResponse[], Error>({
    queryKey: ["getUsersChat", chatUuid],
    enabled: !!chatUuid,

    queryFn: async () => {
      try {
        const response = await apiInstance.get(`/chat/users/${chatUuid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("юзеры чата успешно вывелся", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Ошибка при получении юзеров чата", error.message);
        throw error;
      }
    },
  });
};
