const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

router.get('/', async (req, res) => {
  try {
    const faqData = await Faq.findOne();
    res.json(faqData || { categories: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQ data' });
  }
});

router.put('/', async (req, res) => {
  try {
    const faqData = await Faq.findOne();
    if (faqData) {
      await Faq.findByIdAndUpdate(faqData._id, req.body);
    } else {
      await Faq.create(req.body);
    }
    res.json({ message: 'FAQ updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ data' });
  }
});

module.exports = router; 