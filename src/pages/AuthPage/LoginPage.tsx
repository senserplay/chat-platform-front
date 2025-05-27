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
import { toaster } from "@/components/ui/toaster";
import { useInviteUser } from "../InvitePage/hooks/useInviteUser";

const LoginPage: React.FC = () => {
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};
  const fromPath = from?.pathname ?? "/";

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inviteToken = getInviteIntent();
  const { mutateAsync: inviteUser } = useInviteUser(inviteToken || "");

  const onFinish = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login(email, password);

      if (inviteToken) {
        try {
          const res = await inviteUser();
          const chatUuid = res.chat_uuid;
          clearInviteIntent();
          navigate(`/chat/${chatUuid}`);
        } catch (err: any) {
          const status = err?.response?.status;
          switch (status) {
            case 403:
              toaster.create({
                type: "error",
                title:
                  "Вы не тот пользователь, кому предназначалось приглашение в чат",
              });
              break;
            case 409:
              {
                toaster.create({
                  type: "info",
                  title: "Вы уже участвуете в этом чате",
                });
                const chatUuid = err?.response?.data?.chat_uuid;
                if (chatUuid) {
                  navigate(`/chat/${chatUuid}`);
                  clearInviteIntent();
                  return;
                }
              }
              break;
            default:
              toaster.create({
                type: "error",
                title: "Не удалось принять приглашение",
              });
          }
          clearInviteIntent();
          navigate("/chats");
        }
      } else {
        navigate(fromPath);
      }
    } catch (err: any) {
      console.error("Login error:", err);
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
        <Fieldset.Legend>Вход в Chat Platform</Fieldset.Legend>
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
          <Field.Label htmlFor="username">Почта</Field.Label>
          <Input
            name="email"
            size="lg"
            borderColor="gray.600"
            onChange={(e) => setEmail(e.target.value)}
          />
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
        onClick={() => onFinish(email, password)}
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

export default LoginPage;
