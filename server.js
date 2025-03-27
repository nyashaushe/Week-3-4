const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'your-secret-key', // Replace with a strong, random secret
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Recipe API' });
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe API',
      version: '1.0.0',
      description: 'A simple Recipe API for managing recipes and ingredients',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://week-3-4-30dx.onrender.com' 
          : `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        githubAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://github.com/login/oauth/authorize',
              tokenUrl: 'https://github.com/login/oauth/access_token',
              scopes: {
                'user:email': 'Grants access to a user\'s email addresses.'
              }
            }
          }
        }
      }
    },
    security: [
      {
        githubAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './routes/auth.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/ingredients', require('./routes/ingredients'));

const { router: authRoutes } = require('./routes/auth');
app.use('/', authRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

// Environment variables
process.env.GITHUB_CLIENT_ID = "Ov23liYJMIMTPIYRGB6u";
process.env.GITHUB_CLIENT_SECRET = "1c376de19fa1c0e79640a80f784d76919cb27884";
process.env.GITHUB_CALLBACK_URL = "https://week-3-4-30dx.onrender.com/auth/github/callback";
