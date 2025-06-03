import { LoaderSpinner } from "@/features/LoaderSpinner";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { useGetUsersChats } from "./hooks/useGetUsersChats";

export const UserList = ({ chat_uuid }: { chat_uuid: string }) => {
  const { data, isLoading, isError } = useGetUsersChats(chat_uuid || "");
  if (!data || isLoading || isError) return <LoaderSpinner />;
  console.log(data)
  return (
    <Flex
      position="fixed"
      top="120px"
      right="20"
      
      bg="gray.100"
      borderRadius={30}
    >
      <VStack my={5} mx={5} justifyContent={'start'} alignItems={'start'}>
        <Text>Список участников:</Text>
        {data.map((user)=>(<Flex ml={0} justifyContent={'start'} ><Text>{user.username}</Text></Flex>))}
      </VStack>
    </Flex>
  );
};
