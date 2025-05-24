import { useCreateInvite } from "@/features/hooks/useCreateInvite";
import { Button, CloseButton, Dialog, HStack, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";

export const InviteModal = ({ chat_uuid }: { chat_uuid: string }) => {
  const [email, setEmail] = useState("");
  const { mutateAsync: postNewMessage } = useCreateInvite();
  const inviteUser = async (email: string) => {
    try {
      await postNewMessage({ chat_uuid, email });
      console.log("создали invite");
      setEmail("");
    } catch (err) {
      console.error("ошибка отправки email ", err);
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button borderRadius={30} colorPalette={"blue"}>
          Пригласить участника
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Пригласить участника</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input
                type="email"
                placeholder="Введите email пользователя"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger>
                <HStack><Button variant="outline" borderRadius={30}>Отмена</Button>
                <Button onClick={() => inviteUser(email)} colorPalette={'green'} borderRadius={30}>Сохранить</Button></HStack>
                
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
