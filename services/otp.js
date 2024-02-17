require('dotenv').config();
const axios = require('axios');

const sendOTP = async (mobileNumber)=>{
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const response = await axios.get('https://www.fast2sms.com/dev/bulk', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: `Your OTP is ${otp}`,
        route: 'otp',
        numbers: mobileNumber
      }
    });
    res.json({ success: true, message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
};

module.exports = sendOTP
