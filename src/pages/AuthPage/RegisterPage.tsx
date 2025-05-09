import React, { useState } from "react";
import {
  Input,
  Button,
  Text,
  Link as ChakraLink,
  Fieldset,
  Stack,
  Field,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";

const RegisterPage: React.FC = () => {
  const { register, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onFinish = async (username:string, email: string, password: string ) => {
    try {
      setLoading(true);
      console.log('registration name', username, 'email',email, 'password',password);

      await register( username,password, email);
      console.log('регистрация успешна')
    } catch (error: any) {
      console.error("reg error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fieldset.Root
      size="lg"
      maxW="md"
      as="form"
      mx="auto"
      my="auto"
      borderWidth={2}
      p={10}
      borderRadius={15}
      boxShadow={"lg"}
    >
      <Stack>
        <Fieldset.Legend>Регистрация в Chat Platform</Fieldset.Legend>
        <Fieldset.HelperText>
          Пожалуйста, введите свои учетные данные.
        </Fieldset.HelperText>
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
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor="email">Почта</Field.Label>
          <Input
            name="email"
            type="email"
            size="lg"
            borderColor="gray.600"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field.ErrorText>Введите почту</Field.ErrorText>
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor="password">Пароль</Field.Label>
          <Input
            name="password"
            type="password"
            size="lg"
            borderColor="gray.600"
            onChange={(e) => setPassword(e.target.value)}
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
        onClick={() => onFinish( username,password,email )}
      >
        Войти
      </Button>

      <Text mt={4} color="gray.400">
        Еще нет аккаунта?{"      "}
        <ChakraLink
          // as={Link} to="/register"
          color="blue.600"
        >
          Зарегистрироваться
        </ChakraLink>
      </Text>

      <Text mt={2} color="gray.400">
        <ChakraLink
          // as={Link} to="/welcome"
          color="blue.600"
        >
          Вернуться на главную
        </ChakraLink>
      </Text>
    </Fieldset.Root>
  );
};

export default RegisterPage;
