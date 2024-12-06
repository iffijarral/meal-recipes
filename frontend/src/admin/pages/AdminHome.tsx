import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import MobileHeader from "../components/MobileHeader.js";
import AuthContext from "../../context/AuthContext.js";


const AdminHome = () => {

  const [name, setName] = useState<string>('');

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user } = authContext;

  useEffect(() => {
    
    if(user?.name)
      setName(user?.name)
  }, [])
    
  return (
    
      <Text> Welcome {user?.name}, Ready to cook something delicious today? </Text>    

  ); 
};
export default AdminHome