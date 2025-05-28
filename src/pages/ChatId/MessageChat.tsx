import { LoaderSpinner } from "@/features/LoaderSpinner";
import { useGetMessageChat } from "./hooks/useGetMessageChat";
import { Flex, Text, VStack, Box } from "@chakra-ui/react";
import { useGetUser } from "@/features/hooks/useGetUser";
import { useChatSocket } from "./hooks/useChatSocket";
import { MessageResponse } from "@/entities/Message";

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

  if (
    !data ||
    isLoading ||
    isError ||
    !responseUser ||
    isLoadingUser ||
    isErrorUser
  )
    return <LoaderSpinner />;

  // Объединяем сообщения из React Query и веб-сокета
  const allMessages = [...(data || []), ...live].filter((msg): msg is MessageResponse => {
    if (!msg || typeof msg === 'string' || !msg.id) {
      console.warn('Invalid message found:', msg);
      return false;
    }
    return true;
  });

  // Удаляем дубликаты по id и сортируем
  const uniqueMessages = allMessages.reduce<MessageResponse[]>((acc, current) => {
    const exists = acc.find(msg => msg.id === current.id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  const sortedMessages = uniqueMessages.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <VStack
      w={"100%"}
      mb={"80px"}
    >
      {status === "error" && (
        <Box
          w="100%"
          p={4}
          bg="orange.100"
          color="orange.800"
          borderRadius="md"
        >
          Проблема с подключением к чату. Пытаемся восстановить соединение...
        </Box>
      )}
      
      <VStack
        w={"100%"}
        bg={"blue.100/20"}
        p={35}
        borderRadius={30}
        flex="1"
      >
        {sortedMessages.map((message) => {
          // Генерируем стабильный ключ
          const messageKey = `${message.id}-${message.created_at}`;
          const isOwn = message.user_id === responseUser.id;
          
          return (
            <Flex
              justifyContent={isOwn ? "flex-end" : "flex-start"}
              key={messageKey}
              w={"100%"}
            >
              <Flex
                mb={5}
                bg={"blue.100"}
                p={5}
                borderRadius={30}
                maxW="70%"
                boxShadow="2px 2px 7px rgba(0, 0, 0, 0.15)"
              >
                <Text>{message.text}</Text>
              </Flex>
            </Flex>
          );
        })}
      </VStack>
    </VStack>
  );
};
