import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/shared/api/apiConfig.ts";
import { Statistic } from "@/entities/Statistic";

export const useStatisticDaily = () => {
  return useQuery<Statistic, Error>({
    queryKey: ["getDailyStatistic"],

    queryFn: async () => {
      try {
        const { data } = await apiInstance.get<Statistic>(
          `/statistic/daily_messages`
        );
        console.log("get /statistic/daily_messages", data);
        return data;
      } catch (error: any) {
        console.error(
          "Ошибка при получении /statistic/daily_messages",
          error.message
        );
        throw error;
      }
    },
  });
};
