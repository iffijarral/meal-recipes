import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, HttpLink } from '@apollo/client';

interface ApolloWrapperProps {
  children: React.ReactNode;
}
 
const BASE_API_URI = import.meta.env.VITE_REACT_APP_GRAPHQL_URI;
// Create an HttpLink pointing to your GraphQL backend
const httpLink = new HttpLink({
  uri: `/api/graphql`, // The backend URL
});

// Create a middleware link to log outgoing requests
const logLink = new ApolloLink((operation, forward) => {  
  return forward(operation); // Forward the request to the next link in the chain
});

// Combine the middleware link and HttpLink
const link = ApolloLink.from([logLink, httpLink]);

// Create the Apollo Client
const client = new ApolloClient({
  link, // Use the combined link
  cache: new InMemoryCache(),
});

const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

export default ApolloWrapper;
