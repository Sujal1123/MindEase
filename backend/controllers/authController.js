const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs')

// Setup multer
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
exports.upload = upload;

// SIGNUP controller
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      specializations,
      experienceYears,
      location,
      bio
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      specializations: role === 'psychiatrist' && specializations
        ? specializations.split(',').map(s => s.trim())
        : [],
      experienceYears: role === 'psychiatrist' ? experienceYears : null,
      location: role === 'psychiatrist' ? location : null,
      bio: role === 'psychiatrist' ? bio : null,
      profileImage: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1d'
    });

    console.log('Body:', req.body);
console.log('File:', req.file);


    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specializations: newUser.specializations,
        experienceYears: newUser.experienceYears,
        location: newUser.location,
        bio: newUser.bio,
        profileImage: newUser.profileImage
      }
    });
  } catch (error) {
    console.error('Signup error:', error.stack);
    res.status(500).json({ message: 'Signup failed: ' + error.message });
  }
};

// LOGIN controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specializations: user.specializations,
        experienceYears: user.experienceYears,
        location: user.location,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed: ' + error.message });
  }
};