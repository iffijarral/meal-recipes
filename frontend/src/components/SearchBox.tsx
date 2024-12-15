import { Button, FormControl, FormErrorMessage, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { searchSchema } from '../schemas/searchSchema.js';


interface SearchProps {
  onSearch: (query: string) => void;
}

interface searchInput {
  name: string | '';
}

const SearchBox = ({ onSearch }: SearchProps) => {
  const [show, setShow] = React.useState(false)
  const [searchInput, setSearchInput] = useState<string>('');
  const [inputError, setInputError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setInputError(""); // Reset error when user starts typing
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the search input using Joi schema
    const { error } = searchSchema.validate({ query: searchInput });

    if (error) {
      // If validation fails, set the error message
      setInputError(error.details[0].message);
      return;
    }

    // Clear previous errors and proceed with the search
    setInputError("");
    onSearch(searchInput); // Send search input to parent
    setSearchInput("");
  };  

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} width="50%" mx="auto" alignItems="stretch">
      <FormControl isInvalid={inputError.length > 0}>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            name="query"
            placeholder="Search Meal"
            value={searchInput}
            onChange={handleChange}
            focusBorderColor="blue.500"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" mr="5px" type="submit">
              Search
            </Button>
          </InputRightElement>
        </InputGroup>
        {inputError.length > 0 && (
          <FormErrorMessage>                        
              <div>{inputError}</div>            
          </FormErrorMessage>
        )}
      </FormControl>
    </VStack>
  )
}
export default SearchBox;