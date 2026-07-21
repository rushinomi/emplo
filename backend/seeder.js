const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Worker = require('./models/Worker');

dotenv.config();

const sampleWorkers = [
  {
    name: 'Ramesh Kumar',
    job: 'Plumber',
    wage: 800,
    hours: '8 AM - 5 PM',
    location: 'Hyderabad',
    phone: '9876543210'
  },
  {
    name: 'Suresh Verma',
    job: 'Electrician',
    wage: 950,
    hours: '9 AM - 6 PM',
    location: 'Secunderabad',
    phone: '9876543211'
  },
  {
    name: 'Anil Sharma',
    job: 'Carpenter',
    wage: 850,
    hours: '8 AM - 4 PM',
    location: 'Gachibowli',
    phone: '9876543212'
  },
  {
    name: 'Prakash Rao',
    job: 'Painter',
    wage: 700,
    hours: '9 AM - 5 PM',
    location: 'Miyapur',
    phone: '9876543213'
  },
  {
    name: 'Mahesh Babu',
    job: 'Mason',
    wage: 1000,
    hours: '8 AM - 5 PM',
    location: 'Kukatpally',
    phone: '9876543214'
  }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wage-workers';
    await mongoose.connect(connStr);
    console.log('Database connected for seeding...');

    // Clear existing data
    await Worker.deleteMany();
    console.log('Cleared old worker records.');

    // Insert sample workers
    await Worker.insertMany(sampleWorkers);
    console.log('Successfully seeded 5 sample workers!');

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();