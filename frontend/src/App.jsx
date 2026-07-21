import { useState, useEffect } from 'react';

function App() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch workers from backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/workers')
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching workers:', err);
        setLoading(false);
      });
  }, []);

  // Filter workers based on search input (name, job, or location)
  const filteredWorkers = workers.filter((worker) => {
    const term = search.toLowerCase();
    return (
      worker.name?.toLowerCase().includes(term) ||
      worker.job?.toLowerCase().includes(term) ||
      worker.location?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Wage Worker Directory</h1>
        <p style={styles.subtitle}>Find and hire daily wage professionals near you</p>
      </header>

      {/* Search Input */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name, job (e.g. Plumber), or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Worker List */}
      {loading ? (
        <p style={styles.message}>Loading workers...</p>
      ) : filteredWorkers.length === 0 ? (
        <p style={styles.message}>No matching workers found.</p>
      ) : (
        <div style={styles.grid}>
          {filteredWorkers.map((worker) => (
            <div key={worker._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.name}>{worker.name}</h2>
                <span style={styles.badge}>{worker.job}</span>
              </div>
              <div style={styles.cardBody}>
                <p><strong>Daily Wage:</strong> ₹{worker.wage}</p>
                <p><strong>Hours:</strong> {worker.hours}</p>
                <p><strong>Location:</strong> {worker.location}</p>
                {worker.phone && <p><strong>Phone:</strong> {worker.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Inline styles for easy copy-pasting
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#333'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2.2rem',
    color: '#1a365d',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#4a5568',
    margin: 0
  },
  searchBox: {
    marginBottom: '30px'
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    boxSizing: 'border-box',
    outline: 'none'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #edf2f7',
    paddingBottom: '10px'
  },
  name: {
    fontSize: '1.25rem',
    margin: 0,
    color: '#2d3748'
  },
  badge: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  cardBody: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#4a5568'
  },
  message: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#718096',
    marginTop: '40px'
  }
};

export default App;