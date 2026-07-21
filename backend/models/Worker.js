const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  job: { type: String, required: true }, // e.g., Plumber, Painter
  wage: { type: Number, required: true }, // Daily rate
  skills: [String],
  hours: { type: String, required: true }, // e.g., "8 AM - 5 PM"
  isBusy: { type: Boolean, default: false }, // Currently at a work site
  isVerified: { type: Boolean, default: false }, // [Aadhaar Verification Status]
  rating: { type: Number, default: 0 },
  reviews: [{ user: String, text: String, stars: Number }]
});

module.exports = mongoose.model('Worker', workerSchema);