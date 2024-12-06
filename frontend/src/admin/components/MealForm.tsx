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
    FormErrorMessage,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEAL_MUTATION, UPDATE_MEAL_MUTATION, UPLOAD_IMAGE } from "../../graphql/mutations.js";
import { GET_CATEGORIES_INGREDIENTS, GET_MEAL_DETAILS, GET_MEALS_BY_CATEGORY_USER } from "../../graphql/queries.js";
import AuthContext from "../../context/AuthContext.js";
import { ICategory, IMeal } from "../../interfaces/interfaces.js";
import { ValidationErrorItem } from "joi";
import { validate, validateFile } from "../../utils/validation.js";
import mealFormSchema from "../../schemas/mealFormSchema.js";
import { getErrorMessage } from "../../utils/validation.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";



const MealForm = () => {
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

    const { mealId } = useParams(); // When to use for edit
    const navigate = useNavigate();

    const isUpdate = !!mealId;

    const { user } = useContext(AuthContext)!;

    const [addMeal, { loading, error, data }] = useMutation(ADD_MEAL_MUTATION, {        
        onCompleted: (data) => {
            console.log('Meal added successfully:', data);            
            navigate("/dashboard/meals", { state: { newMeal: data.addMeal } });
        },
        onError: (error) => {
            console.error("Error adding meal:", error);
        },
    });
    const [updateMeal, { loading: updating, error: updateError, data: updateData }] = useMutation(UPDATE_MEAL_MUTATION);
    const [uploadImage] = useMutation(UPLOAD_IMAGE);
    const { loading: loadingOptions, error: errorOptions, data: optionsData } = useQuery(
        GET_CATEGORIES_INGREDIENTS
    );

    const { data: editMealData, loading: editMealLoading } = useQuery(GET_MEAL_DETAILS, {
        variables: { id: mealId },
        skip: !mealId, // Skip query if mealId is not present (add mode)
    });

    const categories = optionsData?.categories || [];
    const availableIngredients = optionsData?.ingredients || [];

    const BASE_API_URI = import.meta.env.VITE_REACT_APP_GRAPHQL_URI;

    useEffect(() => {
        if (editMealData && mealId) {
            const meal = editMealData.mealById;
            setName(meal.name || "");
            meal.category ? setCategory({ strCategory: meal.category }) : setCategory(null);
            setIngredients(meal.ingredients || [{ name: "", measure: "" }]);
            setTags(meal.tags || []);
            setArea(meal.area || "");
            setDescription(meal.description || "");
            setYoutubeLink(meal.youtubeLink || "");
        }
    }, [editMealData, mealId]);

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

        const validIngredients = ingredients
            .filter((ing) => ing.name.trim() !== "" && ing.measure.trim() !== "")
            .map((ingredient) => {
                // Only destructure if __typename exists
                if ('__typename' in ingredient) {
                    const { __typename, ...rest } = ingredient;
                    return rest;
                }
                return ingredient;
            });

        let imageUrl = "";

        if (file) {

            try {
                console.log('sending image:', file);
                validateFile(file);
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
            userId: user?.id || "",
            ...(imageUrl && { image: imageUrl }) // Conditionally include the image property
        };

        const { valid, errors: validationErrors } = validate(mealFormSchema(isUpdate), meal);

        if (!valid) {
            console.log("validation Errors", validationErrors);
            setErrors(validationErrors || []);
            return;
        }

        try {
            if (isUpdate) {
                // Edit mode
                await updateMeal({ variables: { id: mealId, input: meal } });

            } else {
                // Add mode
                await addMeal({ variables: { input: meal } });

            }
            resetForm();

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

                    {isUpdate ? <Heading size="lg">Update Meal</Heading> : <Heading size="lg">Create a New Meal</Heading>}

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

                    <FormControl isRequired={!isUpdate}>
                        <FormLabel>Upload Image</FormLabel>
                        <Input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.webp" />
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
