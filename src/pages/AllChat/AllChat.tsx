import {  VStack } from "@chakra-ui/react";
import { CreateChatBtn } from "./CreateChatBtn";
import { UserChat } from "./UserChats";

export const AllChat = () => {
  
  return (
    <VStack justifyContent={"start"} alignItems={"start"} mt={5} w={"100%"}>
      <CreateChatBtn />
      <UserChat/>
    </VStack>
  );
};
