import { removeToken } from "@/shared/services/authService";
import { AvatarIcon, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const RedirectToPersonalAccount = () => {
    navigate(`/personal-account`);
  };
  const logout = () => {
    removeToken();
    navigate("/");
  };
  return (
    <HStack justifyContent={"space-between"} w={"100vh"} p={4}>
      <Text fontWeight={500} fontSize={"2xl"}>
        Chat-platform
      </Text>
      <Flex alignItems={'center'} gap={5}>
        <AvatarIcon
          onClick={() => RedirectToPersonalAccount()}
          cursor={"pointer"}
        />
        <Button bg={'blue'} borderRadius={30} onClick={() => logout()}>Выйти</Button>
      </Flex>
    </HStack>
  );
};
