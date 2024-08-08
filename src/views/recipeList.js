import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../views/navBar';
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const RecipeList = () => {
    const [search, setSearch] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [apiRecipes, setApiRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            const recipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            console.log("Fetched recipes from Firestore:", recipesData);
            setRecipes(recipesData);
            setFilteredRecipes(recipesData);
        };

        fetchRecipes();
    }, []);

    const fetchApiRecipes = async () => {
        const response = await fetch(`https://api.edamam.com/search?q=${search}&app_id=9d028828&app_key=ce8966c591e5f1b5500d9db1a8dac02c`);
        const data = await response.json();
        setApiRecipes(data.hits);
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        
        fetchApiRecipes();

       
        try {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            const recipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            console.log("Fetched recipes from Firestore for search:", recipesData); 

            const ingredientsArray = search.toLowerCase().split(',').map(ingredient => ingredient.trim());
            console.log("Search ingredients array:", ingredientsArray); 

            const filteredData = recipesData.filter(recipe => {
                const recipeIngredients = recipe.ingredients.toLowerCase().replace(/[\n0-9.,#!$%&*;:{}=\-_`~()]/g, "").split(' ').map(ingredient => ingredient.trim());
                console.log("Recipe ingredients array:", recipeIngredients); 
                const match = ingredientsArray.some(ingredient => recipeIngredients.includes(ingredient));
                console.log(`Recipe "${recipe.title}" match:`, match); 
                return match;
            });

            console.log("Filtered recipes:", filteredData); 
            setFilteredRecipes(filteredData);
        } catch (error) {
            console.error("Error searching recipes: ", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const recipeRef = doc(db, "recipes", id);
            await deleteDoc(recipeRef);
            setRecipes(recipes.filter(recipe => recipe.id !== id));
            setFilteredRecipes(filteredRecipes.filter(recipe => recipe.id !== id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <h1 className="text-center my-4">Cooking for All</h1>
                <Form onSubmit={handleSearch} className="mb-4">
                    <Form.Group controlId="searchInput">Input ingredients:
                        <Form.Control
                            type="text"
                            placeholder="Search recipes"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    <p></p>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Search
                    </Button>
                </Form>
                <Row className="mt-4">
                    {filteredRecipes.map((recipe, index) => (
                        <Col key={index} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{recipe.title}</Card.Title>
                                    <Card.Text>
                                        {recipe.ingredients}
                                    </Card.Text>
                                    <Card.Text>
                                        {recipe.instructions}
                                    </Card.Text>
                                    <Button variant="primary" as={Link} to={`/update/${recipe.id}`}>
                                        Update
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(recipe.id)}>
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    {apiRecipes.map((recipe, index) => (
                        <Col key={index} md={4} className="mb-4">
                            <Card>
                                <Card.Img variant="top" src={recipe.recipe.image} />
                                <Card.Body>
                                    <Card.Title>{recipe.recipe.label}</Card.Title>
                                    <Card.Text>
                                        {recipe.recipe.ingredientLines.join(', ')}
                                    </Card.Text>
                                    <Button variant="primary" href={recipe.recipe.url} target="_blank">
                                        View Recipe
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default RecipeList;
