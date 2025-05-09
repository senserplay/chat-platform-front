import { Flex, Text, useEditableStyles, VStack } from "@chakra-ui/react";
import { useGetAllChats } from "./hooks/useGetAllChats";
import { LoaderSpinner } from "@/features/LoaderSpinner";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";

export const UserChat = () => {
  const { data, isLoading, isError } = useGetAllChats();
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
        >
          <Text fontSize={"xl"}>{item.title}</Text>
          <Flex>
          <MdModeEditOutline  />
          {item.is_open ? (
              <Flex ml={3}>
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
