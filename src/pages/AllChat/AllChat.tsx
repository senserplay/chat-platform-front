import { Flex, HStack, VStack } from "@chakra-ui/react";
import { CreateChatBtn } from "./CreateChatBtn";
import { UserChat } from "./UserChats";
import { DailyMessagesChart } from "./DailyStatistis";
import { ActiveStatistic } from "./hooks/ActiveStatistic";

export const AllChat = () => {
  return (
    <VStack justifyContent={"start"} alignItems={"start"} mt={5} w={"100%"}>
      <HStack alignItems={"start"} w={'100%'} justifyContent={'space-between'}>
        <Flex gap={2}>
          <DailyMessagesChart />
          <ActiveStatistic />
        </Flex>
        <Flex>
          
          <CreateChatBtn />
        </Flex>
      </HStack>
      <UserChat />
    </VStack>
  );
};
