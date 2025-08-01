const  mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'psychiatrist'], required: true },
  specializations: [String],
  experienceYears: Number,
  location: String,
  bio: String,
  profilePictureUrl: String,
  profileImage: {
    type: String,
    default: '' 
  }
});

module.exports = mongoose.model('User', userSchema);
