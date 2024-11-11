import React from 'react'
import { SimpleGrid } from '@chakra-ui/react';
import useCategories from '../hooks/useCategories';
import CategoryCard from './CategoryCard';


const CategoryList = () => {
    
    const {categories, error, loading} = useCategories();

  return (
    <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
      spacing={10}
      padding={10}
    >
        {error && <p>{error}</p>}
        {loading && <p>Loading ...</p>}
        {categories.map((category) => (
            <CategoryCard key={category.idCategory} category={category} />
        ))}
    </SimpleGrid>    
  )
}

export default CategoryList