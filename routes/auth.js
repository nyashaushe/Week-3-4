// This file now only exports the authentication middleware.
// All route definitions and passport setup are handled in server.js.

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  // Redirect to home page or send an error if not authenticated
  // Depending on whether it's an API request or browser navigation
  if (req.accepts('html')) {
    res.redirect('/'); // Or perhaps a dedicated login page if you create one
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { ensureAuthenticated };
