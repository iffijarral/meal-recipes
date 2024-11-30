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
});

// const logLink = new ApolloLink((operation, forward) => {
//   console.log(`Starting request for ${operation.operationName}`);
//   console.log('Variables:', operation.variables);
//   return forward(operation).map((response) => {
//     console.log(`Completed request for ${operation.operationName}`);
//     console.log('Response:', response);
//     return response;
//   });
// });

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ message, locations, path }) => {
//       console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
//     });
//   }
//   if (networkError) console.error(`[Network error]: ${networkError}`);
// });

// const link = ApolloLink.from([logLink, errorLink, httpLink]);

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
