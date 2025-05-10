import { Flex, Text, useEditableStyles, VStack } from "@chakra-ui/react";
import { useGetAllChats } from "./hooks/useGetAllChats";
import { LoaderSpinner } from "@/features/LoaderSpinner";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { EditDialog } from "./EditDialog";

export const UserChat = () => {
  const { data, isLoading, isError } = useGetAllChats();
  const navigate = useNavigate();

  const navigateToChat = (chat_uuid: string) => {
    navigate(`/chat/${chat_uuid}`);
  };
  if (!data || isLoading || isError) return <LoaderSpinner />;
  console.log(data);
  return (
    <VStack w={"100%"} mt={8}>
      {data.map((item) => (
        <Flex
          w={"100%"}
          bg={"blue.100"}
          p={8}
          mt={5}
          borderRadius={30}
          cursor={"pointer"}
          justifyContent={"space-between"}
          key={item.uuid}
          flex={1}
          _hover={{ shadow: "lg" }}
        >
          <Text
            fontSize={"xl"}
            onClick={() => navigateToChat(item.uuid)}
            flex={1}
          >
            {item.title}
          </Text>
          <Flex>
            <EditDialog
              uuid={item.uuid}
              titleChat={item.title}
              is_open={item.is_open}
            />

            {item.is_open ? (
              <Flex ml={3} flex={1}>
                <FaUnlockAlt />
              </Flex>
            ) : (
              <Flex ml={3}>
                <FaLock />
              </Flex>
            )}
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};
