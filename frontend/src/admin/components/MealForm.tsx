import React, { useState, useContext, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    HStack,
    Heading,
    Select,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEAL_MUTATION } from "../../graphql/mutations"; // Example query
import { GET_CATEGORIES_INGREDIENTS } from "../../graphql/queries";
import { IMealInput } from "../../interfaces/interfaces";
import { Ingredient } from "../../interfaces/Ingredient";
import AuthContext from "../../context/AuthContext";

const MealForm: React.FC = () => {
    // State variables for form fields
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [newCategory, setNewCategory] = useState<string>("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", measure: "" }]);
    const [tags, setTags] = useState<string[]>([]);
    const [area, setArea] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [youtubeLink, setYoutubeLink] = useState<string>("");
    const [newIngredient, setNewIngredient] = useState<string>("");

    // Get user from AuthContext
    const { user } = useContext(AuthContext)!;

    // GraphQL mutation to add a meal
    const [addMeal, { loading, error, data }] = useMutation(ADD_MEAL_MUTATION);

    // Fetch existing categories and ingredients
    const { loading: loadingOptions, error: errorOptions, data: optionsData } = useQuery(
        GET_CATEGORIES_INGREDIENTS
    );

    // Extract categories and ingredients from query data
    const categories = optionsData?.categories || [];
    const availableIngredients = optionsData?.ingredients || [];

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", measure: "" }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validIngredients = ingredients.filter(
            (ing) => ing.name.trim() !== "" && ing.measure.trim() !== ""
        );

        const meal: IMealInput = {
            name: name,
            category: newCategory || category,
            image: image,
            ingredients: validIngredients,
            tags,
            area,
            description,
            youtubeLink,
            userId: user?.userId || "",
        };
        console.log('The user is:', user);
        console.log("meal: ", meal);
        try {
            await addMeal({ variables: { input: meal } });
        } catch (err) {
            console.error("GraphQL error while submitting meal:", err);
        }
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={6}
        >
            <Box
                w="full"
                maxW="xl"
                p={6}
                borderRadius="md"
                boxShadow="lg"
            >
                <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                    <Heading size="lg">Create a New Meal</Heading>

                    <FormControl isRequired>
                        <FormLabel>Meal Name</FormLabel>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter meal name"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Category</FormLabel>
                        <Select
                            placeholder="Select category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            isDisabled={Boolean(newCategory)} // Disable dropdown if new category is being added
                        >
                            {categories.map((cat: string, idx: number) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Select>
                        <Input
                            mt={2}
                            placeholder="Or add new category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            isDisabled={Boolean(category)} // Disable input if a category is selected
                        />
                    </FormControl>

                    <VStack align="start" w="full" spacing={4}>
                        <FormLabel>Ingredients</FormLabel>
                        {ingredients.map((ingredient, index) => (
                            <HStack key={index} w="full" spacing={4}>
                                <Select
                                    placeholder="Select ingredient"
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                    isDisabled={Boolean(newIngredient)}
                                >
                                    {availableIngredients.map((ing: string, idx: number) => (
                                        <option key={idx} value={ing}>
                                            {ing}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    placeholder="Or add new ingredient"
                                    value={newIngredient}
                                    onChange={(e) => {
                                        handleIngredientChange(index, "name", e.target.value);
                                        setNewIngredient(e.target.value);
                                    }}
                                    isDisabled={Boolean(ingredient.name)}
                                />
                                <Input
                                    placeholder="Measure"
                                    value={ingredient.measure}
                                    onChange={(e) => handleIngredientChange(index, "measure", e.target.value)}
                                />
                            </HStack>
                        ))}
                        <Button colorScheme="blue" onClick={addIngredient} size="sm">
                            Add Ingredient
                        </Button>
                    </VStack>

                    <FormControl>
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <Input
                            type="text"
                            placeholder="e.g., spicy, vegan"
                            value={tags.join(", ")}
                            onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Area</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter area of origin"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Enter a brief description of the meal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Image URL</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>YouTube Link</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter YouTube link"
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        isDisabled={loading}
                    >
                        {loading ? <Spinner size="sm" /> : "Submit Meal"}
                    </Button>

                    {error && (
                        <Alert status="error" mt={4}>
                            <AlertIcon />
                            <AlertTitle>Error:</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    {data && (
                        <Alert status="success" mt={4}>
                            <AlertIcon />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>Meal created successfully.</AlertDescription>
                        </Alert>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default MealForm;
