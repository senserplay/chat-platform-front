import { Box, VStack } from "@chakra-ui/react";
import { Header } from "@/components/Header/Header";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/";
  const isInvitePage = location.pathname.startsWith("/invite/");
  const isHeader = !isMainPage && !isInvitePage;
  return (
    <VStack>
      {isHeader && <Header />}
      <Box w={"90vh"}>
        
        <Outlet />
      </Box>
    </VStack>
  );
};
