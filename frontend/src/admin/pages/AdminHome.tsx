import React from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Settings", href: "/admin/settings" },
];

const AdminHome: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" h="100vh">
      <MobileHeader onOpen={onOpen} title="Admin Panel" />
      <Flex flex="1">
        <Sidebar links={links} />
        <Box flex="1" p="6">
          {/* Main content goes here */}
        </Box>
      </Flex>
    </Flex>
  );
};
export default AdminHome