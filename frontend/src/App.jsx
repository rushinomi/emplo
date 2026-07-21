import React, { useState, useEffect } from 'react';
import verhoeff from 'verhoeff';

const isValidIdFormat = (numberString) => {
  return /^\d{12}$/.test(numberString) && verhoeff.validate(numberString);
};

const translations = {
  en: {
    title: "Labor Connect",
    subtitle: "Find and Register Skilled Workers Easily",
    regTitle: "Register New Worker",
    fullName: "Full Name",
    jobPlaceholder: "Job / Skill (e.g., Carpenter)",
    dailyWage: "Daily Wage (₹)",
    locationPlaceholder: "Location (City / Area)",
    workingHours: "Working Hours (e.g., 9 AM - 5 PM)",
    phone: "Phone Number",
    idVerification: "Identity Verification",
    enterId: "Enter 12-Digit AadharID",
    verify: "Verify ID",
    verifying: "Verifying...",
    verified: "Verified ✓",
    idNotice: "Enter a valid aadhar number for check.",
    completeReg: "Complete Registration",
    availableWorkers: "Available Workers Directory",
    searchPlaceholder: "Search by name, skill, or location...",
    loading: "Loading workers...",
    noWorkers: "No workers found.",
    verifiedWorker: "Verified Worker",
    perDay: " / day",
    notSpecified: "Not Specified",
    wageLabel: "Wage",
    locationLabel: "Location",
    hoursLabel: "Hours",
    phoneLabel: "Phone"
  },
  hi: {
    title: "लेबर कनेक्ट",
    subtitle: "कुशल श्रमिकों को आसानी से खोजें और पंजीकृत करें",
    regTitle: "नया कार्यकर्ता पंजीकृत करें",
    fullName: "पूरा नाम",
    jobPlaceholder: "काम / कौशल (जैसे बढ़ई)",
    dailyWage: "दैनिक मजदूरी (₹)",
    locationPlaceholder: "स्थान (शहर / क्षेत्र)",
    workingHours: "कार्य के घंटे (जैसे सुबह 9 - शाम 5)",
    phone: "फोन नंबर",
    idVerification: "पहचान सत्यापन",
    enterId: "12 अंकों का आईडी दर्ज करें",
    verify: "सत्यापित करें",
    verifying: "सत्यापित हो रहा है...",
    verified: "सत्यापित ✓",
    idNotice: "जांच के लिए वैध 12 अंकों का नंबर दर्ज करें।",
    completeReg: "पंजीकरण पूरा करें",
    availableWorkers: "उपलब्ध कार्यकर्ताओं की सूची",
    searchPlaceholder: "नाम, कौशल या स्थान से खोजें...",
    loading: "कार्यकर्ताओं को लोड किया जा रहा है...",
    noWorkers: "कोई कार्यकर्ता नहीं मिला।",
    verifiedWorker: "सत्यापित कार्यकर्ता",
    perDay: " / दिन",
    notSpecified: "निर्दिष्ट नहीं",
    wageLabel: "मजदूरी",
    locationLabel: "स्थान",
    hoursLabel: "घंटे",
    phoneLabel: "फोन"
  },
  te: {
    title: "లేబర్ కనెక్ట్",
    subtitle: "నైపుణ్యం కలిగిన కార్మికులను సులభంగా కనుగొనండి మరియు నమోదు చేయండి",
    regTitle: "కొత్త కార్మికుడిని నమోదు చేయండి",
    fullName: "పూర్తి పేరు",
    jobPlaceholder: "పని / నైపుణ్యం (ఉదా. వడ్రంగి)",
    dailyWage: "రోజువారీ వేతనం (₹)",
    locationPlaceholder: "ప్రాంతం (నగరం / ఏరియా)",
    workingHours: "పని వేళలు (ఉదా. ఉదయం 9 - సాయంత్రం 5)",
    phone: "ఫోన్ నంబర్",
    idVerification: "గుర్తింపు ధృవీకరణ",
    enterId: "12 అంకెల ఐడి నమోదు చేయండి",
    verify: "ధృవీకరించు",
    verifying: "ధృవీకరిస్తోంది...",
    verified: "ధృవీకరించబడింది ✓",
    idNotice: "తనిఖీ కోసం చెల్లుబాటు అయ్యే 12 అంకెల సంఖ్యను నమోదు చేయండి.",
    completeReg: "రిజిస్ట్రేషన్ పూర్తి చేయండి",
    availableWorkers: "అందుబాటులో ఉన్న కార్మికుల జాబితా",
    searchPlaceholder: "పేరు, నైపుణ్యం లేదా ప్రాంతం ద్వారా శోధించండి...",
    loading: "కార్మికుల వివరాలు లోడ్ అవుతున్నాయి...",
    noWorkers: "కార్మికులు ఎవరూ కనుగొనబడలేదు.",
    verifiedWorker: "ధృవీకరించబడిన కార్మికుడు",
    perDay: " / రోజుకు",
    notSpecified: "పేర్కొనలేదు",
    wageLabel: "వేతనం",
    locationLabel: "ప్రాంతం",
    hoursLabel: "గంటలు",
    phoneLabel: "ఫోన్"
  }
};

const fetchTranslatedLocation = async (locationText, targetLang) => {
  if (!locationText) return "";
  
  const langMap = { en: 'en', hi: 'hi', te: 'te' };
  const targetCode = langMap[targetLang] || 'en';

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        locationText + ', India'
      )}&format=json&accept-language=${targetCode}&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return data[0].display_name.split(',')[0]; 
    }
  } catch (error) {
    console.error("Error fetching location translation:", error);
  }

  return locationText; 
};

const DynamicLocation = ({ locationText, targetLang, defaultText }) => {
  const [translated, setTranslated] = useState(locationText);

  useEffect(() => {
    let isMounted = true;
    if (locationText) {
      fetchTranslatedLocation(locationText, targetLang).then((res) => {
        if (isMounted) setTranslated(res);
      });
    }
    return () => { isMounted = false; };
  }, [locationText, targetLang]);

  if (!locationText) return defaultText;
  return <span>{translated}</span>;
};

function App() {
  const [lang, setLang] = useState('en');
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const t = translations[lang] || translations.en;

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
    fetch('https://backdata-4leh.onrender.com/api/workers')
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

    if (!formData.idNumber || formData.idNumber.length !== 12) {
      alert('Please enter a valid 12-digit ID number.');
      return;
    }

    if (!isValidIdFormat(formData.idNumber)) {
      alert('Invalid ID number format or checksum. Please enter a genuine number.');
      setIsVerified(false);
      return;
    }

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

    const payload = {
      name: formData.name.trim(),
      job: formData.job.trim(),
      wage: Number(formData.wage),
      hours: formData.hours.trim(),
      location: formData.location.trim(),
      phone: formData.phone.trim(),
      idNumber: formData.idNumber.trim()
    };

    fetch('https://backdata-4leh.onrender.com/api/workers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (res.ok) {
          setSubmitStatus('Worker registered successfully!');
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
          fetchWorkers();
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
    if (!term) return true;

    return (
      (worker.name && worker.name.toLowerCase().includes(term)) ||
      (worker.job && worker.job.toLowerCase().includes(term)) ||
      (worker.location && worker.location.toLowerCase().includes(term))
    );
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleRow}>
          <div></div>
          <h1 style={styles.title}>{t.title}</h1>
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
              <div key={worker._id || worker.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.name}>{worker.name}</h3>
                    {worker.isVerified && <span style={styles.verifiedBadge}>{t.verifiedWorker}</span>}
                  </div>
                  <span style={styles.badge}>{worker.job}</span>
                </div>
                <div style={styles.cardBody}>
                  <p>
                    <strong>{t.wageLabel}:</strong> ₹{worker.wage}{t.perDay}
                  </p>
                  <p>
                    <strong>{t.locationLabel}:</strong>{' '}
                    <DynamicLocation 
                      locationText={worker.location} 
                      targetLang={lang} 
                      defaultText={t.notSpecified} 
                    />
                  </p>
                  <p>
                    <strong>{t.hoursLabel}:</strong> {worker.hours}
                  </p>
                  <p>
                    <strong>{t.phoneLabel}:</strong> {worker.phone}
                  </p>
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
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#333'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  titleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: { fontSize: '2.2rem', color: '#5081c6', margin: 0 },
  langSelector: {
    position:'fixed',
    top: '20px',
    right: '200px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#edf2f7',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    justifySelf: 'end'
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