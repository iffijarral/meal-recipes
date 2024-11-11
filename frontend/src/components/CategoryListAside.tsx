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
import { Category } from "../interfaces/Category";
import useCategories from "../hooks/useCategories";

interface Props {
  onSelectCategory: (category: Category) => void;
  selectedCategory: Category | null;
}

const CategoryListAside = ({ onSelectCategory, selectedCategory }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { categories, error, loading } = useCategories();

  const displayedCategorys = isExpanded ? categories : categories?.slice(0, 5);

  if (error) return null;

  if (loading) return <Spinner />;

  return (
    <>
      <Box paddingTop={10}>
        <Heading fontSize="xl">Categories</Heading>
        <List>
          {displayedCategorys.map((Category) => (
            <ListItem key={Category.idCategory} paddingY="5px">
              <HStack>
                <Button
                  variant="link"
                  fontSize="medium"
                  onClick={() => onSelectCategory(Category)}
                  colorScheme={
                    selectedCategory?.idCategory === Category.idCategory
                      ? "yellow"
                      : "white"
                  }
                >
                  {Category.strCategory}
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
