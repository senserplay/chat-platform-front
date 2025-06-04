import { LoaderSpinner } from "@/features/LoaderSpinner";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { useGetUsersChats } from "./hooks/useGetUsersChats";
import { MdDeleteForever } from "react-icons/md";
import { useDeleteUser } from "./hooks/useDeleteUser";
interface UserListProps {
  chat_uuid: string;
  isOwner: boolean;
  userMe:number;
}

export const UserList: React.FC<UserListProps> = ({ chat_uuid, isOwner, userMe }) => {
  const { data, isLoading, isError } = useGetUsersChats(chat_uuid || "");

  const { mutate: deleteUser } = useDeleteUser();
  if (!data || isLoading || isError) return <LoaderSpinner />;
  console.log(data);
  return (
    <Flex
      position="fixed"
      top="120px"
      right="20"
      bg="gray.100"
      borderRadius={30}
    >
      <VStack my={5} mx={5} justifyContent={"start"} alignItems={"start"}>
        <Text>Список участников:</Text>

        {data.map((user) => (
          <Flex
            w={"100%"}
            ml={0}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={3}
          >
            <Text>{user.username}</Text>
            {isOwner&& user.id!==userMe && (
              <MdDeleteForever
                cursor={"pointer"}
                color="red"
                onClick={() => {
                  if (
                    window.confirm(
                      `Удалить пользователя "${user.username}" из чата?`
                    )
                  ) {
                    deleteUser({
                      chatUuid: chat_uuid,
                      userId: user.id,
                    });
                  }
                }}
              />
            )}
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
};
