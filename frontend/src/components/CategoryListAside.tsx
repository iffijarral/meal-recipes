import {
  Box,
  Button,
  Heading,
  HStack,
  List,
  ListItem,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { Category } from "../interfaces/Category.js";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries.js";

interface Props {
  onSelectCategory: (category: Category) => void;
  selectedCategory: Category | null;
}

const CategoryListAside = ({ onSelectCategory, selectedCategory }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, error, loading } = useQuery(GET_CATEGORIES, {fetchPolicy: 'network-only'});    

  const displayedCategorys: Category[] = isExpanded
  ? data?.categories || []
  : data?.categories.slice(0, 5) || [];

  if (error) return null;

  if (loading) return <Spinner />;

  return (
    <>
      <Box paddingTop={10}>
        <Heading fontSize="xl">Categories</Heading>
        <List>
          {displayedCategorys && displayedCategorys.map((category: Category) => (
            <ListItem key={category.idCategory} paddingY="5px">
              <HStack>
                <Button
                  variant="link"
                  fontSize="medium"
                  onClick={() => onSelectCategory(category)}
                  colorScheme={
                    selectedCategory?.idCategory === category.idCategory
                      ? "yellow"
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
    </>
  );
};

export default CategoryListAside;
