import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useInviteUser } from "./hooks/useInviteUser";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { toaster } from "@/components/ui/toaster";

export const InvitePage = () => {
  const { token_invite } = useParams<{ token_invite: string }>();
  const navigate = useNavigate();
  const location = useLocation(); 
  const isAuthenticated  = useAuth();

  const { mutateAsync: inviteUser } = useInviteUser(token_invite || "");
  const handleInviteUser = async () => {
    if (isAuthenticated.isAuthenticated) {

    if (!token_invite) {
      console.error("Token invite отсутствует");
      return;
    }
    try {
      const inviteUserResponse = await inviteUser();
      const chat_id=inviteUserResponse.chat_uuid
      navigate(`/chat/${chat_id}`)
    } catch (err: any) {
      console.log("ошибка отпарвки  /invite/{token}");
    }}
    toaster.create({
      type: 'error',
      title: 'Вы не тот пользователь, кому предназначалось приглашение в чат',
    });
    navigate(`/invite/${token_invite}`)
  };
  const handleNavigateToMain=()=>{
    navigate('/')
  }
  return (
    <VStack h={"100%"} alignItems={"center"} mt={"300px"}>
      <Text>Вас пригласили в чат.</Text>
      <HStack>
        <Button
          colorPalette={"blue"}
          borderRadius={30}
          onClick={() => handleInviteUser()}
        >
          Принять
        </Button>
        <Button borderRadius={30} variant="outline" onClick={()=>handleNavigateToMain()}>
          Отмена
        </Button>
      </HStack>
    </VStack>
  );
};
