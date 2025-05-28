import { Flex, Text, useEditableStyles, VStack } from "@chakra-ui/react";
import { useGetAllChats } from "./hooks/useGetAllChats";
import { LoaderSpinner } from "@/features/LoaderSpinner";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { EditDialog } from "./EditDialog";
import { usePatchChat } from "./hooks/usePatchChat";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "@/features/hooks/useGetUser";

export const UserChat = () => {
  const { data, isLoading, isError } = useGetAllChats();
  const {
    data: responseUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useGetUser();
  const navigate = useNavigate();
  const { mutateAsync: patchChat } = usePatchChat();
  const queryClient = useQueryClient();

  const toggleChatOpenState = async (
    uuid: string,
    title: string,
    is_open: boolean
  ) => {
    try {
      await patchChat({ uuid, title, is_open });
      await queryClient.invalidateQueries({ queryKey: ["getChats"] });
      console.log("поменяли значение");
    } catch (error) {
      console.error("Ошибка при переключении is_open", error);
    }
  };
  const navigateToChat = (chat_uuid: string) => {
    navigate(`/chat/${chat_uuid}`);
  };
  if (
    !data ||
    isLoading ||
    isError ||
    !responseUser ||
    isLoadingUser ||
    isErrorUser
  )
    return <LoaderSpinner />;
  console.log("вывод чатов", data);
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
            {responseUser.id === item.owner_id && (
              <EditDialog
                uuid={item.uuid}
                titleChat={item.title}
                is_open={item.is_open}
              />
            )}

            <Flex
              ml={3}
              onClick={() => {
                if (responseUser.id === item.owner_id) {
                  toggleChatOpenState(item.uuid, item.title, !item.is_open);
                }
              }}
              cursor={responseUser.id === item.owner_id ? "pointer" : "default"}
              >
              {item.is_open ? <FaUnlockAlt /> : <FaLock />}
            </Flex>
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};
