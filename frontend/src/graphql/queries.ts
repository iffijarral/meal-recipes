import { gql } from '@apollo/client';

export const GET_MEALS_BY_CATEGORY = gql`
  query MealsByCategory($category: String!) {
    mealsByCategory(category: $category) {
      id
      name
      category
      tags
      area
      ingredients {
        name
        measure
      }
      youtubeLink
      image
      description
    }
  }
`;

export const GET_MEAL_DETAILS = gql`
  query GetMealById($id: ID!) {
    mealById(id: $id) {
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

export const GET_CATEGORIES_AREAS = gql`
  query GetCategoriesAndAreas {
    categories
    areas
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      idCategory
      strCategory
      strCategoryThumb
    }
  }
`;

export const GET_AREAS = gql`
  query GetAreas {
    areas {      
      strArea      
    }
  }
`;