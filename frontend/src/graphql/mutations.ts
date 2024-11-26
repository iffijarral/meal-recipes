import { gql } from '@apollo/client';



export const SIGNUP_MUTATION = gql`
  mutation signup($input: UserInput!) {
    signup(input: $input) {
      id
      name
      email
      role
      isActive
      isVerified
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const ADD_MEAL_MUTATION = gql`
  mutation AddMeal($input: MealInput!) {
    addMeal(input: $input) {
      name
    }
  }
`;

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($image: Upload!) {
    uploadImage(image: $image) {
      filename
    }
  }
`;