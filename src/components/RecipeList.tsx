import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Recipe {
  _id: string;
  name: string;
  description: string;
}

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading recipes...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Link key={recipe._id} to={`/recipe/${recipe._id}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{recipe.name}</h2>
            <p className="text-gray-600">{recipe.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipeList;