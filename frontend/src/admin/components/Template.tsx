import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react"; // Use Chakra UI for styling
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

const Template = () => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <Flex direction="column" minH="100vh">
      {/* Header */}
      <header>
        <Box as="header" color="white" p={4}  borderBottomWidth="1px" borderBottomColor={borderColor}>
          <h1>Dashboard Header</h1>
        </Box>
      </header>

      <Flex flex="1">
        {/* Sidebar */}
        <Box as="aside" w="250px" p="4" height="100vh"  borderRightWidth="1px" borderRightColor={borderColor}>
          <nav>
            <Navigation />
          </nav>
        </Box>

        {/* Main Content */}
        <Box as="main" p={4} flex="1">
          <Outlet />
        </Box>
      </Flex>

      {/* Footer */}
      <Box as="footer" bg="blue.600" color="white" p={4} textAlign="center">
        <p>Dashboard Footer</p>
      </Box>
    </Flex>
  );
};

export default Template;
