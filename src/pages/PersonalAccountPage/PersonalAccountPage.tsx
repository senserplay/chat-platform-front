import { useGetUser } from "@/features/hooks/useGetUser";
import { LoaderSpinner } from "@/features/LoaderSpinner";
import { VStack, Text, Input, Button, Box, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { usePatchUser } from "./hooks/usePatchUser";
import { useQueryClient } from "@tanstack/react-query";

export const PersonalAccountPage = () => {
  const { data, isLoading, isError } = useGetUser();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [editing, setEditing] = useState(false);
  const { mutateAsync: patchUser } = usePatchUser();
  const queryClient = useQueryClient();

  const handleEditUser = async (username: string, password: string) => {
    try {
      await patchUser({ username, password });
      await queryClient.invalidateQueries({ queryKey: ["getUser"] });
      console.log("success /user patch");
    } catch (error) {
      console.error("Ошибка при user patch", error);
    }
  };
  if (!data || isLoading || isError) return <LoaderSpinner />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <VStack align="stretch" gap={4}>
      <Text>Email: {data.email}</Text>

      {!editing ? (
        <>
          <Box>
            <Text>Username: {data.username}</Text>
            <Button
              onClick={() => {
                setFormData({ username: data.username, password: "" });
                setEditing(true);
              }}
              borderRadius={30}
              colorPalette={"blue"}
              mt={4}
            >
              Изменить личные данные
            </Button>
          </Box>
        </>
      ) : (
        <Box maxW={400}>
          <Input
            name="username"
            value={formData.username}
            placeholder="Новый username"
            onChange={handleChange}
            mt={2}
          />
          <Input
            name="password"
            type="password"
            value={formData.password}
            placeholder="Новый пароль"
            onChange={handleChange}
            mt={2}
          />
          <HStack>
            <Button
              mt={2}
              onClick={async () => {
                await handleEditUser(formData.username, formData.password);
                setEditing(false);
              }}              colorPalette={"blue"}
              borderRadius={30}
            >
              Сохранить
            </Button>
            <Button
              mt={2}
              variant="outline"
              onClick={() => setEditing(false)}
              borderRadius={30}
            >
              Отмена
            </Button>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};
