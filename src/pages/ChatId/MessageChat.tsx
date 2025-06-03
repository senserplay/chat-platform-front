import { LoaderSpinner } from "@/features/LoaderSpinner";
import { useGetMessageChat } from "./hooks/useGetMessageChat";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useGetUser } from "@/features/hooks/useGetUser";
import { useChatSocket } from "./hooks/useChatSocket";
import { MessageResponse } from "@/entities/Message";
import { useEffect, useRef } from "react";
export type MessageChatProps = {
  chat_uuid: string;
};
export const MessageChat = ({ chat_uuid }: MessageChatProps) => {
  const {
    data: responseUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useGetUser();

  const { data, isLoading, isError } = useGetMessageChat(chat_uuid || "");
  const { live, status } = useChatSocket(chat_uuid, !isLoading && !isError);
  const bottomRef = useRef<HTMLDivElement>(null);
  const allMessages = [...(data || []), ...live].filter((msg): msg is MessageResponse => {
    if (!msg || typeof msg === 'string' || !msg.message.id) {
      console.warn('Invalid message found:', msg);
      return false;
    }
    return true;
  });

  // Удаляем дубликаты по id и сортируем
  const uniqueMessages = allMessages.reduce<MessageResponse[]>((acc, current) => {
    const exists = acc.find(msg => msg.message.id === current.message.id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  const sortedMessages = uniqueMessages.sort(    (a, b) =>
    new Date(a.message.created_at).getTime() -
    new Date(b.message.created_at).getTime()
);
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [sortedMessages]);
  if (
    !data ||
    isLoading ||
    isError ||
    !responseUser ||
    isLoadingUser ||
    isErrorUser
  )
    return <LoaderSpinner />;
    
  console.log("дернули /message", data);
  return (
    <VStack
      w={"100%"}
      mb={"80px"}
      bg={"blue.100/20"}
      p={35}
      borderRadius={30}
      flex="1"
      overflowY="auto"
      maxH="calc(100vh - 200px)"

    >
      {sortedMessages.map((message) => {
        const isOwn = message.message.user_id === responseUser.id;
        return (
          <Flex
            justifyContent={isOwn ? "flex-end" : "flex-start"}
            key={message.message.id}
            w={"100%"}
          >
            {status === "error" && (
        <Box
          w={"100%"}
          p={4}
          bg="orange.100"
          color="orange.800"
          borderRadius="md"
        >
          Проблема с подключением к чату. Пытаемся восстановить соединение...
        </Box>
      )}
            <VStack w={"100%"}>
              <Flex
                justifyContent={isOwn ? "flex-end" : "flex-start"}
                w={"100%"}
              >
                {message.username}
              </Flex>
              <Flex w={'100%'} 
                justifyContent={isOwn ? "flex-end" : "flex-start"}
                >
                <Flex
                  mb={5}
                  bg={"blue.100"}
                  p={5}
                  borderRadius={30}
                  maxW="70%"
                  boxShadow="2px 2px 7px rgba(0, 0, 0, 0.15)"
                >
                  <Text>{message.message.text}</Text>
                </Flex>
              </Flex>
            </VStack>
          </Flex>
        );
      })}
            <div ref={bottomRef} />

    </VStack>
  );
};
