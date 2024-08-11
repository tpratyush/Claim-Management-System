const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const policyholderRouter = require('./routes/policyholderRoutes');
const policyRoutes = require('./routes/policyRoutes');
const claimRouter = require('./routes/claimRoutes');
const authRoutes = require('./routes/authRoutes');
const { connectToDatabase } = require('./config/db');

// Middleware to parse JSON requests
app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define initial data structures
let claims = [];
let policyholders = [];
let policies = [];

// Routes for login and signup
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// Dashboard route with sidebar navigation
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { page: 'dashboard' });
});
app.get('/dashboard/policies', (req, res) => {
  res.render('dashboard', { page: 'policies' });
});
app.get('/dashboard/claim', (req, res) => {
  res.render('dashboard', { page: 'claim' });
});
app.get('/dashboard/account', (req, res) => {
  res.render('dashboard', { page: 'account' });
});
app.get('/dashboard/login', (req, res) => {
  res.render('dashboard', { page: 'login' });
});

// Handle form submissions (you can add your own logic here)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Add your login validation logic here
    res.send(`Logged in as ${username}`);
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    // Add your signup logic here
    res.send(`User ${username} signed up`);
});

// Use other routers
app.use('/user', authRoutes);
app.use('/api/policies', policyRoutes);

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(console.error);