import {
  Avatar,
  HStack,
  IconButton,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch.js";
import SearchBox from "./SearchBox.js";
import Logo from "./Logo.js";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.js";
import { Link } from "react-router-dom";
import CategoryListAside from "./CategoryListAside.js";
import AreaListAside from "./AreaListAside.js";

interface NavBarProps {
  onSearch: (query: string) => void;
}

const NavBar = ({ onSearch }: NavBarProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = authContext;
  const userName = user?.name || "U";

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack
      spacing={2}
      align="stretch"
      py={2}
      px={4}      
    >
      {/* Top Header Section */}
      <HStack
        justifyContent="space-between"
        align="center"
        width="100%"
        spacing={2}
        display="flex" // Adjust based on screen size
      >
        {/* Logo */}
        <HStack spacing={2}>
          <Logo />
          <Text fontSize="xl" fontWeight="bold">J.RECIPES</Text>
        </HStack>
        <Box flex={1} display={{ base: "none", md: "block" }}>
          <SearchBox onSearch={onSearch} />
        </Box>
        {/* Navigation - only visible in large screens */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>

          {/* Avatar Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Avatar size="sm" name={userName} bgColor="teal" />}
              variant="solid"
              aria-label="User options"
              borderRadius="full"
            />
            <MenuList>
              {user ? (
                <MenuItem as={Link} to="/dashboard">Dashboard</MenuItem>
              ) : (
                <>
                  <MenuItem as={Link} to="/login">Login</MenuItem>
                  <MenuItem as={Link} to="/signup">Signup</MenuItem>
                </>
              )}
            </MenuList>
          </Menu>

          <ColorModeSwitch />
          {/* Burger Menu for smaller screens */}
          <IconButton
            aria-label="Toggle navigation"
            icon={<Text fontSize="xl">☰</Text>}
            display={{ base: "block", md: "none" }}
            onClick={onOpen}
            variant="solid"
          />
        </HStack>
        {/* Burger Menu for smaller screens */}
        <IconButton
          aria-label="Toggle navigation"
          icon={<Text fontSize="xl">☰</Text>}
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          variant="solid"
        />
        {/* Drawer Component - Off-canvas mobile menu */}
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <Text fontSize="lg" fontWeight="bold" mt={4} px={4}>
            {authContext?.user ? "Dashboard" : "Authentication" }
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
            <AreaListAside onAreaClick={onClose} />                        
          </DrawerContent>
        </Drawer>
      </HStack>

      {/* SearchBox - Second line for small screens */}
      <HStack
        spacing={2}
        display={{ base: "block", md: "none" }}
        align="center"
      >
        <SearchBox onSearch={onSearch} />
      </HStack>
    </VStack>
  );
};

export default NavBar;
