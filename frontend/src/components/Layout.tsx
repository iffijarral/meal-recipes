import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react"; // Use Chakra UI for styling

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh">
      {/* Header */}
      <Box as="header" bg="blue.600" color="white" p={4}>
        <h1>Dashboard Header</h1>
      </Box>

      <Flex flex="1">
        {/* Sidebar */}
        <Box as="aside" w="250px" p="4" bg={useColorModeValue("white", "gray.700")} height="100vh">
          <nav>
            <ul>
              <li><a href="/dashboard/home">Home</a></li>
              <li><a href="/dashboard/profile">Profile</a></li>
              <li><a href="/dashboard/settings">Settings</a></li>
            </ul>
          </nav>
        </Box>

        {/* Main Content */}
        <Box as="main" p={4} flex="1" bg="gray.50">
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

export default Layout;
