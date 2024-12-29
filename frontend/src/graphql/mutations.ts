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
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
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
      id
      name
      image           
    }
  }
`;

export const UPDATE_MEAL_MUTATION = gql`
  mutation UpdateMeal($id: ID!, $input: MealInput!) {
    updateMeal(id: $id, input: $input) {
      name
    }
  }
`;

export const DELETE_MEAL = gql`
  mutation DeleteMeal($id: ID!) {
    deleteMeal(id: $id) {
      success
      message
      mealId
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
      userId
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    message    
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
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;