import {
    Box,
    Button,
    Heading,
    HStack,
    List,
    ListItem,
    Spinner,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { Area } from "../interfaces/Area";
  import useAreas from "../hooks/useAreas";
  
  interface Props {
    onSelectArea: (area: Area) => void;
    selectedArea: Area | null;
  }
  
  const AreaListAside = ({ onSelectArea, selectedArea }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const { areas, error, loading } = useAreas();
    
    const displayedAreas = isExpanded ? areas : areas?.slice(0, 5);
  
    if (error) return null;
  
    if (loading) return <Spinner />;
  
    return (
      <>
        <Box paddingTop={10}>
          <Heading fontSize="xl">Areas</Heading>
          <List>
            {displayedAreas.map((Area) => (
              <ListItem key={Area.strArea} paddingY="5px">
                <HStack>
                  <Button
                    variant="link"
                    fontSize="medium"
                    onClick={() => onSelectArea(Area)}
                    colorScheme={
                      selectedArea?.strArea === Area.strArea
                        ? "yellow"
                        : "white"
                    }
                  >
                    {Area.strArea}
                  </Button>
                </HStack>
              </ListItem>
            ))}
            <Button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </List>
        </Box>
      </>
    );
  };
  
  export default AreaListAside;
  