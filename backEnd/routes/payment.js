const express = require('express');
const router = express.Router();

router.get('/payment', (req, res) => {
  res.status(200).json({ message: 'User route is working!' });
});
router.get('/history', (req, res) => {
  res.status(200).json({ message: 'User route is working!' });
});

module.exports = router;