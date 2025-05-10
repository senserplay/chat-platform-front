import { Button, Checkbox, CloseButton, Dialog, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { usePatchChat } from "./hooks/usePatchChat";
import { useQueryClient } from "@tanstack/react-query";
type EditDialogProps = {
    uuid: string;
    titleChat: string;
    is_open: boolean;
  };
  
type UseEditDialogProps = {
    uuid: string;
    title: string;
    is_open: boolean;
  };
  
  export const EditDialog = ({ uuid, titleChat, is_open }: EditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: patchChat } = usePatchChat();
  const [isChatOpen,setIsChatOpen]=useState(is_open)
  const [title,setTitle]=useState(titleChat)
  const queryClient = useQueryClient();
    const editChat = async ({ uuid,title,is_open }: UseEditDialogProps) => {
      try {
        await patchChat({ uuid,title,is_open });
        await queryClient.invalidateQueries({ queryKey: ["editChat"] });
        setIsOpen(false);
      } catch (err) {
        console.error("ошибка edit чата", err);
      }
    };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <MdModeEditOutline onClick={() => setIsOpen(true)} />
      </Dialog.Trigger>
      {isOpen && (
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Редактирвование чата</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Input
                  placeholder="Введите название чата"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Checkbox.Root mt={4}>
                  <Checkbox.HiddenInput  checked={isChatOpen} onChange={(e)=>setIsChatOpen(e.target.checked)} />
                  <Checkbox.Control bg="blue" borderRadius={30}/>
                  <Checkbox.Label >Открытый чат</Checkbox.Label>
                </Checkbox.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Отмена</Button>
                </Dialog.ActionTrigger>
                <Button
                  bg={"blue"}
                  onClick={()=>editChat({uuid,title,is_open})}
                >
                  Редактировать
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
  );
};
