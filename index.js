const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const policyRoutes = require('./routes/policyRoutes');
const claimRouter = require('./routes/claimRoutes');
const authRoutes = require('./routes/authRoutes');
const policiesRoutes = require('./routes/policiesRoutes');
const { connectToDatabase } = require('./config/db');
const cookieParser = require('cookie-parser');
const authenticateJWT = require('./services/authMiddle');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(process.cwd(), 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware for request details
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes for login and signup
app.get('/', (req, res) => {
  res.render('login');
});

// Dashboard route
app.get('/dashboard', authenticateJWT, (req, res) => {
  res.render('dashboard', { page: 'dashboard' });
});

// Dashboard account route
app.get('/dashboard/account', authenticateJWT, (req, res) => {
  res.render('account', { page: 'account', dashboard: true });
});

app.get('/policies', authenticateJWT, (req, res) => {
  res.render('policies', { page: 'policies' });
});

// Claims route
app.get('/dashboard/claims', authenticateJWT, (req, res) => {
  res.render('claim', { page: 'claims', dashboard: true });
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

// Use routers for handling different routes
app.use('/user', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/dashboard/policies', policiesRoutes);
app.use('/api/claims', claimRouter);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(3000, '0.0.0.0', () => {
      console.log('Server is running on http://0.0.0.0:3000');
    });
  })
  .catch(console.error);
