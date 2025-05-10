import { useParams } from "react-router-dom";
import { useGetChatId } from "./hooks/useGetChatId";
import { LoaderSpinner } from "@/features/LoaderSpinner";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { MessageChat } from "./MessageChat";
import { InputPostMessage } from "./InputPostMessage";

export const ChatId = () => {
  const { chat_uuid } = useParams();
  console.log(chat_uuid);
  const { data, isLoading, isError } = useGetChatId(chat_uuid || "");
  console.log(data);
  if (!data || isLoading || isError || !chat_uuid) return <LoaderSpinner />;

  return (
    <VStack h={"100vh"}>
      <Flex ml={0} w={'100%'}>
        <Text fontSize={'4xl'} fontWeight={500}>{data.title}</Text>
      </Flex>
      <VStack w={"80%"} justifyContent={'space-between'} >
        <Flex >
        <MessageChat chat_uuid={chat_uuid} />
        </Flex>
        <Flex w={"60%"} position="fixed" bottom="10">
          <InputPostMessage chat_uuid={chat_uuid} />
        </Flex>
      </VStack>
    </VStack>
  );
};
