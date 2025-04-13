const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Package = require("../models/Package");
const auth = require("../middleware/auth");
router.get('/', auth, async (req, res) => {
  try {
    const packageList = await Package.findAll({attributes:["id","name","coins","price","active"]});
    res.status(200).json(packageList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Package' });
  }
});

module.exports = router;