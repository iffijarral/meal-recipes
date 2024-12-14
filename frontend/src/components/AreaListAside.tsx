import { useNavigate } from "react-router-dom";
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
import { useQuery } from "@apollo/client";
import { GET_AREAS } from "../graphql/queries.js";
import AuthContext from "../context/AuthContext.js";

interface Props{
  onAreaClick?: () => void;
}

const AreaListAside = ({ onAreaClick }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error("AuthContext must be used within an AuthProvider");

  const { selectedArea, setSelectedArea } = authContext;
  const { data, error, loading } = useQuery(GET_AREAS, { fetchPolicy: "network-only" });

  const displayedAreas = isExpanded
    ? data?.areas || []
    : data?.areas?.slice(0, 5) || [];

  if (error) return <Text>{error.message}</Text>;
  if (loading) return <Spinner />;

  const handleAreaClick = (area: IArea) => {
    setSelectedArea(area);
    authContext.setSelectedCategory(null); // Clear category selection
    if (onAreaClick) onAreaClick();
    navigate("/");
  };

  return (
    <Box paddingTop={10}>
      <Text fontSize="lg" fontWeight="bold" px={4} mt={2}>
        Areas
      </Text>
      <List>
        {displayedAreas.map((area: IArea, index: string) => (
          <ListItem key={index} paddingY="5px">
            <HStack px={4}>
              <Button
                variant="link"
                fontSize="medium"
                onClick={() => handleAreaClick(area)}
                colorScheme={
                  selectedArea?.strArea === area.strArea ? "yellow" : "white"
                }
              >
                {area.strArea}
              </Button>
            </HStack>
          </ListItem>
        ))}
        <Button onClick={() => setIsExpanded(!isExpanded)} ml={4}>
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      </List>
    </Box>
  );
};

export default AreaListAside;