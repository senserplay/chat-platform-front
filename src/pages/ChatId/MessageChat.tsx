import { LoaderSpinner } from "@/features/LoaderSpinner";
import { useGetMessageChat } from "./hooks/useGetMessageChat";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { useGetUser } from "@/features/hooks/useGetUser";
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

  if (
    !data ||
    isLoading ||
    isError ||
    !responseUser ||
    isLoadingUser ||
    isErrorUser
  )
    return <LoaderSpinner />;
  const sortedMessages = [...data].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  console.log("дернули /message", data);
  return (
    <VStack
      w={"100%"}
      mb={"80px"}
      bg={"blue.100/20"}
      p={35}
      borderRadius={30}
      flex="1"
    >
      {sortedMessages.map((message) => {
        const isOwn = message.user_id === responseUser.id;
        return (
          <Flex
            justifyContent={isOwn ? "flex-end" : "flex-start"}
            key={message.id}
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
  );
};
