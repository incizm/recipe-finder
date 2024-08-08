import React, { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import NavBar from '../views/navBar';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const RecipeUpdate = ({ updateRecipe, recipes }) => {
    const [recipe, setRecipe] = useState({ title: '', ingredients: '', instructions: '' });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const recipeToEdit = recipes.find((r) => r.id === id);
        if (recipeToEdit) {
            console.log("Loaded recipe:", recipeToEdit); //for some reason this isn't working
            setRecipe(recipeToEdit);
        }
    }, [id, recipes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const recipeRef = doc(db, "recipes", id);
            await updateDoc(recipeRef, {
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions
            });
            updateRecipe(recipe);
            navigate('/');
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <h2>Update Recipe</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={recipe.title}
                            onChange={handleChange}
                            placeholder="Enter recipe title"
                        />
                    </Form.Group>
                    <Form.Group controlId="formIngredients">
                        <Form.Label>Ingredients</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="ingredients"
                            value={recipe.ingredients}
                            onChange={handleChange}
                            placeholder="Enter ingredients"
                        />
                    </Form.Group>
                    <Form.Group controlId="formInstructions">
                        <Form.Label>Instructions</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="instructions"
                            value={recipe.instructions}
                            onChange={handleChange}
                            placeholder="Enter instructions"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Update Recipe
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default RecipeUpdate;
