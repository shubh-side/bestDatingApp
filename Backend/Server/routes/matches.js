// routes/matches.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get potential matches
router.get('/potential', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Find users with opposite gender and within a certain distance
    const potentialMatches = await User.find({
      _id: { $ne: user._id },
      gender: { $ne: user.gender },
      location: {
        $near: {
          $geometry: user.location,
          $maxDistance: 50000 // 50km
        }
      }
    }).limit(20);

    res.json(potentialMatches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Like a user
router.post('/like/:id', auth, async (req, res) => {
  try {
    const likedUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!likedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if it's a match
    if (likedUser.likes.includes(currentUser._id)) {
      currentUser.matches.push(likedUser._id);
      likedUser.matches.push(currentUser._id);
      await likedUser.save();
    } else {
      currentUser.likes.push(likedUser._id);
    }

    await currentUser.save();

    res.json({ msg: 'User liked successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;