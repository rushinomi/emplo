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