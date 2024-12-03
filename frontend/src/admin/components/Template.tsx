import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Button, Flex, Heading, HStack, useColorModeValue } from "@chakra-ui/react"; // Use Chakra UI for styling
import Navigation from "./Navigation.js";
import { Link as RouterLink } from 'react-router-dom';

const Template = () => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <Flex direction="column" minH="100vh">
      {/* Header */}
      <header>
        <Box as="header" color="white" p={4} borderBottomWidth="1px" borderBottomColor={borderColor}>
          <HStack justifyContent="space-between">
            <Heading>J.Recipes Dashboard</Heading>
            <Button as={RouterLink} to="/logout" colorScheme="blue">
              Logout
            </Button>
          </HStack>
        </Box>
      </header>

      <Flex flex="1">
        {/* Sidebar */}
        <Box as="aside" w="250px" p={4} borderRightWidth="1px" borderRightColor={borderColor}>
          <nav>
            <Navigation />
          </nav>
        </Box>

        {/* Main Content */}
        <Box as="main" p={4} flex="1">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Template;
