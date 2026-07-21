import React, { useState, useEffect } from 'react';
import WorkerCard from './components/WorkerCard';

export default function App() {
  const [workers, setWorkers] = useState([]);
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Construct search params based on selected UI elements
    let url = 'http://localhost:5000/api/workers';
    let params = [];
    if (jobFilter) params.push(`job=${jobFilter}`);
    if (statusFilter === 'available') params.push('available=true');
    if (params.length) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setWorkers(data))
      .catch(err => console.error(err));
  }, [jobFilter, statusFilter]);

  const handleReview = (id, reviewData) => {
    fetch(`http://localhost:5000/api/workers/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    })
      .then(res => res.json())
      .then(updatedWorker => {
        setWorkers(workers.map(w => w._id === id ? updatedWorker : w));
      });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Daily Wage Worker Network</h1>
      
      {/* Filters Toolbar */}
      <div className="flex gap-4 mb-6 bg-gray-50 p-4 rounded">
        <div>
          <label className="block text-xs font-medium mb-1">Occupation</label>
          <select value={jobFilter} onChange={e => setJobFilter(e.target.value)} className="border p-1 rounded text-sm">
            <option value="">All Jobs</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Carpenter">Carpenter</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Current Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-1 rounded text-sm">
            <option value="all">Show All</option>
            <option value="available">Available Only</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workers.map(worker => (
          <WorkerCard key={worker._id} worker={worker} onReviewSubmit={handleReview} />
        ))}
      </div>
    </div>
  );
}