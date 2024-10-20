import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Recipe {
  _id: string;
  name: string;
  description: string;
}

const SearchRecipes: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((recipe) => (
          <Link key={recipe._id} to={`/recipe/${recipe._id}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{recipe.name}</h2>
              <p className="text-gray-600">{recipe.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchRecipes;