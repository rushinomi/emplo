import React, { useState } from 'react';

export default function WorkerCard({ worker, onReviewSubmit }) {
  const [review, setReview] = useState({ user: '', text: '', stars: 5 });

  const handleSubmit = (e) => {
    e.preventDefault();
    onReviewSubmit(worker._id, review);
    setReview({ user: '', text: '', stars: 5 });
  };

  return (
    <div className="worker-box border p-4 rounded-lg shadow-sm relative bg-white">
      {/* Name & Verification Badge */}
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold">{worker.name}</h3>
        {worker.isVerified && (
          <span className="text-blue-500 font-bold title='Identity Verified'">✓ Verified</span>
        )}
      </div>

      {/* Live Status Indicator */}
      <span className={`text-xs px-2 py-1 rounded inline-block my-2 ${worker.isBusy ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
        {worker.isBusy ? '● At Work' : '● Available Now'}
      </span>

      {/* Details Grid */}
      <div className="text-sm space-y-1 my-2">
        <p><strong>Occupation:</strong> {worker.job}</p>
        <p><strong>Daily Wage:</strong> ₹{worker.wage}</p>
        <p><strong>Timings:</strong> {worker.hours}</p>
        <p><strong>Phone:</strong> {worker.phone}</p>
        <p><strong>Skills:</strong> {worker.skills.join(', ')}</p>
        <p><strong>Rating:</strong> ⭐ {worker.rating.toFixed(1)} ({worker.reviews.length} reviews)</p>
      </div>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t text-xs space-y-2">
        <h4 className="font-semibold">Leave a Review</h4>
        <div className="flex gap-1">
          <input 
            type="text" placeholder="Your name" required
            value={review.user} onChange={e => setReview({...review, user: e.target.value})}
            className="border p-1 w-1/2 rounded"
          />
          <select 
            value={review.stars} onChange={e => setReview({...review, stars: Number(e.target.value)})}
            className="border p-1 rounded"
          >
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
        <textarea 
          placeholder="Share your experience..." required
          value={review.text} onChange={e => setReview({...review, text: e.target.value})}
          className="border p-1 w-full rounded block"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}