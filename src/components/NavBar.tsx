import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.svg";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchBox from "./SearchBox";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between">
      <HStack alignItems="center" gap={0}>
        <Image src={logo} boxSize="60px"></Image>   
        <Text fontSize="3xl" fontWeight="bold">J.RECIPES</Text>
      </HStack>
      <SearchBox />   
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
