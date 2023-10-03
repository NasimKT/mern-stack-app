const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mern_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define MongoDB Schema and Models for User
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  password: String,
});

const User = mongoose.model('User', userSchema);

// API endpoints for registration, sign-in, OTP sending, and OTP verification
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Create a new User document
  const newUser = new User({
    name,
    email,
    phone,
    password,
  });

  // Save the user data to the database
  try {
    await newUser.save();
    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

const twilioClient = twilio('AC640cad353854b29d2df0d7c9031b5b8a', 'd7a4ca2c1d0d2247f18a2bb6f7b21092');

// Map to store phone number OTP mappings
const phoneOtpMap = new Map();

app.post('/api/send-otp', async (req, res) => {
  const { phone } = req.body;

  // Generate a random 6-digit OTP
  const otp = generateOTP(6);

  // Store the OTP in the map with the phone number as the key
  phoneOtpMap.set(phone, otp);

  try {
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: '+12562978668',
      to: phone,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  // Check if the phone number exists in the map and if the stored OTP matches the received OTP
  if (phoneOtpMap.has(phone) && phoneOtpMap.get(phone) === otp) {
    // If OTP is verified successfully, remove it from the map
    phoneOtpMap.delete(phone);
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Function to generate a random OTP
function generateOTP(length) {
  const charset = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    otp += charset[randomIndex];
  }
  return otp;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
