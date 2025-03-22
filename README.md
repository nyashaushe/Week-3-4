# Recipe Management API

A RESTful API for managing recipes and ingredients, built with Node.js, Express, and MongoDB.

## Features

- Complete CRUD operations for recipes and ingredients
- Data validation and error handling
- Swagger API documentation
- MongoDB integration
- Rich data models with relationships between recipes and ingredients

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd recipe-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. Access the API documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Recipes

- GET `/api/recipes` - Get all recipes
- GET `/api/recipes/:id` - Get a specific recipe
- POST `/api/recipes` - Create a new recipe
- PUT `/api/recipes/:id` - Update a recipe
- DELETE `/api/recipes/:id` - Delete a recipe

### Ingredients

- GET `/api/ingredients` - Get all ingredients
- GET `/api/ingredients/:id` - Get a specific ingredient
- POST `/api/ingredients` - Create a new ingredient
- PUT `/api/ingredients/:id` - Update an ingredient
- DELETE `/api/ingredients/:id` - Delete an ingredient

## Data Validation

The API includes comprehensive data validation for both recipes and ingredients:

### Recipe Validation
- Title: Required, minimum 3 characters
- Description: Required
- Ingredients: Array of ingredients with quantity and unit
- Instructions: Non-empty array of steps
- Preparation Time: Required, minimum 1 minute
- Cooking Time: Required, non-negative
- Servings: Required, minimum 1
- Difficulty: Required, must be 'Easy', 'Medium', or 'Hard'

### Ingredient Validation
- Name: Required, unique, minimum 2 characters
- Category: Required, must be one of predefined categories
- Nutritional Value: Required fields for calories, protein, carbohydrates, and fat
- Shelf Life: Required, minimum 1 day
- Storage Instructions: Required

## Error Handling

The API implements comprehensive error handling:
- Validation errors (400)
- Not found errors (404)
- Server errors (500)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 