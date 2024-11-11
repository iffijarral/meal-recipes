import React from "react";
import { Box, Flex, IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

interface MobileHeaderProps {
  onOpen: () => void;
  title?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpen, title }) => {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Flex
      as="header"
      w="full"
      px="4"
      py="3"
      bg={bgColor}
      borderBottomWidth="1px"
      alignItems="center"
      justifyContent="space-between"
    >
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        variant="outline"
        onClick={onOpen}
      />
      {title && (
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
      )}
    </Flex>
  );
};

export default MobileHeader