import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/apiConfig";
import { system } from "@/shared/api/config/theme";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { Outlet } from "react-router-dom";

export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <AuthProvider>
          <Outlet />{" "}
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
