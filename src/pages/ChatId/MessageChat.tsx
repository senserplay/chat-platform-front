import { LoaderSpinner } from "@/features/LoaderSpinner";
import { useGetMessageChat } from "./hooks/useGetMessageChat";
import { Flex, Text, VStack } from "@chakra-ui/react";
export type MessageChatProps = {
  chat_uuid: string;
};
export const MessageChat = ({ chat_uuid }: MessageChatProps) => {
  const { data, isLoading, isError } = useGetMessageChat(chat_uuid || "");
  if (!data || isLoading || isError) return <LoaderSpinner />;
  console.log("дернули /message", data);
  return (
    <VStack w={'100%'}>
      {data.map((message) => (
        <Flex justifyContent={"end"}>
          <Flex mb={5} bg={"blue.100"}  p={5} borderRadius={30}>
            <Text>{message.text}</Text>
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};
