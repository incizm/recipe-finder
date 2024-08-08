import React from 'react';
import { Button, Container } from 'react-bootstrap';
import NavBar from '../views/navBar';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const RecipeDelete = ({ deleteRecipe }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            console.log("Deleting recipe with ID:", id); 
            const recipeRef = doc(db, "recipes", id);
            await deleteDoc(recipeRef);
            deleteRecipe(id); 
            navigate('/');
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <h2>Delete Recipe</h2>
                <Button variant="danger" onClick={handleDelete}>
                    Delete Recipe
                </Button>
            </Container>
        </>
    );
};

export default RecipeDelete;
