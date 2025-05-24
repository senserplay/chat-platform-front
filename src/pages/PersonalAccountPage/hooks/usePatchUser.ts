import { UpdateUserRequest, UserResponse } from "@/entities/User";
import { apiInstance } from "@/shared/api/apiConfig";
import { getToken } from "@/shared/services/authService";
import { useMutation } from "@tanstack/react-query";

export const usePatchUser = () => {
  return useMutation<UserResponse, Error, UpdateUserRequest>({
    mutationKey: ["editUser"],
    mutationFn: async (payload) => {
      console.log('полученный payload',payload);
      
      const token = getToken();
      if (!token) {
        throw new Error("Требуется авторизация");
      }
      console.log("payload", payload);
      const response = await apiInstance.patch("/user", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("edit user successful", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("edit succes user!");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.detail);
      } else {
        console.error("Ошибка при edit user:", error);
      }
    },
  });
};
