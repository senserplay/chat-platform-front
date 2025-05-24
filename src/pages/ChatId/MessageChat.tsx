import { LoaderSpinner } from "@/features/LoaderSpinner";
import { useGetMessageChat } from "./hooks/useGetMessageChat";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { useChatSocket } from "./hooks/useChatSocket";
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
  useChatSocket(chat_uuid, responseUser?.id ?? 0);

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
    <VStack w={"100%"}>
      {data.map((message) => (
        <Flex justifyContent={"end"} key={message.id}>
          <Flex mb={5} bg={"blue.100"} p={5} borderRadius={30}>
            <Text>{message.text}</Text>
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};
