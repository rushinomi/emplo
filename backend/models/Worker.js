const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  job: { type: String, required: true },
  wage: { type: Number, required: true },
  hours: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  idNumber: { type: String },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);