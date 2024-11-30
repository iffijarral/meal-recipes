import { useQuery } from '@apollo/client';
import React from 'react'
import { GET_MEALS_BY_CATEGORY } from '../graphql/queries.js';

const Test = () => {
    const {data, error, loading} = useQuery(
        GET_MEALS_BY_CATEGORY, { variables: { category: 'Beef' }}
    );
    console.log(data);
  return (
    <div>Test</div>
  )
}

export default Test