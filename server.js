import express from 'express';
import mongoose from 'mongoose';
import { Client } from 'elasticsearch';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/family_cookbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Create Recipe Schema
const recipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  ingredients: [{ name: String, amount: String }],
  instructions: [String],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Connect to Elasticsearch
const esClient = new Client({ node: 'http://localhost:9200' });

// API Routes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const savedRecipe = await newRecipe.save();

    // Index the recipe in Elasticsearch
    await esClient.index({
      index: 'recipes',
      body: {
        id: savedRecipe._id,
        name: savedRecipe.name,
        description: savedRecipe.description,
        ingredients: savedRecipe.ingredients.map(i => i.name).join(' '),
        instructions: savedRecipe.instructions.join(' '),
      },
    });

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const result = await esClient.search({
      index: 'recipes',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['name', 'description', 'ingredients', 'instructions'],
          },
        },
      },
    });

    const recipeIds = result.hits.hits.map(hit => hit._source.id);
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});