import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RecipeList from './views/recipeList';
import RecipeAdd from './views/recipeAdd';
import RecipeUpdate from './views/recipeUpdate';
import RecipeDelete from './views/recipeDelete';
import './App.css';

function App() {
    const [recipes, setRecipes] = useState([]);

    const addRecipe = (recipe) => {
        setRecipes([...recipes, { ...recipe, id: Date.now().toString() }]);
    };

    const updateRecipe = (updatedRecipe) => {
        setRecipes(
            recipes.map((recipe) =>
                recipe.id === updatedRecipe.id ? updatedRecipe : recipe
            )
        );
    };

    const deleteRecipe = (id) => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
    };

    const router = createBrowserRouter([
        { path: "/", element: <RecipeList recipes={recipes} deleteRecipe={deleteRecipe} /> },
        { path: "/update/:id", element: <RecipeUpdate recipes={recipes} updateRecipe={updateRecipe} /> },
        { path: "/add", element: <RecipeAdd addRecipe={addRecipe} /> },
        { path: "/delete/:id", element: <RecipeDelete deleteRecipe={deleteRecipe} /> },
    ]);

    return (
        <RouterProvider router={router} />
    );
}

export default App;
