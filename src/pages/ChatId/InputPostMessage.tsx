import { HStack, Input } from "@chakra-ui/react";
import { usePostMessage } from "./hooks/usePostMessage";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MessageChatProps } from "./MessageChat";
import { FaCircleArrowRight } from "react-icons/fa6";

export const InputPostMessage = ({ chat_uuid }: MessageChatProps) => {
  const { mutateAsync: postNewMessage } = usePostMessage();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const postMessage = async () => {
    try {
      await postNewMessage({ chat_uuid, text });
      await queryClient.invalidateQueries({ queryKey: ["createMessage"] });
      console.log("создали сообщение");
      setText('')
    } catch (err) {
      console.error("ошибка отправки сообщения", err);
    }
  };
  return (
    <HStack w={'100%'}>
    <Input
      placeholder="Введите сообщение"
      value={text}
      onChange={(e) => setText(e.target.value)}
    ></Input><FaCircleArrowRight color="blue" onClick={()=>postMessage()}/></HStack>

  );
};
