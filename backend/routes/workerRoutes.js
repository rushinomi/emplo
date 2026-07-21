const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// @route   GET /api/workers
// @desc    Get all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/workers/register
// @desc    Register a new worker (after verification)
router.post('/register', async (req, res) => {
  const { name, job, wage, hours, location, phone, isVerified } = req.body;

  try {
    const newWorker = new Worker({
      name,
      job,
      wage: Number(wage),
      hours,
      location,
      phone,
      isVerified: isVerified || false
    });

    const savedWorker = await newWorker.save();
    res.status(201).json(savedWorker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Worker = require('../models/Worker');

// // Get all workers with query filters
// router.get('/', async (req, res) => {
//   try {
//     const { job, maxWage, available } = req.query;
//     let query = {};

//     if (job) query.job = job;
//     if (maxWage) query.wage = { $lte: Number(maxWage) };
//     if (available === 'true') query.isBusy = false;

//     const workers = await Worker.find(query);
//     res.json(workers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Leave a rating and feedback
// router.post('/:id/review', async (req, res) => {
//   try {
//     const { user, text, stars } = req.body;
//     const worker = await Worker.findById(req.id);
    
//     if (!worker) return res.status(404).json({ message: 'Not found' });

//     worker.reviews.push({ user, text, stars });
    
//     // Recalculate average rating
//     const total = worker.reviews.reduce((acc, item) => item.stars + acc, 0);
//     worker.rating = total / worker.reviews.length;

//     await worker.save();
//     res.json(worker);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;