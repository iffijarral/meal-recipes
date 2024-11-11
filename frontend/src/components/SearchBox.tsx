import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React from 'react';

const SearchBox = () => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)
  
    return (
      <InputGroup size='md' width="50%">
        <Input
          pr='4.5rem'          
          placeholder='Search Meal'
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' mr='5px' onClick={handleClick}>
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
    )
  }
  export default SearchBox;