import { PropsWithChildren } from "react";
import { VStack } from "@chakra-ui/react";
import { Header } from "@/components/Header/Header";
import { useLocation } from "react-router-dom";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const isMainPage = location.pathname === "/"; 

  return (
    <VStack minH="100vh" justify="space-between">
      {!isMainPage && <Header />}
      {children}
    </VStack>
  );
};