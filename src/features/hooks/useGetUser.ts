import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { getToken } from "@/shared/services/authService";
import { UserResponse } from "@/entities/User";

export const useGetUser = () => {
  const token = getToken();
  if (!token){
    throw new Error('Требуется авторизация')
  }
  console.log(token)
  return useQuery<UserResponse, Error>({
    queryKey: ["getUser"],
    

    queryFn: async () => {
      try {
        const response = await apiInstance.get(`/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("get /user success", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Ошибка при получении get /user", error.message);
        throw error;
      }
    },
  });
};
