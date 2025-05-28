import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Input,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCreateNewChat } from "./hooks/createNewChat";
import { useQueryClient } from "@tanstack/react-query";

export const CreateChatBtn = () => {
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: createNewChat } = useCreateNewChat();
  const queryClient = useQueryClient();

  const createChat = async () => {
    try {
      await createNewChat({ title });
      await queryClient.invalidateQueries({ queryKey: ["getChats"] });
      setIsOpen(false);
    } catch (err) {
      console.error("ошибка создания чата", err);
    }
  };
  return (
    <Box justifyContent={"start"} alignItems={'start'}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button
            bg={"blue"}
            borderRadius={30}
            fontSize={"2xl"}
            p={7}
            onClick={() => setIsOpen(true)}
          >
            Создать чат
          </Button>
        </Dialog.Trigger>
        {isOpen && (
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Создание нового чата</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Input
                    placeholder="Введите название чата"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Отмена</Button>
                  </Dialog.ActionTrigger>
                  <Button bg={"blue"} onClick={createChat}>
                    Создать
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        )}
      </Dialog.Root>
    </Box>
  );
};
