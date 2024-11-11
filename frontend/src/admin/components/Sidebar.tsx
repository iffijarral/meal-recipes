import React from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { NavLink } from "./NavLink";

interface SidebarProps {
  links: { label: string; href: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ links }) => (
  <Box as="aside" w="250px" p="4" bg="gray.800" color="white" height="100vh">
    <Text fontSize="xl" fontWeight="bold" mb="4">
      Admin Dashboard
    </Text>
    <VStack align="start">
      {links.map((link, index) => (
        <NavLink key={index} href={link.href}>
          {link.label}
        </NavLink>
      ))}
    </VStack>
  </Box>
);

export default Sidebar