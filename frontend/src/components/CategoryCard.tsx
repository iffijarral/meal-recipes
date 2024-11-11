import React from 'react'
import { Category } from '../interfaces/Category'
import { Card, CardHeader, CardBody, CardFooter, Image, Heading, Text } from '@chakra-ui/react'

interface Props {
    category: Category;
}

const CategoryCard = ({category}: Props) => {
  return (
    <Card borderRadius="10" overflow="hidden">
        <Image src={category.strCategoryThumb} alt={category.strCategory+category.idCategory} />
        <CardBody>
            <Heading textAlign="center" fontSize="2xl">{category.strCategory}</Heading>            
        </CardBody>

    </Card>
  )
}

export default CategoryCard