const express = require('express');
const router = express.Router();

router.get('/packages', (req, res) => {
  res.status(200).json({ message: 'User route is working!' });
});

module.exports = router;