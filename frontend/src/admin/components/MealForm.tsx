import React, { useState, useContext } from "react";
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
import { ADD_MEAL_MUTATION, UPLOAD_IMAGE } from "../../graphql/mutations.js";
import { GET_CATEGORIES_INGREDIENTS } from "../../graphql/queries.js";
import AuthContext from "../../context/AuthContext.js";

const MealForm: React.FC = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", measure: "" }]);
    const [tags, setTags] = useState<string[]>([]);
    const [area, setArea] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [newIngredient, setNewIngredient] = useState("");

    const { user } = useContext(AuthContext)!;

    const [addMeal, { loading, error, data }] = useMutation(ADD_MEAL_MUTATION);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const { loading: loadingOptions, error: errorOptions, data: optionsData } = useQuery(
        GET_CATEGORIES_INGREDIENTS
    );

    const categories = optionsData?.categories || [];
    const availableIngredients = optionsData?.ingredients || [];

    const BASE_API_URI = import.meta.env.VITE_REACT_APP_GRAPHQL_URI;

    const handleIngredientChange = (index: number, field: string, value: string) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", measure: "" }]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validIngredients = ingredients.filter(
            (ing) => ing.name.trim() !== "" && ing.measure.trim() !== ""
        );

        let imageUrl = "";
        if (file) {
            
            try {
                console.log('sending image:', file);
                const { data } = await uploadImage({ variables: { "image": file } });
                imageUrl = data.uploadImage.filename;
                console.log('fetched image data', data);
            } catch (err) {
                console.error("Error uploading image:", err);
            }
        }

        const meal = {
            name,
            category: newCategory || category,
            ingredients: validIngredients,
            tags,
            area,
            description,
            youtubeLink,
            image: imageUrl,
            userId: user?.userId || "",
        };

        try {
            await addMeal({ variables: { input: meal } });
        } catch (err) {
            console.error("Error adding meal:", err);
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
            <Box w="full" maxW="xl" p={6} borderRadius="md" boxShadow="lg">
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
                            isDisabled={Boolean(newCategory)}
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
                            isDisabled={Boolean(category)}
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
                                    onChange={(e) => setNewIngredient(e.target.value)}
                                    onBlur={() => handleIngredientChange(index, "name", newIngredient)}
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
                        <FormLabel>Upload Image</FormLabel>
                        <Input type="file" onChange={handleFileChange} />
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
                        isDisabled={loading || loadingOptions}
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
