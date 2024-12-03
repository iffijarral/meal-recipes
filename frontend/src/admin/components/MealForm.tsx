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
    FormErrorMessage,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEAL_MUTATION, UPLOAD_IMAGE } from "../../graphql/mutations.js";
import { GET_CATEGORIES_INGREDIENTS } from "../../graphql/queries.js";
import AuthContext from "../../context/AuthContext.js";
import { ICategory } from "../../interfaces/interfaces.js";
import { ValidationErrorItem } from "joi";
import { validate } from "../../utils/validation.js";
import mealFormSchema from "../../schemas/mealFormSchema.js";
import { getErrorMessage } from "../../utils/validation.js";

const MealForm: React.FC = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState<ICategory | null>(null);
    const [newCategory, setNewCategory] = useState<ICategory | null>(null);
    const [ingredients, setIngredients] = useState([{ name: "", measure: "" }]);
    const [tags, setTags] = useState<string[]>([]);
    const [area, setArea] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [errors, setErrors] = useState<ValidationErrorItem[]>([]);

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

    const removeIngredient = (index: number) => {
        setIngredients((prevIngredients) => 
            prevIngredients.filter((_, i) => i !== index)
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setName("");
        setCategory(null);
        setNewCategory(null);
        setIngredients([{ name: "", measure: "" }]);
        setTags([]);
        setArea("");
        setDescription("");
        setFile(null);
        setYoutubeLink("");
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
            category: newCategory?.strCategory || category?.strCategory,
            ingredients: validIngredients,
            tags,
            area,
            description,
            youtubeLink,
            image: imageUrl,
            userId: user?.id || "",
        };

        const { valid, errors: validationErrors } = validate(mealFormSchema, meal);

        if (!valid) {
            console.log("validation Errors", validationErrors);
            setErrors(validationErrors || []);
            return;
        }

        try {
            await addMeal({ variables: { input: meal } });
            resetForm() // Reset the form after successful submission
        } catch (err) {
            console.error("Error adding meal:", err);
        }

        setErrors([]);
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

                    <FormControl isInvalid={Boolean(getErrorMessage(errors, "name"))}>
                        <FormLabel>Meal Name</FormLabel>
                        <Input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter meal name"
                        />
                        <FormErrorMessage>{getErrorMessage(errors, 'name')}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={Boolean(getErrorMessage(errors, "category"))}>
                        <FormLabel>Category</FormLabel>
                        <Select
                            placeholder="Select category"
                            name="category"
                            value={category?.strCategory}
                            onChange={(e) => setCategory({ strCategory: e.target.value })}
                            isDisabled={Boolean(newCategory)}
                        >
                            {categories.map((cat: ICategory, idx: number) => (
                                <option key={idx} value={cat.strCategory}>
                                    {cat.strCategory}
                                </option>
                            ))}
                        </Select>
                        <FormErrorMessage>{getErrorMessage(errors, 'category')}</FormErrorMessage>
                        <Input
                            mt={2}
                            placeholder="Or add new category"
                            value={newCategory?.strCategory}
                            onChange={(e) => setNewCategory({ strCategory: e.target.value })}
                            isDisabled={Boolean(category)}
                        />
                        <FormErrorMessage>{getErrorMessage(errors, 'newCategory')}</FormErrorMessage>
                    </FormControl>

                    <VStack align="start" w="full" spacing={4}>
                        <FormLabel>Ingredients</FormLabel>
                        {ingredients.map((ingredient, index) => (
                            <React.Fragment key={index}>
                                <HStack w="full" spacing={4}>
                                    {/* Dropdown for existing ingredients */}
                                    <FormControl isInvalid={!!getErrorMessage(errors, `ingredients[${index}].name`)}>
                                        <FormLabel srOnly>Ingredient {index + 1}</FormLabel>
                                        <Select
                                            placeholder="Select ingredient"
                                            value={ingredient.name}
                                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                            aria-label={`Ingredient ${index + 1} - Select existing`}
                                        >
                                            {availableIngredients.map((ing: string, idx: number) => (
                                                <option key={idx} value={ing}>
                                                    {ing}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormErrorMessage>
                                            {getErrorMessage(errors, `ingredients[${index}].name`)}
                                        </FormErrorMessage>
                                    </FormControl>

                                    {/* Input for new ingredient */}
                                    <FormControl isInvalid={!!getErrorMessage(errors, `ingredients[${index}].name`)}>
                                        <FormLabel srOnly>New Ingredient {index + 1}</FormLabel>
                                        <Input
                                            placeholder="Or add a new ingredient"
                                            value={ingredient.name}
                                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                            aria-label={`Ingredient ${index + 1} - Add new`}
                                        />
                                        <FormErrorMessage>
                                            {getErrorMessage(errors, `ingredients[${index}].name`)}
                                        </FormErrorMessage>
                                    </FormControl>

                                    {/* Input for measure */}
                                    <FormControl isInvalid={!!getErrorMessage(errors, `ingredients[${index}].measure`)}>
                                        <FormLabel srOnly>Measure {index + 1}</FormLabel>
                                        <Input
                                            placeholder="Measure (e.g., 1 cup, 2 tbsp)"
                                            value={ingredient.measure}
                                            onChange={(e) => handleIngredientChange(index, "measure", e.target.value)}
                                            aria-label={`Ingredient ${index + 1} - Measure`}
                                        />
                                        <FormErrorMessage>
                                            {getErrorMessage(errors, `ingredients[${index}].measure`)}
                                        </FormErrorMessage>
                                    </FormControl>

                                    {/* Remove Ingredient Button */}
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => removeIngredient(index)}
                                        aria-label={`Remove ingredient ${index + 1}`}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </HStack>
                            </React.Fragment>
                        ))}

                        {/* Add Ingredient Button */}
                        <Button
                            colorScheme="blue"
                            onClick={addIngredient}
                            size="sm"
                            mt={2}
                            aria-label="Add new ingredient"
                        >
                            Add Ingredient
                        </Button>

                        {/* General Ingredients Error Message */}
                        <FormControl isInvalid={!!getErrorMessage(errors, "ingredients")}>
                            <FormErrorMessage>{getErrorMessage(errors, "ingredients")}</FormErrorMessage>
                        </FormControl>
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

                    <FormControl isInvalid={Boolean(getErrorMessage(errors, "area"))}>
                        <FormLabel>Area</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter area of origin"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        />
                        <FormErrorMessage>{getErrorMessage(errors, "area")}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Enter a brief description of the meal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Upload Image</FormLabel>
                        <Input type="file" onChange={handleFileChange} />
                    </FormControl>

                    <FormControl isInvalid={Boolean(getErrorMessage(errors, "youtubeLink"))} >
                        <FormLabel>YouTube Link</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter YouTube link"
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                        />
                        <FormErrorMessage>{getErrorMessage(errors, "youtubeLink")}</FormErrorMessage>
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
