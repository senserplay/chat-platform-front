import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useInviteUser } from "./hooks/useInviteUser";
import {  useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { toaster } from "@/components/ui/toaster";
import { clearInviteIntent, saveInviteIntent } from "@/shared/services/invite-intent";

export const InvitePage = () => {
  const { token_invite } = useParams<{ token_invite: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const isAuth  = auth.isAuthenticated;
  const { mutateAsync: inviteUser } = useInviteUser(token_invite || "");
  const doInvite = async () => {
    try {
      const res = await inviteUser();
      clearInviteIntent();
      navigate(`/chat/${res.chat_uuid}`);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        toaster.create({
          type: "error",
          title: "Вы не тот пользователь, кому предназначалось приглашение в чат",
        });
        navigate("/chats");
      } else if (status === 409) {
        toaster.create({
          type: "info",
          title: "Вы уже участвуете в этом чате",
        });
        const chatUuid = err.response?.data?.chat_uuid;
        navigate(chatUuid ? `/chat/${chatUuid}` : "/chats");
      } else {
        toaster.create({
          type: "error",
          title: "Не удалось принять приглашение",
        });
        navigate("/");
      }
    }
  };

  const onAcceptClick = () => {
    if (!token_invite) return;

    if (!isAuth) {
      saveInviteIntent(token_invite);
      navigate("/", { replace: true });
    } else {
      doInvite();
    }
  };
  // useEffect(() => {
  //   if (
  //     isAuthenticated &&
  //     (location.state as any)?.autoAccept &&
  //     !inviteAlreadyTried.current
  //   ) {
  //     inviteAlreadyTried.current = true;
  //     handleInviteUser(true);
  //   }
  // }, [isAuthenticated]);
  // const handleInviteUser = async (auto = false) => {
  //   if (!token_invite) {
  //     console.error("Token invite отсутствует");
  //     return;
  //   }

  //   if (!isAuthenticated) {
  //     navigate("/", {
  //       state: {
  //         from: `/invite/${token_invite}`,
  //         autoAccept: true,
  //       },
  //     });
  //     return;
  //   }

  //   try {
  //     const inviteUserResponse = await inviteUser();
  //     const chat_id = inviteUserResponse.chat_uuid;
  //     navigate(`/chat/${chat_id}`);
  //   } catch (err: any) {
  //     const status = err?.response?.status;
  //     if (status === 403) {
  //       toaster.create({
  //         type: "error",
  //         title:
  //           "Вы не тот пользователь, кому предназначалось приглашение в чат",
  //       });
  //       navigate("/chats");
  //     } else if (status === 409) {
  //       const chat_id = err?.response?.data?.chat_uuid;
  //       toaster.create({
  //         type: "info",
  //         title: "Вы уже участвуете в этом чате",
  //       });
  //       if (chat_id) {
  //         navigate(`/chat/${chat_id}`);
  //       } else {
  //         navigate("/chats");
  //       }
  //     } else {
  //       console.error("Ошибка отправки приглашения:", err);
  //       toaster.create({
  //         type: "error",
  //         title: "Не удалось принять приглашение",
  //       });
  //       navigate("/");
  //     }
  //   }
  // };

  const handleNavigateToMain = () => {
    navigate("/");
  };
  return (
    <VStack h={"100%"} alignItems={"center"} mt={"300px"}>
      <Text>Вас пригласили в чат.</Text>
      <HStack>
        <Button
          colorPalette={"blue"}
          borderRadius={30}
          onClick={() => onAcceptClick()}
        >
          Принять
        </Button>
        <Button
          borderRadius={30}
          variant="outline"
          onClick={() => handleNavigateToMain()}
        >
          Отмена
        </Button>
      </HStack>
    </VStack>
  );
};
