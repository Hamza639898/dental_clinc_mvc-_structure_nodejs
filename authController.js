const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};


const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (role && role !== 'user') {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only Admin can create a user with the role of admin' });
      }
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: '  The user already exists' });
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: ' Error during registration', error: error.message });
  }
};

// تسجيل الدخول
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email or password is incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: '  Error while logging in', error: error.message });
  }
};

module.exports = { register, login };
