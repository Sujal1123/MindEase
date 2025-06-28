const express = require('express');
const router = express.Router();
const { signup, login, upload } = require('../controllers/authController');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
})

router.post('/signup', upload.single('profileImage'), signup);
router.post('/login', login);

module.exports = router;
