const Filter = require("../models/Filter");

// GET all filters
const getAllFilters = async (req, res) => {
  try {
    const filters = await Filter.find();
    res.json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST new filter
const addFilter = async (req, res) => {
  const { type, label, value } = req.body;
  try {
    const exists = await Filter.findOne({ value });
    if (exists) return res.status(400).json({ success: false, message: "Filter already exists" });

    const newFilter = await Filter.create({ type, label, value });
    res.json({ success: true, data: newFilter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE filter
const deleteFilter = async (req, res) => {
  try {
    await Filter.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Filter deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllFilters, addFilter, deleteFilter };
