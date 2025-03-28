const express = require('express');
const router = express.Router();
const AboutUs = require('../models/aboutUs');

// GET about us data
router.get('/', async (req, res) => {
  try {
    const aboutData = await AboutUs.findOne();
    res.json(aboutData || {});
  } catch (error) {
    console.error('Error fetching about us data:', error);
    res.status(500).json({ error: 'Failed to fetch about us data' });
  }
});

// Update about us data
router.put('/', async (req, res) => {
  try {
    const aboutData = await AboutUs.findOne();
    if (aboutData) {
      const updatedData = await AboutUs.findByIdAndUpdate(
        aboutData._id, 
        req.body,
        { new: true } // This returns the updated document
      );
      res.json(updatedData);
    } else {
      const newData = await AboutUs.create(req.body);
      res.json(newData);
    }
  } catch (error) {
    console.error('Error updating about us data:', error);
    res.status(500).json({ error: 'Failed to update about us data' });
  }
});

module.exports = router; 