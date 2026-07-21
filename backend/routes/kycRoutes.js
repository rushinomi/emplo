// backend/routes/kycRoutes.js (Example using a KYC Provider)
router.post('/generate-aadhar-otp', async (req, res) => {
  const { aadhaarNumber } = req.body;

  try {
    // Call approved Aadhaar KYC API provider
    const apiResponse = await axios.post('https://api.sandbox.co.in/kyc/aadhaar/okyc/otp', {
      aadhaar_number: aadhaarNumber
    }, {
      headers: { 'Authorization': process.env.SANDBOX_API_KEY }
    });

    // Returns a reference ID to track this OTP session
    res.json({ refId: apiResponse.data.ref_id, message: "OTP sent to linked mobile number" });
  } catch (error) {
    res.status(400).json({ message: "Invalid Aadhaar number or API error" });
  }
});

// backend/routes/kycRoutes.js
router.post('/verify-aadhar-otp', async (req, res) => {
  const { refId, otp } = req.body;

  try {
    const apiResponse = await axios.post('https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify', {
      ref_id: refId,
      otp: otp
    }, {
      headers: { 'Authorization': process.env.SANDBOX_API_KEY }
    });

    // If valid, the API returns the verified name & details
    if (apiResponse.data.status === 'VALID') {
      res.json({
        verified: true,
        nameOnAadhaar: apiResponse.data.name,
        gender: apiResponse.data.gender
      });
    }
  } catch (error) {
    res.status(400).json({ verified: false, message: "Incorrect OTP" });
  }
});