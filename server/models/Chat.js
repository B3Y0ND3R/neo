const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  senderRole: { 
    type: String, 
    required: true,
    enum: ['user', 'admin']
  },
  content: { 
    type: String, 
    required: true 
  },
  messageType: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },
  edited: {
    type: Boolean,
    default: false
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const chatSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  messages: [messageSchema],
  lastMessage: { 
    type: Date, 
    default: Date.now 
  },
  unreadCount: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('Chat', chatSchema); 