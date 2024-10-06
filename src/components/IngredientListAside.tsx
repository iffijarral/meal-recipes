import React, { useState } from 'react'
import useAvailableIngredients from '../hooks/useAvailableIngredients'
import { Box, Button, Heading, HStack, List, ListItem, Spinner } from '@chakra-ui/react';
import { AvailableIngredient } from '../interfaces/AvailableIngredient';

interface Props {
    onSelectIngredient: (ingredient: AvailableIngredient) => void;
    selectedIngredient: AvailableIngredient | null;
  }

const IngredientListAside = ({selectedIngredient, onSelectIngredient}: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const {ingredients, error, loading} = useAvailableIngredients();
    
    const displayedIngredients = isExpanded ? ingredients?.slice(0,20) : ingredients?.slice(0, 5);

    if(error) return <p> {error} </p>
    if(loading) return <Spinner />

  return (
    <Box paddingTop={10}>
          <Heading fontSize="xl">Ingredients</Heading>
          <List>
            {displayedIngredients.map((ingredient) => (
              <ListItem key={ingredient.idIngredient} paddingY="5px">
                <HStack>
                  <Button
                    variant="link"
                    fontSize="medium"
                    onClick={() => onSelectIngredient(ingredient)}
                    colorScheme={
                      selectedIngredient?.strIngredient === ingredient.strIngredient
                        ? "yellow"
                        : "white"
                    }
                  >
                    {ingredient.strIngredient}
                  </Button>
                </HStack>
              </ListItem>
            ))}
            <Button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </List>
        </Box>
  )
}

export default IngredientListAside