import { HStack, Switch, useColorMode } from '@chakra-ui/react';

const ColorModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <HStack>
                <Switch 
                    colorScheme='green'
                    isChecked = {colorMode == "dark"}
                    onChange={toggleColorMode}
                >

                </Switch>                
            </HStack>
        </>    
  );
}

export default ColorModeSwitch