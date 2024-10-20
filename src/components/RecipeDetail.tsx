import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Ingredient {
  name: string;
  amount: string;
}

interface Recipe {
  _id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
}

const RecipeDetail: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{recipe.name}</h1>
      <p className="text-gray-600 mb-6">{recipe.description}</p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ingredients</h2>
      <ul className="list-disc list-inside mb-6">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-gray-700">
            {ingredient.amount} {ingredient.name}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Instructions</h2>
      <ol className="list-decimal list-inside">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="text-gray-700 mb-2">{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDetail;