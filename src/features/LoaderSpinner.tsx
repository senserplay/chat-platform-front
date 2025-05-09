import { Flex, Spinner } from "@chakra-ui/react";

export const LoaderSpinner = () => {
  return (
    <Flex justifyContent={"center"}>
      <Spinner size={"xl"} />
    </Flex>
  );
};
