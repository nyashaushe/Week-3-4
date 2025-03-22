const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample ingredients data
const ingredientsData = [
  {
    name: "Chicken Breast",
    category: "Protein",
    nutritionalValue: {
      calories: 165,
      protein: 31,
      fat: 3.6,
      carbohydrates: 0
    },
    isAllergenic: false,
    shelfLife: 3,
    storageInstructions: "Keep refrigerated at 4°C or below. Use within 2-3 days of purchase."
  },
  {
    name: "Basmati Rice",
    category: "Grains",
    nutritionalValue: {
      calories: 350,
      protein: 7,
      fat: 1,
      carbohydrates: 77
    },
    isAllergenic: false,
    shelfLife: 365,
    storageInstructions: "Store in an airtight container in a cool, dry place."
  },
  {
    name: "Olive Oil",
    category: "Other",
    nutritionalValue: {
      calories: 120,
      protein: 0,
      fat: 14,
      carbohydrates: 0
    },
    isAllergenic: false,
    shelfLife: 730,
    storageInstructions: "Store in a cool, dark place. Keep bottle tightly sealed."
  },
  {
    name: "Garlic",
    category: "Vegetables",
    nutritionalValue: {
      calories: 4,
      protein: 0.2,
      fat: 0,
      carbohydrates: 1
    },
    isAllergenic: false,
    shelfLife: 90,
    storageInstructions: "Store in a cool, dry, dark place with good air circulation."
  },
  {
    name: "Tomatoes",
    category: "Vegetables",
    nutritionalValue: {
      calories: 22,
      protein: 1.1,
      fat: 0.2,
      carbohydrates: 4.8
    },
    isAllergenic: false,
    shelfLife: 7,
    storageInstructions: "Store at room temperature until ripe, then refrigerate."
  },
  {
    name: "Onion",
    category: "Vegetables",
    nutritionalValue: {
      calories: 40,
      protein: 1.1,
      fat: 0.1,
      carbohydrates: 9.3
    },
    isAllergenic: false,
    shelfLife: 30,
    storageInstructions: "Store in a cool, dry, dark place with good air circulation."
  },
  {
    name: "Heavy Cream",
    category: "Dairy",
    nutritionalValue: {
      calories: 340,
      protein: 2.8,
      fat: 36,
      carbohydrates: 2.8
    },
    isAllergenic: true,
    shelfLife: 14,
    storageInstructions: "Keep refrigerated at 4°C or below."
  },
  {
    name: "Parmesan Cheese",
    category: "Dairy",
    nutritionalValue: {
      calories: 420,
      protein: 38,
      fat: 28,
      carbohydrates: 3.7
    },
    isAllergenic: true,
    shelfLife: 180,
    storageInstructions: "Keep refrigerated. Wrap tightly in plastic wrap or foil."
  },
  {
    name: "Black Pepper",
    category: "Spices",
    nutritionalValue: {
      calories: 251,
      protein: 10.4,
      fat: 3.3,
      carbohydrates: 63.9
    },
    isAllergenic: false,
    shelfLife: 730,
    storageInstructions: "Store in an airtight container in a cool, dry place."
  },
  {
    name: "Salt",
    category: "Spices",
    nutritionalValue: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    },
    isAllergenic: false,
    shelfLife: 1825,
    storageInstructions: "Store in an airtight container in a cool, dry place."
  }
];

// Function to create recipes once ingredients are inserted
const createRecipes = async (ingredients) => {
  // Create a map of ingredient names to their IDs
  const ingredientMap = {};
  ingredients.forEach(ing => {
    ingredientMap[ing.name] = ing._id;
  });

  const recipesData = [
    {
      title: "Creamy Chicken Pasta",
      description: "A rich and creamy pasta dish with tender chicken breast",
      ingredients: [
        {
          ingredient: ingredientMap["Chicken Breast"],
          quantity: 200,
          unit: "g"
        },
        {
          ingredient: ingredientMap["Olive Oil"],
          quantity: 2,
          unit: "tbsp"
        },
        {
          ingredient: ingredientMap["Garlic"],
          quantity: 3,
          unit: "piece"
        },
        {
          ingredient: ingredientMap["Heavy Cream"],
          quantity: 200,
          unit: "ml"
        },
        {
          ingredient: ingredientMap["Parmesan Cheese"],
          quantity: 50,
          unit: "g"
        }
      ],
      instructions: [
        "Cut chicken breast into bite-sized pieces",
        "Heat olive oil in a large pan over medium heat",
        "Cook chicken until golden brown",
        "Add minced garlic and sauté until fragrant",
        "Pour in heavy cream and simmer for 5 minutes",
        "Stir in grated parmesan cheese until melted",
        "Season with salt and pepper to taste"
      ],
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: "Medium"
    },
    {
      title: "Classic Tomato Rice",
      description: "Flavorful rice cooked with fresh tomatoes and aromatics",
      ingredients: [
        {
          ingredient: ingredientMap["Basmati Rice"],
          quantity: 200,
          unit: "g"
        },
        {
          ingredient: ingredientMap["Tomatoes"],
          quantity: 3,
          unit: "piece"
        },
        {
          ingredient: ingredientMap["Onion"],
          quantity: 1,
          unit: "piece"
        },
        {
          ingredient: ingredientMap["Garlic"],
          quantity: 2,
          unit: "piece"
        },
        {
          ingredient: ingredientMap["Olive Oil"],
          quantity: 2,
          unit: "tbsp"
        }
      ],
      instructions: [
        "Rinse rice until water runs clear",
        "Dice tomatoes and onions",
        "Heat oil in a pot and sauté onions until translucent",
        "Add minced garlic and cook for 1 minute",
        "Add tomatoes and cook until soft",
        "Add rice and water, bring to boil",
        "Reduce heat and simmer for 15 minutes",
        "Let rest for 5 minutes before serving"
      ],
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: "Easy"
    }
  ];

  try {
    await Recipe.insertMany(recipesData);
    console.log('Recipes inserted successfully');
  } catch (error) {
    console.error('Error inserting recipes:', error);
  }
};

// Main function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Cleared existing data');

    // Insert ingredients
    const ingredients = await Ingredient.insertMany(ingredientsData);
    console.log('Ingredients inserted successfully');

    // Insert recipes
    await createRecipes(ingredients);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding
seedDatabase(); 