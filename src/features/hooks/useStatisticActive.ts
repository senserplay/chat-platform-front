import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { Statistic } from "@/entities/Statistic";
export const useStatisticActive = () => {
  return useQuery<Statistic, Error>({
    queryKey: ["getActiveStatistic"],

    queryFn: async () => {
      try {
        const { data } = await apiInstance.get(
          `/statistic/day_active_chats`,
          {}
        );
        console.log("get /statistic/day_active_chats", data);
        return data;
      } catch (error: any) {
        console.error(
          "Ошибка при получении /statistic/day_active_chats",
          error.message
        );
        throw error;
      }
    },
  });
};
