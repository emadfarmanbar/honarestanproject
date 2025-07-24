const { validationResult } = require('express-validator');
const fetch = require('node-fetch'); // نسخه 2 (ES5-style): npm install node-fetch@2

// کلاس سرویس SMS با API RESTful
class SmsPanelClient {
  constructor(apiKey, fromNumber) {
    this.apiKey = apiKey;
    this.from = fromNumber;
    this.apiUrl = 'https://console.melipayamak.com/api/send/simple';
  }

  async sendSms(mobile, message) {
    const data = JSON.stringify({
      'from': this.from,
      'to': mobile,
      'text': message
    });

    try {
      const response = await fetch(`${this.apiUrl}/${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length.toString()
        },
        body: data,
        timeout: 10000
      });

      const result = await response.json();
      console.log('📦 Response from SMS server:', result);

      return {
        status: response.status,
        id: result.messageId || null
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }
}

// GET: نمایش فرم وارد کردن موبایل
exports.getStep2 = (req, res) => {
  req.session.currentStep = 2;
  res.render('register/step2', {
    error: null,
    mobile: '',
    csrfToken: req.csrfToken()
  });
};

// POST: ارسال OTP از طریق SMS
exports.postStep2 = async (req, res) => {
  const errors = validationResult(req);
  const { mobile } = req.body;

  if (!errors.isEmpty()) {
    return res.render('register/step2', {
      error: errors.array()[0].msg,
      mobile,
      csrfToken: req.csrfToken()
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  req.session.otp = otp;
  req.session.mobile = mobile;
  req.session.otpTimestamp = Date.now(); // اضافه کردن تایم‌استمپ
  req.session.currentStep = 2;

  // استفاده از پنل پیامکی
  const smsClient = new SmsPanelClient('a4a0acb953bb4fe79e03606beedb9b25', '50002710096601');
  const message = `سلام،
کد تأیید شماره موبایل برای ثبت‌نام در هنرستان کاردانش اسودگی:
${otp}

مهلت استفاده: ۲ دقیقه`;

  try {
    const result = await smsClient.sendSms(mobile, message);
    console.log('SMS sent successfully:', result);

    const fs = require('fs');
    const logMessage = `${new Date().toISOString()} | OTP for ${mobile}: ${otp} | SMS ID: ${result.id || 'N/A'}\n`;
    const logPath = require('path').join(__dirname, '../logs/sms.log');
    fs.appendFile(logPath, logMessage, (err) => {
      if (err) console.error('❗ خطا در لاگ کردن OTP:', err);
    });

    return res.redirect('/otp');
  } catch (error) {
    console.error('❗ خطا در ارسال پیامک:', error);
    return res.render('register/step2', {
      error: 'خطا در ارسال پیامک. لطفاً دوباره تلاش کنید.',
      mobile,
      csrfToken: req.csrfToken()
    });
  }
};