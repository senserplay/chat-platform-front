// components/DailyMessagesChart.tsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Spinner, Text, Heading, Center } from "@chakra-ui/react";
import { useStatisticDaily } from "@/features/hooks/useStatisticDaily";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "Сообщения по дням за неделю",
    },
  },
};

export const DailyMessagesChart: React.FC = () => {
  const { data, isLoading, error } = useStatisticDaily();

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" aria-label="Загрузка статистики..." />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500">Ошибка при загрузке: {error.message}</Text>
      </Center>
    );
  }

  // теперь data — это Record<string,number>
  if (!data || Object.keys(data).length === 0) {
    return (
      <Center py={10}>
        <Text>Нет данных для отображения.</Text>
      </Center>
    );
  }

  // разбиваем на метки и значения
  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Количество сообщений",
        data: values,
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box maxW="600px" mx="auto" p={4} boxShadow="md" borderRadius="md" bg="white">
      <Heading as="h3" size="md" mb={4} textAlign="center">
        Ежедневная статистика сообщений
      </Heading>
      <Line options={options} data={chartData} />
    </Box>
  );
};
