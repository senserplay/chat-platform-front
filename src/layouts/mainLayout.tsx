import { PropsWithChildren } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { Header } from "@/components/Header/Header";
import { useLocation } from "react-router-dom";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const isMainPage = location.pathname === "/"; 

  return (
    <VStack>
      {!isMainPage && <Header/>}
      <Box w={'90vh'} >{children}</Box>
      
    </VStack>
  );
};