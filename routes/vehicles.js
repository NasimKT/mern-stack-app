// routes/vehicles.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: String,
    description: String,
  });
  
  const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// API endpoint to get a list of all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Failed to fetch vehicles' });
  }
});

// Add a new vehicle
router.post('/add', async (req, res) => {
  const { name, description } = req.body;

  const newVehicle = new Vehicle({
    name,
    description,
  });

  try {
    await newVehicle.save();
    res.status(200).json({ message: 'Vehicle added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add vehicle' });
  }
});

// Edit an existing vehicle by ID
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      );
  
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
  
      res.status(200).json({ message: 'Vehicle edited successfully' });
    } catch (error) {
      console.error('Error during vehicle edit:', error);
      res.status(500).json({ message: 'Failed to edit vehicle' });
    }
  });


// Delete a vehicle by ID
router.delete('/delete-vehicle/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Vehicle.deleteOne({ _id: id });
  
      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Vehicle deleted successfully' });
      } else {
        res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      console.error('Error during vehicle deletion:', error);
      res.status(500).json({ message: 'Failed to delete vehicle' });
    }
  });
  
  

module.exports = router;
