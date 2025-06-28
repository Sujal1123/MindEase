const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { getPsychiatrists, getMyPatients  } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware.js');
const User = require('../models/User.js');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/psychiatrists', protect, getPsychiatrists);
  
router.get('/my-patients', protect, getMyPatients);

  router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const baseUrl = 'https://mindease-production-ed22.up.railway.app';
    const userObj = user.toObject();

    if (userObj.profileImage) {
      userObj.profileImage = `${baseUrl}${userObj.profileImage.startsWith('/') ? '' : '/'}${userObj.profileImage}`;
    }

    res.json(userObj);
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


 router.put('/me', protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put(
  '/me/image',
  protect,
  upload.single('profileImage'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({ message: 'Image uploaded', profileImage: user.profileImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Image upload failed' });
    }
  }
);



  router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid or missing user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/me', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
