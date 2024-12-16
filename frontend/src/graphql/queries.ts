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

export const GET_MEALS_BY_AREA = gql`
  query MealsByArea($area: String!) {
    mealsByArea(area: $area) {
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

export const GET_MEALS_BY_CATEGORY_USER = gql`
  query MealsByCategoryUser($category: String!, $userId: ID!) {
    mealsByCategoryUser(category: $category, userId: $userId) {
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

export const GET_MEAL_BY_NAME = gql`
  query GetMealByName($name: String!) {
    mealByName(name: $name) {
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
    categories{
      strCategory
    }
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

export const GET_CATEGORIES_BY_USER = gql`
  query GetCategoriesByUser($userId: ID!) {
    categoriesByUser(userId: $userId) {
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

export const GET_USERS = gql`
  query GetUsers {
    users {     
      id 
      name
      email
      isVerified
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      isActive
    }
  }
`;