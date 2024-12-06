import { Avatar, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch.js";
import SearchBox from "./SearchBox.js";
import Logo from "./Logo.js";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.js";
import { Link } from "react-router-dom";
import { IMeal } from "../interfaces/interfaces.js";

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

  return (
    <HStack justifyContent="space-between">
      <HStack as="a" href="/" alignItems="center" gap={0}>
        <Logo />
        <Text fontSize="3xl" fontWeight="bold">J.RECIPES</Text>
      </HStack>
      <SearchBox onSearch={onSearch} />
      <HStack spacing={4} alignItems="center">
        {/* Menu for Login/Signup */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Avatar size="sm" name={userName} bgColor="teal" />} // Profile Icon
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
        {/* Color Mode Switch */}
        <ColorModeSwitch />
      </HStack>
    </HStack>
  );
};

export default NavBar;
