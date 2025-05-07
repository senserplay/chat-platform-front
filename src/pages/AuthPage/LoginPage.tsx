import React, { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  
  Input,
  InputGroup,
  Button,
  Alert,
  Text,
  Link as ChakraLink,
  AlertDescription,
  Fieldset,
  Stack,
  Field,
} from "@chakra-ui/react";
// import { useAuth } from "@/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
//   const { login, error } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


//   const onFinish = async (values: { username: string; password: string }) => {
//     try {
//       setLoading(true);
//       await login(values.username, values.password);
//       message.success("Вход выполнен успешно");
//       navigate("/");
//     } catch (error: any) {
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <Fieldset.Root size="lg" maxW="md" as="form"
    //  onSubmit={handleSubmit} 
     mx="auto" my='auto' borderWidth={2} p={10} borderRadius={15} boxShadow={'lg'}>
      <Stack >
        <Fieldset.Legend>Вход в Chat Platform</Fieldset.Legend>
        <Fieldset.HelperText>Пожалуйста, введите свои учетные данные.</Fieldset.HelperText>
      </Stack>

      {/* {error && (
        <AlertDescription mb={4} borderRadius="md">
          {error}
        </AlertDescription>
      )} */}

      <Fieldset.Content>
        <Field.Root>
          <Field.Label htmlFor="username">Имя пользователя</Field.Label>
          <Input
            name="username"
            size="lg"
            borderColor="gray.600"
            // value={username}
            // onChange={(e) => setUsername(e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label htmlFor="password">Пароль</Field.Label>
          <Input
            name="password"
            type="password"
            size="lg"
            borderColor="gray.600"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
          />
          <Field.ErrorText>Введите пароль</Field.ErrorText>
        </Field.Root>
      </Fieldset.Content>

      <Button
        type="submit"
        alignSelf="flex-start"
        mt={4}
        size="lg"
        // isLoading={loading}
        bg="blue"
        borderRadius={20}
        mb={5}
      >
        Войти
      </Button>

      <Text mt={4} color="gray.400" > 
        Еще нет аккаунта?{'      '}
        <ChakraLink 
        // as={Link} to="/register" 
        color="blue.600">
          Зарегистрироваться
        </ChakraLink>
      </Text>

      <Text mt={2} color="gray.400">
        <ChakraLink 
        // as={Link} to="/welcome" 
        color="blue.600">
          Вернуться на главную
        </ChakraLink>
      </Text>
    </Fieldset.Root>
  );
};

export default LoginPage;
