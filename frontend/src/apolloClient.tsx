import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

interface ApolloWrapperProps {
  children: React.ReactNode;
}

const client = new ApolloClient({
  uri: import.meta.env.REACT_APP_API_URL, // The backend URL
  cache: new InMemoryCache(),
});

const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

export default ApolloWrapper;
