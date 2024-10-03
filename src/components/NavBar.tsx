import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchBox from "./SearchBox";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between">
      <Image src={logo} boxSize="60px"></Image>   
      <SearchBox />   
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
