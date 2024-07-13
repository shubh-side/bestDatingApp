// routes/messages.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Send a message
router.post('/send/:recipientId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const sender = req.user.id;
    const recipient = req.params.recipientId;

    const newMessage = new Message({
      sender,
      recipient,
      content
    });

    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get conversation with a user
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;