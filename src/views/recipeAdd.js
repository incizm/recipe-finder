import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import NavBar from '../views/navBar';
import {db} from '../firebase';
import {addDoc,collection} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const RecipeAdd = ({ addRecipe }) => {
    const [recipe, setRecipe] = useState({ title: '', ingredients: '', instructions: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "recipes"), recipe);
            addRecipe(recipe); 
            setRecipe({ title: '', ingredients: '', instructions: '' });
            navigate("/");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    

    return (
        <>
            <NavBar />
            <Container>
                <h2>Add Recipe</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label style={{marginTop:20}}>Dish</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={recipe.title}
                            onChange={handleChange}
                            placeholder="Enter dish name"
                        />
                    </Form.Group>
                    <Form.Group controlId="formIngredients">
                        <Form.Label style={{marginTop:20}}>Ingredients</Form.Label>
                        <Form.Control
                            type="text"
                            name="ingredients"
                            value={recipe.ingredients}
                            onChange={handleChange}
                            placeholder="Enter ingredients"
                        />
                    </Form.Group>
                    <Form.Group controlId="formInstructions">
                        <Form.Label style={{marginTop:20}}>Instructions</Form.Label>
                        <Form.Control
                            type="text"
                            name="instructions"
                            value={recipe.instructions}
                            onChange={handleChange}
                            placeholder="Enter instructions"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{marginTop:30}} >
                        Add Recipe
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default RecipeAdd;
