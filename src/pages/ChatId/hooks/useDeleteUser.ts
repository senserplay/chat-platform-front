import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { getToken } from "@/shared/services/authService";
interface DeleteUserVars {
    chatUuid: string;
    userId: number;
  }
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

  const token = getToken();
  if (!token){
    throw new Error('Требуется авторизация')
  }
  console.log(token)
  return useMutation<void, Error, DeleteUserVars>({
    mutationFn: async ({ chatUuid, userId }) => {
      await apiInstance.delete(`/chatuser/${chatUuid}`, {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (_data, vars) => {
      
      queryClient.invalidateQueries({
        queryKey: ["getUsersChat", vars.chatUuid],
      });
    },
    onError: (err: Error) => {
      console.error("Ошибка при удалении пользователя из чата:", err.message);
    },
  });
};