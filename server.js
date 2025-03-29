const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Import connect-mongo
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Session configuration using connect-mongo
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Recommended: don't save session if unmodified
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions' // Optional: specify collection name
  }),
  cookie: { 
    secure: false, // Set to true if using https
    maxAge: 1000 * 60 * 60 * 24 // Optional: Set cookie expiry (e.g., 1 day)
  } 
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use passport-github2 strategy
const GitHubStrategy = require('passport-github2').Strategy; 

// Verify GitHub environment variables are loaded
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID); 
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? 'Loaded' : 'MISSING'); // Log only if loaded, not the secret itself
console.log('GITHUB_CALLBACK_URL:', process.env.GITHUB_CALLBACK_URL);

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL, // Use environment variable
  scope: ['user:email'] // Explicitly request email scope
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.sendFile('public/index.html');
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
    // Removed securitySchemes and security for GitHub OAuth as it's handled by Passport
  },
  apis: ['./routes/*.js', './routes/auth.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/ingredients', require('./routes/ingredients'));

// Import only the middleware from routes/auth.js
const { ensureAuthenticated } = require('./routes/auth'); 
// Removed app.use('/', authRoutes); as the router is no longer exported from auth.js

// --- GitHub Auth Routes (now defined directly in server.js) ---
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] })); 

app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/' // Simplified failure redirect
}), (req, res) => {
  // Successful authentication, redirect home.
  console.log('GitHub auth successful, redirecting home.'); // Added log
  res.redirect('/');
});

app.get('/logout', (req, res, next) => { // Added next for consistency
  req.logout(function(err) { // Use the callback form of logout
    if (err) { return next(err); }
    console.log('User logged out, redirecting home.'); // Added log
    res.redirect('/');
  });
});

// --- Protected Route Example ---
// Ensure this route serves an actual file or renders a view
app.get('/recipes', ensureAuthenticated, (req, res) => {
  // Assuming recipes.html is in the public folder
  res.sendFile(path.join(__dirname, 'public', 'recipes.html')); 
});

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
