import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: [''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
    const newIngredients = recipe.ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = recipe.instructions.map((instruction, i) => {
      if (i === index) {
        return value;
      }
      return instruction;
    });
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '' }],
    });
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, ''],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/recipes', recipe);
      navigate('/');
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Recipe</h1>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Recipe Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
              placeholder="Amount"
              className="w-1/3 px-3 py-2 border rounded-md mr-2"
              required
            />
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              placeholder="Ingredient"
              className="w-2/3 px-3 py-2 border rounded-md"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add Ingredient
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Instructions</label>
        {recipe.instructions.map((instruction, index) => (
          <div key={index} className="mb-2">
            <textarea
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addInstruction} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add Instruction
        </button>
      </div>

      <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
        Add Recipe
      </button>
    </form>
  );
};

export default AddRecipe;