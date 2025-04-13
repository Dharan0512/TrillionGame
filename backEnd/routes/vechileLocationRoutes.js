const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VehicleLocation = require("../models/VehicleLocation")

// Save GPS location
router.post('/', async (req, res) => {
  try {
    const { vehicleId, lat, lng } = req.body;
    if (!vehicleId || !lat || !lng) return res.status(400).send('Missing fields');

    await VehicleLocation.create({ vehicleId, lat, lng });
    res.status(201).send('Location saved');
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).send('Server error');
  }
});

// Get latest location for a vehicle
router.get('/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const latestLocation = await VehicleLocation.findOne({
      where: { vehicleId },
      order: [['timestamp', 'DESC']]
    });

    if (!latestLocation) return res.status(404).send('No location found');
    res.json(latestLocation);
  } catch (err) {
    console.error('Error fetching location:', err);
    res.status(500).send('Server error');
  }
});


module.exports = router;