require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect using the environment variable from your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB Atlas!'))
  .catch((err) => console.error(' MongoDB Connection Error:', err));

// Your API routes go here...




const connectDB = require('./config/db');
const workerRoutes = require('./routes/workerRoutes');


// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/workers', workerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// PATCH: Update worker location and automatically derive availability status
app.patch('/api/workers/update-status', async (req, res) => {
  const { phone, location } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  // Strip spaces and special characters for reliable matching
  const cleanPhone = phone.replace(/\D/g, '');

  if (!cleanPhone) {
    return res.status(400).json({ message: 'Please enter a valid phone number.' });
  }

  try {
    const updateFields = {};
    if (location !== undefined && location !== '') {
      const loc = location.trim();
      updateFields.location = loc;
      // Automatically set available to true if location includes "free"
      updateFields.isAvailable = loc.toLowerCase().includes('free');
    }

    const updatedWorker = await Worker.findOneAndUpdate(
      { phone: { $regex: cleanPhone } },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ message: 'Worker not found with this phone number.' });
    }

    res.json({ message: 'Status and location updated successfully!', worker: updatedWorker });
  } catch (error) {
    console.error('Error updating worker:', error);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
});