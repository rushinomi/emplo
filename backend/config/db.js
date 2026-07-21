const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace with your local URI or MongoDB Atlas connection string
    await mongoose.connect(process.env.MONGO_URI || 'https://backdata-4leh.onrender.com/api/workers');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;