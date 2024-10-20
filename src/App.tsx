import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Book, Search, PlusCircle } from 'lucide-react';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import AddRecipe from './components/AddRecipe';
import SearchRecipes from './components/SearchRecipes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <Book className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-800">Family Cookbook</span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link to="/search" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  <Search className="h-5 w-5 inline-block mr-1" />
                  Search
                </Link>
                <Link to="/add" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  <PlusCircle className="h-5 w-5 inline-block mr-1" />
                  Add Recipe
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/search" element={<SearchRecipes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;