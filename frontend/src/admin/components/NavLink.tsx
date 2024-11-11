import React from "react";
import { Link, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const activeColor = useColorModeValue("blue.600", "blue.300");
  const inactiveColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Link
      as={RouterLink}
      to={href}
      fontWeight="medium"
      color={inactiveColor}
      _hover={{ color: activeColor }}
      _activeLink={{ color: activeColor, fontWeight: "bold" }}
    >
      {children}
    </Link>
  );
};
