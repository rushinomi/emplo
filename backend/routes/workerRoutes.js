const express = require('express');
const router = express.Router();
const verhoeff = require('verhoeff');
const Worker = require('../models/Worker');

router.post('/update-status', async (req, res) => {
  const { phone, location } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  const cleanPhone = phone.replace(/\D/g, '');

  if (!cleanPhone) {
    return res.status(400).json({ message: 'Please enter a valid phone number.' });
  }

  try {
    const updateFields = {};
    if (location !== undefined && location !== '') {
      const loc = location.trim();
      updateFields.location = loc;
      updateFields.isAvailable = loc.toLowerCase().includes('free');
    }
const flexibleRegex = new RegExp(cleanPhone.split('').join('\\s*'), 'i');

const updatedWorker = await Worker.findOneAndUpdate(
  { phone: { $regex: flexibleRegex } },
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

function isValidIdFormat(numberString) {
  return /^\d{12}$/.test(numberString) && verhoeff.validate(numberString);
}

router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    console.log(`[GET /api/workers] Successfully fetched ${workers.length} workers.`);
    res.json(workers);
  } catch (err) {
    console.error('[GET /api/workers ERROR]:', err.message);
    res.status(500).json({ message: 'Server error while fetching workers: ' + err.message });
  }
});

router.post('/register', async (req, res) => {
  const { name, job, wage, hours, location, phone, idNumber } = req.body;

  if (!idNumber || !isValidIdFormat(idNumber)) {
    return res.status(400).json({ 
      message: 'Invalid 12-digit ID number format or checksum. Registration failed.' 
    });
  }

  try {
    const newWorker = new Worker({
      name,
      job,
      wage: Number(wage),
      hours,
      location,
      phone,
      idNumber,
      isVerified: true
    });

    const savedWorker = await newWorker.save();
    console.log(`[POST /register SUCCESS] Created worker ID: ${savedWorker._id}`);
    res.status(201).json(savedWorker);
  } catch (err) {
    console.error('[POST /register ERROR]:', err.message);
    res.status(400).json({ message: 'Failed to register worker: ' + err.message });
  }
});



module.exports = router;