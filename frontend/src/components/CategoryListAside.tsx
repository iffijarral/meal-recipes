import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Heading,
  HStack,
  List,
  ListItem,
  Spinner,
  Link,
  Text
} from "@chakra-ui/react";
import { ICategory } from "../interfaces/interfaces.js";
import { GET_CATEGORIES } from "../graphql/queries.js";
import AuthContext from "../context/AuthContext.js";

interface Props{
  onCategoryClick?: () => void;
}

const CategoryListAside = ({ onCategoryClick }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error("AuthContext must be used within an AuthProvider");

  const { selectedCategory, setSelectedCategory } = authContext;
  const { data, error, loading } = useQuery(GET_CATEGORIES, { fetchPolicy: "network-only" });

  const displayedCategories = isExpanded
    ? data?.categories || []
    : data?.categories?.slice(0, 5) || [];

  if (error) return null;
  if (loading) return <Spinner />;

  const handleCategoryClick = (category: ICategory) => {
    setSelectedCategory(category);
    authContext.setSelectedArea(null); // Clear area selection
    if (onCategoryClick) onCategoryClick();
    navigate("/");
  };

  return (
    <Box paddingTop={10}>
      <Text fontSize="lg" fontWeight="bold" px={4} mt={2}>
        Categories
      </Text>
      <List>
        {displayedCategories.map((category: ICategory) => (
          <ListItem key={category.idCategory} paddingY="5px">
            <HStack px={4}>
              <Button
                variant="link"
                fontSize="medium"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCategoryClick(category);
                }}
                _hover={{ textDecoration: "none", bg: "blue.700" }}
                colorScheme={
                  selectedCategory?.idCategory === category.idCategory
                    ? "teal"
                    : "white"
                }
              >
                {category.strCategory}
              </Button>
            </HStack>
          </ListItem>
        ))}
        <Button onClick={() => setIsExpanded(!isExpanded)} ml={4}>
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      </List>
    </Box>
  );
};

export default CategoryListAside;