import React from 'react';
import { 
    ApolloClient, 
    InMemoryCache, 
    ApolloProvider, 
    ApolloLink 
} from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { onError } from '@apollo/client/link/error';

interface ApolloWrapperProps {
  children: React.ReactNode;
}

const BASE_API_URI = import.meta.env.VITE_REACT_APP_GRAPHQL_URI;

const httpLink = createUploadLink({
  uri: BASE_API_URI, // Dynamically read from environment variables
  credentials: 'include', // Include credentials with requests
  headers: {
    'Apollo-Require-Preflight': 'true',
    'Content-Type': 'application/json',
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

export default ApolloWrapper;
