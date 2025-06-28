const express = require('express');
const Review = require('../models/Review.js');
const {protect} = require('../middleware/authMiddleware.js');
const mongoose = require("mongoose");

const router = express.Router();

// Create a review
router.post('/', protect, async (req, res) => {
  try {
    const { psychiatristId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(psychiatristId)) {
      return res.status(400).json({ message: 'Invalid psychiatrist ID' });
    }

    console.log('Submitting review with:', {
      psychiatristId,
      rating,
      comment,
      patientId: req.user.id || req.user._id,
    });

    if (!mongoose.Types.ObjectId.isValid(psychiatristId)) {
  return res.status(400).json({ message: 'Invalid psychiatrist ID' });
   }

    const review = await Review.create({
      psychiatrist: psychiatristId,
      patient: req.user.id || req.user._id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(' Review creation error:', err);
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// Get all reviews for a psychiatrist
router.get('/:psychiatristId', async (req, res) => {
  const reviews = await Review.find({ psychiatrist: req.params.psychiatristId }).populate('patient', 'name');
  res.json(reviews);
});

module.exports = router;
