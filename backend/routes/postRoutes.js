const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


router.get('/', async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name') 
    .populate('comments.user', 'name');

  res.json(posts);
});


// Create a post
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect , async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

router.post('/:id/like', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const userId = req.user.id;

  if (!post) return res.status(404).json({ message: 'Post not found' });

  const liked = post.likes.includes(userId);

  if (liked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.json({ likes: post.likes.length });
}
);

router.post('/:postId/comment', protect , async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = {
    text,
    user: req.user._id 
  };

  post.comments.push(comment);
  await post.save();

  res.status(200).json({ message: 'Comment added' });
});


module.exports = router;
