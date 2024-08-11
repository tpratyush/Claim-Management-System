// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define a schema for the embedded policy
const embeddedPolicySchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  },
  policyName: {
    type: String,
    required: true
  },
  policyAmount: {
    type: String,
    required: true
  },
  policyExpiryDate:{
    type:Date,
    required:true
  }
  // Add other fields you want to include in the embedded policy
});

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  policies: [embeddedPolicySchema]
}, { timestamps: true });

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;