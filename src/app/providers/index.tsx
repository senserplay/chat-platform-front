import { ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from '@/layouts/mainLayout.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/apiConfig';
import { system } from '@/shared/api/config/theme';

export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
          <MainLayout>
            <Outlet />
          </MainLayout>
      </ChakraProvider>
    </QueryClientProvider>
  );
};