import React, { useState, useContext } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CategoryListAside from "./CategoryListAside.js";
import AuthContext from "../context/AuthContext.js";

const MyDrawerComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const onClose = () => setIsOpen(false);

  // Determine if we're in small screen or md+ screen
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {/* Handle Drawer for small screens */}
      {isSmallScreen ? (
        <>
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <Text fontSize="lg" fontWeight="bold" mt={4} px={4}>
                {authContext?.user ? "Dashboard" : "Authentication"}
              </Text>
              <VStack align="flex-start" px={4}>
                {authContext?.user ? (
                  <Text mb={2}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Text>
                ) : (
                  <>
                    <Text mb={2}>
                      <Link to="/login">Login</Link>
                    </Text>
                    <Text mb={2}>
                      <Link to="/signup">Signup</Link>
                    </Text>
                  </>
                )}
              </VStack>
              <CategoryListAside onCategoryClick={onClose} />
            </DrawerContent>
          </Drawer>
        </>
      ) : null}     
    </>
  );
};

export default MyDrawerComponent;
