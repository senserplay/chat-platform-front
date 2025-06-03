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
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { LocationState } from "@/entities/Invite";
import {
  clearInviteIntent,
  getInviteIntent,
} from "@/shared/services/invite-intent";
import { useInviteUser } from "../InvitePage/hooks/useInviteUser";
import { toaster } from "@/components/ui/toaster";

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};
  const fromPath = from?.pathname ?? "/";

  const { register } = useAuth();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const inviteToken = getInviteIntent();
  const { mutateAsync: inviteUser } = useInviteUser(inviteToken || "");

  const onFinish = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    console.log(username,email,password)
    try {
      await register(username,email, password);
      await login( email, password );

      if (inviteToken) {
        try {
          const res = await inviteUser();
          clearInviteIntent();
          navigate(`/chat/${res.chat_uuid}`);
          return;
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 403) {
            toaster.create({
              type: "error",
              title:
                "Вы не тот пользователь, кому предназначалось приглашение в чат",
            });
          } else if (status === 409) {
            toaster.create({
              type: "info",
              title: "Вы уже участвуете в этом чате",
            });
            const chatUuid = err.response?.data?.chat_uuid;
            if (chatUuid) {
              navigate(`/chat/${chatUuid}`);
              clearInviteIntent();
              return;
            }
          } else {
            toaster.create({
              type: "error",
              title: "Не удалось принять приглашение",
            });
          }
          clearInviteIntent();
          navigate("/chats");
          return;
        }
      }
      else{
      navigate(fromPath);}
      
    } catch (err: any) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const navigateToMain = () => {
    navigate("/");
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
        onClick={() => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toaster.create({
              type: "error",
              title: "Пожалуйста, введите корректный email",
            });
            return;
          }
        
          if (!username.trim() || !password.trim()) {
            toaster.create({
              type: "error",
              title: "Заполните все поля",
            });
            return;
          }
        
          onFinish(username, email, password);
        }}
      >
        Войти
      </Button>

      

      <Text mt={2} color="gray.400">
        <ChakraLink onClick={navigateToMain} color="blue.600">
          Вернуться на главную
        </ChakraLink>
      </Text>
    </Fieldset.Root>
  );
};

export default RegisterPage;
