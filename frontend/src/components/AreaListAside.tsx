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
import { useContext, useState } from "react";
import { IArea } from "../interfaces/interfaces.js";
import useAreas from "../hooks/useAreas.js";
import { useQuery } from "@apollo/client";
import { GET_AREAS } from "../graphql/queries.js";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.js";

const AreaListAside = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();

  // Use context with proper type checking
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { selectedArea, setSelectedArea } = authContext;

  const { data, error, loading } = useQuery(GET_AREAS, {
    fetchPolicy: "network-only",
  });

  const displayedAreas: IArea[] = isExpanded
    ? data?.areas || []
    : data?.areas?.slice(0, 5) || [];

  if (error) return <Text> {error.message} </Text>;

  if (loading) return <Spinner />;

  return (
    <>
      <Box paddingTop={10}>
        <Heading fontSize="xl">Areas</Heading>
        <List>
          {displayedAreas && displayedAreas.map((area: IArea, index) => (
            <ListItem key={index} paddingY="5px">
              <HStack>
                <Button
                  variant="link"
                  fontSize="medium"
                  onClick={() => setSelectedArea(area)}
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
