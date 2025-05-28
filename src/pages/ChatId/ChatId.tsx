import { useParams } from "react-router-dom";
import { useGetChatId } from "./hooks/useGetChatId";
import { LoaderSpinner } from "@/features/LoaderSpinner";
import {  Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { MessageChat } from "./MessageChat";
import { InputPostMessage } from "./InputPostMessage";
import { InviteModal } from "./InviteModal";

export const ChatId = () => {
  const { chat_uuid } = useParams();
  console.log(chat_uuid);
  const { data, isLoading, isError } = useGetChatId(chat_uuid || "");
  console.log(data);
  if (!data || isLoading || isError || !chat_uuid) return <LoaderSpinner />;

  return (
    <VStack h={"100vh"}>
      <HStack justifyContent={"space-between"} w={'100%'}>
        <Flex >
          <Text fontSize={"4xl"} fontWeight={500}>
            {data.title}
          </Text>
        </Flex>
      <InviteModal chat_uuid={chat_uuid}/>
      </HStack>

      <VStack  w={"100%"} justifyContent={"space-between"}>
        <MessageChat chat_uuid={chat_uuid} />

        <Flex
          w="60%"
          position="fixed"
          bottom="0"
          left="50%"
          transform="translateX(-50%)"
          p={4}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <InputPostMessage chat_uuid={chat_uuid} />
        </Flex>
      </VStack>
    </VStack>
  );
};
