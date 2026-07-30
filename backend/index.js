require('dotenv').config(); 
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');

// 1. Import DB connection, routes, and Worker model
const connectDB = require('./config/db');
const workerRoutes = require('./routes/workerRoutes');
const Worker = require('./models/Worker'); // Ensure path matches your project layout

const app = express();

// 2. Connect Database
connectDB();

// 3. Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 4. Base Routes
app.use('/api/workers', workerRoutes);

// 5. PATCH Route (Must be defined BEFORE app.listen)
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

// 6. Start Server (Always keep at the very bottom)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));