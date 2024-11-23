import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import MealDetails from "../../components/MealDetails";
import MealGrid from "../../components/MealGrid";
import { Category } from "../../interfaces/Category";
import { Area } from "../../interfaces/Area";
import { AvailableIngredient } from "../../interfaces/AvailableIngredient";


export interface MealQuery {
  category: Category | null;
  area: Area | null;
  ingredient: AvailableIngredient | null;
}

const AdminHome: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mealQuery, setMealQuery] = useState<MealQuery>({ category: null, area: null, ingredient: null });
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  console.log("AdminHome component rendered");
  return (
    
      <div>Welcome to the Admin Home Page!</div>
    

  );
};
export default AdminHome