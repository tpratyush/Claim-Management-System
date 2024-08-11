const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pratyush2000:Pratyush123@cluster0.icrm9.mongodb.net/';

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };