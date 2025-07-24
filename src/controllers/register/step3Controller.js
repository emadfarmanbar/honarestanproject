const { validationResult } = require('express-validator');

exports.getStep3 = (req, res) => {
  req.session.currentStep = 3;
  res.render('register/step3', {
    error: null,
    formData: {},
    csrfToken: req.csrfToken()
  });
};

exports.postStep3 = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('register/step3', {
      error: errors.array().map(e => e.msg).join(' '),
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }

  const {
    firstName, lastName, fatherName, nationalId,
    shenasnamehSerialPart1, shenasnamehSerialPart2, issuePlace, birthPlace,
    birthDate, major,
  } = req.body;

  // ترکیب دو قسمت سریال شناسنامه
  const shenasnamehSerial = `${shenasnamehSerialPart1}/${shenasnamehSerialPart2}`;

  // ذخیره در سشن به جای کوکی
  req.session.step3 = {
    firstName,
    lastName,
    fatherName,
    nationalId,
    shenasnamehSerial,
    issuePlace,
    birthPlace,
    birthDate,
    major
  };
  req.session.currentStep = 4;
  res.redirect('/step4');
};