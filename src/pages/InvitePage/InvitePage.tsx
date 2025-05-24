import { Button, HStack, Text, VStack } from "@chakra-ui/react";

export const InvitePage = () => {
  return (
    <VStack h={'100%'} alignItems={'center'} mt={'300px'}>
      <Text>Вас пригласили в чат.</Text>
      <HStack>
        <Button colorPalette={"blue"} borderRadius={30}>
          Принять
        </Button>
        <Button borderRadius={30} variant="outline">Отмена</Button>
      </HStack>
    </VStack>
  );
};
