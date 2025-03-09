const express = require('express');
const router = express.Router();
const Chat = require('../../models/Chat');
const User = require('../../models/User');
const { upload, cloudinary } = require('../../helpers/cloudinary');


// Get all conversations (for admin)
router.get('/conversations', async (req, res) => {
  try {
    console.log('Fetching conversations for admin');
    const chats = await Chat.find({})
      .sort({ lastMessage: -1 })
      .populate('user', 'userName')
      .exec();
    
    console.log('Found chats:', chats);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get chat for a specific user
router.get('/:userId', async (req, res) => {
  try {
    console.log('Fetching chat for userId:', req.params.userId);
    let chat = await Chat.findOne({ user: req.params.userId });
    
    if (!chat) {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      chat = new Chat({
        user: req.params.userId,
        userName: user.userName,
        messages: []
      });
      await chat.save();
    }
    
    console.log('Retrieved/Created chat:', chat);
    res.json(chat);
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add message to chat
router.post('/:userId/messages', async (req, res) => {
  try {
    console.log('Adding message. UserId:', req.params.userId);
    console.log('Message data:', req.body);
    
    const { content, sender, senderRole } = req.body;
    
    if (!content || !sender || !senderRole) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { content, sender, senderRole }
      });
    }

    let chat = await Chat.findOne({ user: req.params.userId });
    
    if (!chat) {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      chat = new Chat({
        user: req.params.userId,
        userName: user.userName,
        messages: []
      });
    }

    const newMessage = {
      sender,
      senderRole,
      content,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    chat.unreadCount = senderRole === 'user' ? chat.unreadCount + 1 : 0;
    
    await chat.save();
    console.log('Saved chat with new message:', chat);
    res.json(chat);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ 
      message: error.message,
      stack: error.stack // Adding stack trace for debugging
    });
  }
});

// Mark messages as read
router.put('/:userId/read', async (req, res) => {
  try {
    console.log('Marking messages as read for userId:', req.params.userId);
    const chat = await Chat.findOne({ user: req.params.userId });
    if (chat) {
      chat.unreadCount = 0;
      await chat.save();
      res.json(chat);
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific message
router.delete('/:userId/messages/:messageId', async (req, res) => {
  try {
    const { userId, messageId } = req.params;
    const chat = await Chat.findOne({ user: userId });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages = chat.messages.filter(
      message => message._id.toString() !== messageId
    );
    
    await chat.save();
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add image message
router.post('/:userId/messages/image', upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { sender, senderRole } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'chat_images',
      resource_type: 'auto'
    });

    let chat = await Chat.findOne({ user: userId });
    
    if (!chat) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      chat = new Chat({
        user: userId,
        userName: user.userName,
        messages: []
      });
    }
    const newMessage = {
      sender,
      senderRole,
      content: result.secure_url,
      messageType: 'image',
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    chat.unreadCount = senderRole === 'user' ? chat.unreadCount + 1 : 0;
    
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 