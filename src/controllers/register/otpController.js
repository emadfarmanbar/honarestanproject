const { validationResult } = require('express-validator');

exports.getOtp = (req, res) => {
  if (!req.session.mobile || !req.session.otp) {
    return res.redirect('/step2');
  }

  res.render('register/otp', {
    error: null,
    otp: '',
    csrfToken: req.csrfToken()
  });
};

exports.postOtp = (req, res) => {
  const errors = validationResult(req);
  const { otp } = req.body;

  if (!req.session.otp || !req.session.mobile) {
    return res.redirect('/step2');
  }

  // بررسی محدودیت زمانی OTP (۲ دقیقه)
  if (Date.now() - req.session.otpTimestamp > 2 * 60 * 1000) {
    delete req.session.otp;
    delete req.session.otpTimestamp;
    return res.render('register/otp', {
      error: 'کد تأیید منقضی شده است. لطفاً دوباره درخواست کنید.',
      otp: '',
      csrfToken: req.csrfToken()
    });
  }

  if (!errors.isEmpty()) {
    return res.render('register/otp', {
      error: errors.array()[0].msg,
      otp,
      csrfToken: req.csrfToken()
    });
  }

  if (otp !== req.session.otp) {
    return res.render('register/otp', {
      error: 'کد وارد شده صحیح نیست!',
      otp,
      csrfToken: req.csrfToken()
    });
  }

  // تأیید موفق، پاک کردن OTP
  delete req.session.otp;
  delete req.session.otpTimestamp;
  req.session.currentStep = 3;

  res.redirect('/step3');
};