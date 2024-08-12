const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken'); // Example using JWT for authentication
    const generateToken = (user) => {
      const payload = { id: user._id, email: user.email };
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    };
      const verifyToken = (token) => {
        try {
          return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
          return null;
        }
      };
      const signup = async (email, password) => {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already in use');
            }
    
            const newUser = new User({ email, password });
            await newUser.save();
    
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
            return { success: true, user: { id: newUser._id, email: newUser.email }, token };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };
    
    const loginUser = async (email, password) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
    
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
    
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
            return { success: true, user: { id: user._id, email: user.email }, token };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };
    
    const getUserById = async (userId) => {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw new Error('User not found');
            }
            return { success: true, user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };    

const UserPermissions = {
  MANAGE_POLICY: 'MANAGE_POLICY',
  VIEW_POLICY: 'VIEW_POLICY',
  VIEW_ALL_POLICIES: 'VIEW_ALL_POLICIES'
};

const hasPermission = (user, permission) => {
  return user.permissions && user.permissions.includes(permission);
};

module.exports = { hasPermission, UserPermissions };


const getUserByToken = async (token) => {
  // ... retrieve user by token
};

module.exports = {
  signup,
  loginUser,
  getUserById,
  getUserByToken,
  verifyToken
};
