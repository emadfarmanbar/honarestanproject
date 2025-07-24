const Registration = require('../../models/Registration');

exports.getStep7 = (req, res) => {
  req.session.currentStep = 7;
  res.render('register/step7', {
    error: null,
    formData: {},
    csrfToken: req.csrfToken()
  });
};

exports.postStep7 = async (req, res) => {
  const { acceptRules } = req.body;

  const errors = [];

  if (!acceptRules || acceptRules !== 'yes') {
    errors.push('لطفاً آیین‌نامه انضباطی را مطالعه کرده و تأیید کنید.');
  }

  if (errors.length > 0) {
    return res.render('register/step7', {
      error: errors.join(' '),
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }

  const step7 = {
    acceptRules: acceptRules === 'yes'
  };

  try {
    if (req.session.registrationId) {
      await Registration.findByIdAndUpdate(
        req.session.registrationId,
        { $set: { step7 } },
        { new: true }
      );
    } else {
      return res.render('register/step7', {
        error: 'خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.',
        formData: req.body,
        csrfToken: req.csrfToken()
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.render('register/step7', {
      error: 'خطا در ذخیره اطلاعات در پایگاه داده. لطفاً دوباره تلاش کنید.',
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }

  req.session.currentStep = 8;
  res.redirect('/step8');
};