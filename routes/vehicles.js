const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

const vehicleSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String, // Add a field to store the image filename
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

// Add a new vehicle with image upload
router.post('/add', upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const image = req.file.filename; // Get the filename of the uploaded image

  const newVehicle = new Vehicle({
    name,
    description,
    image, // Save the image filename in the database
  });

  try {
    await newVehicle.save();
    res.status(200).json({ message: 'Vehicle added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add vehicle' });
  }
});

// Serve images
router.get('/image/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '../uploads', filename);

  res.sendFile(imagePath);
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
