const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  categories: [{
    name: String,
    faqs: [{
      question: String,
      answer: String,
      isExpanded: { type: Boolean, default: false }
    }]
  }]
});

module.exports = mongoose.model('Faq', faqSchema); 