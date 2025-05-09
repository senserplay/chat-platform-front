import { Flex, Box, Heading, Text, HStack, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MainPage = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };
  const navigateToRegister = () => {
    navigate("/register");
  };
  return (
    <Flex
      direction="column"
      justifyContent={"center"}
      align="center"
      p={{ base: "20px", md: "40px" }}
      h={"100vh"}
    >
      <Box
        textAlign="center"
        mb="60px"
        maxW="1200px"
        animation={`${fadeIn} 1s ease-in-out`}
      >
        <Heading
          as="h1"
          fontSize={{ base: "36px", md: "52px" }}
          bgClip="text"
          mb="20px"
          color={"black"}
        >
          {" "}
          Chat Platform
        </Heading>
        <Heading as="h2" size="lg" color="gray.300" mb="30px">
          Chat Platform{" "}
        </Heading>
        <Text
          color="gray.500"
          fontSize={{ base: "16px", md: "18px" }}
          maxW="800px"
          mx="auto"
          lineHeight="1.6"
        >
          Chat Platform{" "}
        </Text>
      </Box>

      <Box textAlign="center" mb="40px">
        {/* <Heading as="h3" size="lg" mb="30px">
          Готовы начать работу с Chat Platform?
        </Heading> */}
        <HStack justify="center" gap={10}>
          <Button
            size="lg"
            h="50px"
            px="40px"
            bg="blue"
            borderRadius={30}
            _hover={{ bg: "blue/80" }}
            onClick={navigateToRegister}
          >
            Начать
          </Button>
          <Button
            size="lg"
            h="50px"
            px="40px"
            borderColor="blue"
            color="blue/50"
            variant="outline"
            _hover={{ bg: "blue/5" }}
            borderRadius={30}
            onClick={navigateToLogin}
          >
            У меня уже есть аккаунт
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default MainPage;
