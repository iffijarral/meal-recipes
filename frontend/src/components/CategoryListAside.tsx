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
  Link
} from "@chakra-ui/react";
import { ICategory } from "../interfaces/interfaces.js";
import { GET_CATEGORIES } from "../graphql/queries.js";
import AuthContext from "../context/AuthContext.js";

const CategoryListAside = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();

  // Use context with proper type checking
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { selectedCategory, setSelectedCategory } = authContext;

  const { data, error, loading } = useQuery(GET_CATEGORIES, { fetchPolicy: 'network-only' });

  const displayedCategories: ICategory[] = isExpanded
    ? data?.categories || []
    : data?.categories.slice(0, 5) || [];

  if (error) return null;

  if (loading) return <Spinner />;

  const onSelectCategory = (category: ICategory) => {
    setSelectedCategory(category);
  };

  return (
    <Box paddingTop={10}>
      <Heading fontSize="xl">Categories</Heading>
      <List>
        {displayedCategories.map((category: ICategory) => (
          <ListItem key={category.idCategory} paddingY="5px">
            <HStack>              
              <Button
                variant="link"
                fontSize="medium"
                onClick={() => { onSelectCategory(category); }}
                _hover={{ textDecoration: 'none', bg: 'blue.700' }}
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
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      </List>
    </Box>
  );
};

export default CategoryListAside;