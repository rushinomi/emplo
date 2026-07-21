import { useState, useEffect } from 'react';

function App() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    wage: '',
    hours: '8 AM - 5 PM',
    location: '',
    phone: '',
    aadharNumber: ''
  });

  // Verification process state
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Fetch workers from backend
  const fetchWorkers = () => {
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
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulate Verification Step
  const handleAadharVerify = (e) => {
    e.preventDefault();
    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setIsVerifying(true);
    // Simulating API verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      alert('Identity verified successfully!');
    }, 1500);
  };

  // Submit Worker Registration
  const handleSubmitWorker = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please complete verification before registering.');
      return;
    }

    const payload = {
      name: formData.name,
      job: formData.job,
      wage: formData.wage,
      hours: formData.hours,
      location: formData.location,
      phone: formData.phone,
      isVerified: true
    };

    fetch('http://localhost:5000/api/workers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (res.ok) {
          setSubmitStatus('Worker registered successfully!');
          // Reset Form
          setFormData({
            name: '',
            job: '',
            wage: '',
            hours: '8 AM - 5 PM',
            location: '',
            phone: '',
            aadharNumber: ''
          });
          setIsVerified(false);
          fetchWorkers(); // Refresh directory list
        } else {
          setSubmitStatus('Failed to register worker.');
        }
      })
      .catch((err) => console.error('Error registering worker:', err));
  };

  // Filter workers based on search term
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
        <p style={styles.subtitle}>Find daily wage workers or register as a verified worker</p>
      </header>

      {/* --- REGISTRATION BLOCK --- */}
      <section style={styles.registrationBlock}>
        <h2 style={styles.sectionTitle}>Worker Registration</h2>
        <form onSubmit={handleSubmitWorker} style={styles.form}>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="job"
              placeholder="Job/Skill (e.g. Plumber, Mason)"
              value={formData.job}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="number"
              name="wage"
              placeholder="Daily Wage (₹)"
              value={formData.wage}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="location"
              placeholder="Location/City (e.g. Hyderabad)"
              value={formData.location}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="text"
              name="hours"
              placeholder="Working Hours (e.g. 8 AM - 5 PM)"
              value={formData.hours}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          {/* VERIFICATION SECTION */}
          <div style={styles.verificationBox}>
            <h4>Identity Verification</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                name="aadharNumber"
                placeholder="Enter 12-digit ID Number"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                maxLength="12"
                disabled={isVerified}
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAadharVerify}
                disabled={isVerified || isVerifying}
                style={isVerified ? styles.verifiedBtn : styles.verifyBtn}
              >
                {isVerifying ? 'Verifying...' : isVerified ? 'Verified ✓' : 'Verify'}
              </button>
            </div>
            <small style={{ color: '#718096', marginTop: '5px', display: 'block' }}>
              Verification status will be displayed on your profile card.
            </small>
          </div>

          <button
            type="submit"
            disabled={!isVerified}
            style={{
              ...styles.submitBtn,
              backgroundColor: isVerified ? '#2b6cb0' : '#a0aec0',
              cursor: isVerified ? 'pointer' : 'not-allowed'
            }}
          >
            Complete Registration
          </button>
          {submitStatus && <p style={{ textAlign: 'center', color: '#2b6cb0' }}>{submitStatus}</p>}
        </form>
      </section>

      {/* --- DIRECTORY SEARCH BLOCK --- */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={styles.sectionTitle}>Available Workers</h2>
        <input
          type="text"
          placeholder="Search by name, job, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.input, width: '100%', marginBottom: '20px' }}
        />

        {/* WORKER CARDS GRID */}
        {loading ? (
          <p style={styles.message}>Loading workers...</p>
        ) : filteredWorkers.length === 0 ? (
          <p style={styles.message}>No matching workers found.</p>
        ) : (
          <div style={styles.grid}>
            {filteredWorkers.map((worker) => (
              <div key={worker._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.name}>{worker.name}</h3>
                    {worker.isVerified && <span style={styles.verifiedBadge}>Verified Worker ✓</span>}
                  </div>
                  <span style={styles.badge}>{worker.job}</span>
                </div>
                <div style={styles.cardBody}>
                  <p><strong>Daily Wage:</strong> ₹{worker.wage}/day</p>
                  <p><strong>Location:</strong> {worker.location || 'Not Specified'}</p>
                  <p><strong>Hours:</strong> {worker.hours}</p>
                  <p><strong>Phone:</strong> {worker.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#333'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '2.2rem', color: '#1a365d', margin: '0 0 10px 0' },
  subtitle: { color: '#4a5568', margin: 0 },
  sectionTitle: { fontSize: '1.5rem', color: '#2d3748', marginBottom: '15px' },
  registrationBlock: {
    backgroundColor: '#f7fafc',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGroup: { display: 'flex', gap: '15px' },
  input: {
    flex: 1,
    padding: '12px 15px',
    fontSize: '0.95rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    outline: 'none'
  },
  verificationBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    border: '1px dashed #4299e1'
  },
  verifyBtn: {
    padding: '12px 20px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  verifiedBtn: {
    padding: '12px 20px',
    backgroundColor: '#38a169',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold'
  },
  submitBtn: {
    padding: '14px',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
    alignItems: 'flex-start',
    marginBottom: '15px',
    borderBottom: '1px solid #edf2f7',
    paddingBottom: '10px'
  },
  name: { fontSize: '1.2rem', margin: '0 0 5px 0', color: '#2d3748' },
  badge: {
    backgroundColor: '#ebf8ff',
    color: '#2b6cb0',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  verifiedBadge: {
    color: '#38a169',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  cardBody: { fontSize: '0.9rem', lineHeight: '1.6', color: '#4a5568' },
  message: { textAlign: 'center', fontSize: '1.1rem', color: '#718096', marginTop: '20px' }
};

export default App;
// import { useState, useEffect } from 'react';

// function App() {
//   const [workers, setWorkers] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Fetch workers from backend when the component mounts
//   useEffect(() => {
//     fetch('http://localhost:5000/api/workers')
//       .then((res) => res.json())
//       .then((data) => {
//         setWorkers(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching workers:', err);
//         setLoading(false);
//       });
//   }, []);

//   // Filter workers based on search input (name, job, or location)
//   const filteredWorkers = workers.filter((worker) => {
//     const term = search.toLowerCase();
//     return (
//       worker.name?.toLowerCase().includes(term) ||
//       worker.job?.toLowerCase().includes(term) ||
//       worker.location?.toLowerCase().includes(term)
//     );
//   });

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h1 style={styles.title}>Wage Worker Directory</h1>
//         <p style={styles.subtitle}>Find and hire daily wage professionals near you</p>
//       </header>

//       {/* Search Input */}
//       <div style={styles.searchBox}>
//         <input
//           type="text"
//           placeholder="Search by name, job (e.g. Plumber), or location..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={styles.input}
//         />
//       </div>

//       {/* Worker List */}
//       {loading ? (
//         <p style={styles.message}>Loading workers...</p>
//       ) : filteredWorkers.length === 0 ? (
//         <p style={styles.message}>No matching workers found.</p>
//       ) : (
//         <div style={styles.grid}>
//           {filteredWorkers.map((worker) => (
//             <div key={worker._id} style={styles.card}>
//               <div style={styles.cardHeader}>
//                 <h2 style={styles.name}>{worker.name}</h2>
//                 <span style={styles.badge}>{worker.job}</span>
//               </div>
//               <div style={styles.cardBody}>
//                 <p><strong>Daily Wage:</strong> ₹{worker.wage}</p>
//                 <p><strong>Hours:</strong> {worker.hours}</p>
//                 <p><strong>Location:</strong> {worker.location}</p>
//                 {worker.phone && <p><strong>Phone:</strong> {worker.phone}</p>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // Inline styles for easy copy-pasting
// const styles = {
//   container: {
//     maxWidth: '1000px',
//     margin: '0 auto',
//     padding: '30px 20px',
//     fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
//     color: '#333'
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: '30px'
//   },
//   title: {
//     fontSize: '2.2rem',
//     color: '#1a365d',
//     margin: '0 0 10px 0'
//   },
//   subtitle: {
//     color: '#4a5568',
//     margin: 0
//   },
//   searchBox: {
//     marginBottom: '30px'
//   },
//   input: {
//     width: '100%',
//     padding: '14px 18px',
//     fontSize: '1rem',
//     borderRadius: '8px',
//     border: '1px solid #cbd5e0',
//     boxSizing: 'border-box',
//     outline: 'none'
//   },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//     gap: '20px'
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: '10px',
//     border: '1px solid #e2e8f0',
//     padding: '20px',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//   },
//   cardHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '15px',
//     borderBottom: '1px solid #edf2f7',
//     paddingBottom: '10px'
//   },
//   name: {
//     fontSize: '1.25rem',
//     margin: 0,
//     color: '#2d3748'
//   },
//   badge: {
//     backgroundColor: '#ebf8ff',
//     color: '#2b6cb0',
//     padding: '4px 10px',
//     borderRadius: '12px',
//     fontSize: '0.85rem',
//     fontWeight: 'bold'
//   },
//   cardBody: {
//     fontSize: '0.95rem',
//     lineHeight: '1.6',
//     color: '#4a5568'
//   },
//   message: {
//     textAlign: 'center',
//     fontSize: '1.1rem',
//     color: '#718096',
//     marginTop: '40px'
//   }
// };

// export default App;