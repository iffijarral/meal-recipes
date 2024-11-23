import { useQuery, gql } from '@apollo/client';

export const GET_MEALS = gql`
  query GetMeals {
    meals {
      id
      name
      category
      ingredients {
        name
        measure
      }
      description
      image
      area
      tags
      youtubeLink
    }
  }
`;

export const GET_CATEGORIES_INGREDIENTS = gql`
  query GetCategoriesAndIngredients {
    categories
    ingredients
  }
`;