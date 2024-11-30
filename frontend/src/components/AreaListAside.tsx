import {
    Box,
    Button,
    Heading,
    HStack,
    List,
    ListItem,
    Spinner,
    Text,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { Area } from "../interfaces/Area.js";
  import useAreas from "../hooks/useAreas.js";
import { useQuery } from "@apollo/client";
import { GET_AREAS } from "../graphql/queries.js";
  
  interface Props {
    onSelectArea: (area: Area) => void;
    selectedArea: Area | null;
  }
  
  const AreaListAside = ({ onSelectArea, selectedArea }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const { data, error, loading } = useQuery(GET_AREAS, {
      fetchPolicy: "network-only",
    });
        
    const displayedAreas: Area[] = isExpanded
    ? data?.areas || []
    : data?.areas?.slice(0, 5) || [];
  
    if (error) return <Text> { error.message } </Text>;
  
    if (loading) return <Spinner />;
  
    return (
      <>
        <Box paddingTop={10}>
          <Heading fontSize="xl">Areas</Heading>
          <List>
            {displayedAreas && displayedAreas.map((area: Area, index) => (
              <ListItem key={index} paddingY="5px">
                <HStack>
                  <Button
                    variant="link"
                    fontSize="medium"
                    onClick={() => onSelectArea(area)}
                    colorScheme={
                      selectedArea?.strArea === area.strArea
                        ? "yellow"
                        : "white"
                    }
                  >
                    {area.strArea}
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
  