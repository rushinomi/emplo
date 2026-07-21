import { useState, useEffect } from 'react';
import verhoeff from 'verhoeff';
// Language Translations Dictionary
const translations = {
  en: {
    title: 'Wage Worker Directory',
    subtitle: 'Find daily wage workers or register as a verified worker',
    regTitle: 'Worker Registration',
    fullName: 'Full Name',
    jobPlaceholder: 'Job/Skill (e.g. Plumber, Mason)',
    dailyWage: 'Daily Wage (₹)',
    locationPlaceholder: 'Location/City (e.g. Hyderabad)',
    workingHours: 'Working Hours (e.g. 8 AM - 5 PM)',
    phone: 'Phone Number',
    idVerification: 'Identity Verification',
    enterId: 'Enter 12-digit ID Number',
    verify: 'Verify',
    verifying: 'Verifying...',
    verified: 'Verified ✓',
    idNotice: 'Verification status will be displayed on your profile card.',
    completeReg: 'Complete Registration',
    availableWorkers: 'Available Workers',
    searchPlaceholder: 'Search by name, job, or location...',
    loading: 'Loading workers...',
    noWorkers: 'No matching workers found.',
    verifiedWorker: 'Verified Worker ✓',
    perDay: '/day',
    notSpecified: 'Not Specified'
  },
  hi: {
    title: 'दिहाड़ी मजदूर निर्देशिका',
    subtitle: 'दैनिक वेतन भोगी कार्यकर्ताओं को खोजें या एक सत्यापित कार्यकर्ता के रूप में पंजीकरण करें',
    regTitle: 'श्रमिक पंजीकरण',
    fullName: 'पूरा नाम',
    jobPlaceholder: 'कार्य/कौशल (जैसे नलसाज, राजमिस्त्री)',
    dailyWage: 'दैनिक मजदूरी (₹)',
    locationPlaceholder: 'स्थान/शहर (जैसे हैदराबाद)',
    workingHours: 'कार्य के घंटे (जैसे सुबह 8 - शाम 5)',
    phone: 'फोन नंबर',
    idVerification: 'पहचान सत्यापन',
    enterId: '12-अंकों का आईडी नंबर दर्ज करें',
    verify: 'सत्यापित करें',
    verifying: 'सत्यापित हो रहा है...',
    verified: 'सत्यापित ✓',
    idNotice: 'सत्यापन स्थिति आपके प्रोफाइल कार्ड पर प्रदर्शित होगी।',
    completeReg: 'पंजीकरण पूरा करें',
    availableWorkers: 'उपलब्ध श्रमिक',
    searchPlaceholder: 'नाम, काम या स्थान के आधार पर खोजें...',
    loading: 'श्रमिक लोड हो रहे हैं...',
    noWorkers: 'कोई मेल खाते श्रमिक नहीं मिले।',
    verifiedWorker: 'सत्यापित श्रमिक ✓',
    perDay: '/दिन',
    notSpecified: 'निर्दिष्ट नहीं'
  },
  te: {
    title: 'దినసరి కూలీల డైరెక్టరీ',
    subtitle: 'దినసరి వేతన కార్మికులను కనుగొనండి లేదా ధృవీకరించబడిన కార్మికుడిగా నమోదు చేసుకోండి',
    regTitle: 'కార్మికుల నమోదు',
    fullName: 'పూర్తి పేరు',
    jobPlaceholder: 'పని/నైపుణ్యం (ఉదా. ప్లంబర్, మేస్త్రీ)',
    dailyWage: 'దినసరి వేతనం (₹)',
    locationPlaceholder: 'ప్రాంతం/నగరం (ఉదా. హైదరాబాద్)',
    workingHours: 'పని వేళలు (ఉదా. ఉదయం 8 - సాయంత్రం 5)',
    phone: 'ఫోన్ నంబర్',
    idVerification: 'గుర్తింపు సరిచూడటం',
    enterId: '12-అంకెల ID నంబర్‌ను నమోదు చేయండి',
    verify: 'సరిచూడు',
    verifying: 'పరిశీలిస్తోంది...',
    verified: 'సరిచూడబడింది ✓',
    idNotice: 'సరిచూసిన స్థితి మీ ప్రొఫైల్ కార్డ్‌లో చూపబడుతుంది.',
    completeReg: 'నమోదు పూర్తి చేయండి',
    availableWorkers: 'అందుబాటులో ఉన్న కార్మికులు',
    searchPlaceholder: 'పేరు, పని లేదా ప్రాంతం ద్వారా వెతకండి...',
    loading: 'కార్మికుల వివరాలు లోడ్ అవుతున్నాయి...',
    noWorkers: 'ఏ కార్మికులు కనుగొనబడలేదు.',
    verifiedWorker: 'ధృవీకరించబడిన కార్మికుడు ✓',
    perDay: '/రోజు',
    notSpecified: 'పేర్కొనలేదు'
  }
};

const isValidIdFormat = (numberString) => {
  return /^\d{12}$/.test(numberString) && verhoeff.validate(numberString);
};
function App() {
  const [lang, setLang] = useState('en');
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Active language texts
  const t = translations[lang];

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    wage: '',
    hours: '',
    location: '',
    phone: '',
    idNumber: ''
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdVerify = (e) => {
    e.preventDefault();

    // 1. Basic length & digit check
    if (!formData.idNumber || formData.idNumber.length !== 12) {
      alert('Please enter a valid 12-digit ID number.');
      return;
    }

    // 2. Verhoeff Algorithm Check (Catches fake / random 12-digit numbers)
    if (!isValidIdFormat(formData.idNumber)) {
      alert('Invalid ID number format or checksum. Please enter a genuine number.');
      setIsVerified(false);
      return;
    }

    // 3. If valid, proceed with verification
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      alert('Identity verified successfully!');
    }, 1200);
  };

  const handleSubmitWorker = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please complete verification before registering.');
      return;
    }

    // 1. Define the payload object here
    const payload = {
      name: formData.name,
      job: formData.job,
      wage: formData.wage,
      hours: formData.hours,
      location: formData.location,
      phone: formData.phone,
      idNumber: formData.idNumber // Pass the entered 12-digit string to backend
    };

    // 2. Send the payload to your backend API
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
            hours: '',
            location: '',
            phone: '',
            idNumber: ''
          });
          setIsVerified(false);
          fetchWorkers(); // Refresh directory list
        } else {
          return res.json().then((data) => {
            alert(data.message || 'Failed to register worker.');
          });
        }
      })
      .catch((err) => console.error('Error registering worker:', err));
  };

  const filteredWorkers = workers.filter((worker) => {
  const term = search.toLowerCase().trim();
  if (!term) return true; // Show all if search box is empty

  return (
    (worker.name && worker.name.toLowerCase().includes(term)) ||
    (worker.job && worker.job.toLowerCase().includes(term)) ||
    (worker.location && worker.location.toLowerCase().includes(term))
  );
});

  return (
    <div style={styles.container}>
      {/* --- HEADER WITH LANGUAGE SELECTOR SIDE-BY-SIDE --- */}
      <header style={styles.header}>
  <div style={styles.titleRow}>
    {/* Left empty spacer to balance the grid */}
    <div></div>

    {/* Center Title */}
    <h1 style={styles.title}>{t.title}</h1>

    {/* Right-aligned Language Dropdown */}
    <div style={styles.langSelector}>
      <label htmlFor="language" style={styles.langLabel}>🌐</label>
      <select
        id="language"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        style={styles.selectInput}
      >
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
        <option value="te">తెలుగు (Telugu)</option>
      </select>
    </div>
  </div>
  <p style={styles.subtitle}>{t.subtitle}</p>
</header>

      {/* --- REGISTRATION BLOCK --- */}
      <section style={styles.registrationBlock}>
        <h2 style={styles.sectionTitle}>{t.regTitle}</h2>
        <form onSubmit={handleSubmitWorker} style={styles.form}>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder={t.fullName}
              value={formData.name}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="job"
              placeholder={t.jobPlaceholder}
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
              placeholder={t.dailyWage}
              value={formData.wage}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="location"
              placeholder={t.locationPlaceholder}
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
              placeholder={t.workingHours}
              value={formData.hours}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="phone"
              placeholder={t.phone}
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.verificationBox}>
            <h4>{t.idVerification}</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                name="idNumber"
                placeholder={t.enterId}
                value={formData.idNumber}
                onChange={handleInputChange}
                maxLength="12"
                disabled={isVerified}
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleIdVerify}
                disabled={isVerified || isVerifying}
                style={isVerified ? styles.verifiedBtn : styles.verifyBtn}
              >
                {isVerifying ? t.verifying : isVerified ? t.verified : t.verify}
              </button>
            </div>
            <small style={{ color: '#718096', marginTop: '5px', display: 'block' }}>
              {t.idNotice}
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
            {t.completeReg}
          </button>
          {submitStatus && <p style={{ textAlign: 'center', color: '#2b6cb0' }}>{submitStatus}</p>}
        </form>
      </section>

      {/* --- DIRECTORY SEARCH BLOCK --- */}
      <section style={{ marginTop: '40px' }}>
        <h2 style={styles.sectionTitle}>{t.availableWorkers}</h2>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.input, width: '100%', marginBottom: '20px' }}
        />

        {loading ? (
          <p style={styles.message}>{t.loading}</p>
        ) : filteredWorkers.length === 0 ? (
          <p style={styles.message}>{t.noWorkers}</p>
        ) : (
          <div style={styles.grid}>
            {filteredWorkers.map((worker) => (
              <div key={worker._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.name}>{worker.name}</h3>
                    {worker.isVerified && <span style={styles.verifiedBadge}>{t.verifiedWorker}</span>}
                  </div>
                  <span style={styles.badge}>{worker.job}</span>
                </div>
                <div style={styles.cardBody}>
                  <p><strong>{t.dailyWage.split(' ')[0]}:</strong> ₹{worker.wage}{t.perDay}</p>
                  <p><strong>{t.locationPlaceholder.split('/')[0]}:</strong> {worker.location || worker.Location || t.notSpecified}</p>
                  <p><strong>{t.workingHours.split(' ')[0]}:</strong> {worker.hours}</p>
                  <p><strong>{t.phone}:</strong> {worker.phone}</p>
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
  titleRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  title: { fontSize: '2.2rem', color: '#1a365d', margin: 0 },
  langSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#edf2f7',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e0'
  },
  langLabel: { fontSize: '1.1rem' },
  selectInput: {
    padding: '6px 8px',
    fontSize: '0.9rem',
    borderRadius: '4px',
    border: '1px solid #cbd5e0',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
    fontWeight: '600',
    color: '#2d3748'
  },
  subtitle: { color: '#4a5568', marginTop: '10px' },
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
  verifiedBadge: { color: '#38a169', fontSize: '0.75rem', fontWeight: 'bold' },
  cardBody: { fontSize: '0.9rem', lineHeight: '1.6', color: '#4a5568' },
  message: { textAlign: 'center', fontSize: '1.1rem', color: '#718096', marginTop: '20px' }
};

export default App;

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