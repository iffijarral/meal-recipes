import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!, $role: String!, $isActive: Boolean!, $isVerified: Boolean!) {
    signup(name: $name, email: $email, password: $password, role: $role, isActive: $isActive, isVerified: $isVerified) {
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