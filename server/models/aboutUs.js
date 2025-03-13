const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'About NEO' },
    subtitle: { type: String, default: 'Revolutionizing online shopping with quality products and exceptional service.' }
  },
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  story: {
    title: { type: String, default: 'Our Story' },
    content: [String], // Array of paragraphs
    image: { type: String }
  },
  mission: {
    title: { type: String, default: 'Our Mission' },
    content: { type: String }
  },
  values: [{
    icon: String,
    title: String,
    description: String
  }],
  stats: [{
    value: String,
    label: String
  }],
  team: [{
    name: String,
    position: String,
    image: String
  }],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('AboutUs', aboutUsSchema); 