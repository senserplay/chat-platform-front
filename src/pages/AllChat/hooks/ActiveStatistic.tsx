// components/ActiveChatsChart.tsx
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
import { useStatisticActive } from "@/features/hooks/useStatisticActive";

// Регистрируем плагины Chart.js
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
      text: "Активные чаты по дням за неделю",
    },
  },
};

export const ActiveStatistic: React.FC = () => {
  const { data, isLoading, error } = useStatisticActive();

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

  // Предполагаем, что Statistic — это Record<string, number>
  const stats = data as Record<string, number>;

  if (!stats || Object.keys(stats).length === 0) {
    return (
      <Center py={10}>
        <Text>Нет данных для отображения.</Text>
      </Center>
    );
  }

  const labels = Object.keys(stats);
  const values = Object.values(stats);

  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Активные чаты",
        data: values,
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box maxW="600px" mx="auto" p={4} boxShadow="md" borderRadius="md" bg="white">
      <Heading as="h3" size="md" mb={4} textAlign="center">
        Активные чаты за неделю
      </Heading>
      <Line options={options} data={chartData} />
    </Box>
  );
};
