exports.getStep4 = (req, res) => {
  req.session.currentStep = 4;
  res.render('register/step4', {
    error: null,
    formData: {},
    csrfToken: req.csrfToken()
  });
};

exports.postStep4 = (req, res) => {
  // Helper for Iranian national code
  function isValidIranianNationalCode(input) {
    if (!/^[0-9]{10}$/.test(input)) return false;
    var check = +input[9];
    var sum = Array.from(input).slice(0, 9).reduce((acc, c, i) => acc + (+c * (10 - i)), 0) % 11;
    return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
  }

  // Validate phone
  function isValidPhone(phone) {
    return /^0\d{10}$/.test(phone);
  }

  // Validate birth certificate
  function isValidBirthCert(part1, part2) {
    return /^[آ-ی]\d{2}$/.test(part1) && /^\d{6}$/.test(part2);
  }

  // Father
  const father_national_code = req.body.father_national_code;
  const father_phone = req.body.father_work_phone;
  const father_birth_certificate = req.body.father_birth_certificate_part1 + '/' + req.body.father_birth_certificate_part2;
  // Mother
  const mother_national_code = req.body.mother_national_code;
  const mother_phone = req.body.mother_work_phone;
  const mother_birth_certificate = req.body.mother_birth_certificate_part1 + '/' + req.body.mother_birth_certificate_part2;

  // Validation
  let errors = [];
  if (!isValidIranianNationalCode(father_national_code)) errors.push('کد ملی پدر معتبر نیست.');
  if (!isValidIranianNationalCode(mother_national_code)) errors.push('کد ملی مادر معتبر نیست.');
  if (!isValidPhone(father_phone)) errors.push('شماره تلفن محل کار پدر معتبر نیست.');
  if (!isValidPhone(mother_phone)) errors.push('شماره تلفن محل کار مادر معتبر نیست.');
  if (!isValidBirthCert(req.body.father_birth_certificate_part1, req.body.father_birth_certificate_part2)) errors.push('شماره شناسنامه پدر معتبر نیست.');
  if (!isValidBirthCert(req.body.mother_birth_certificate_part1, req.body.mother_birth_certificate_part2)) errors.push('شماره شناسنامه مادر معتبر نیست.');

  if (errors.length > 0) {
    return res.render('register/step4', {
      error: errors.join(' '), // یکپارچه‌سازی فرمت خطاها
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }

  const fatherData = {
    name: req.body.father_name,
    lastname: req.body.father_lastname,
    national_code: father_national_code,
    birth_certificate: father_birth_certificate,
    birth_date: req.body.father_birth_date,
    education: req.body.father_education,
    job: req.body.father_job,
    work_address: req.body.father_work_address,
    work_phone: father_phone,
  };
  const motherData = {
    name: req.body.mother_name,
    lastname: req.body.mother_lastname,
    national_code: mother_national_code,
    birth_certificate: mother_birth_certificate,
    birth_date: req.body.mother_birth_date,
    education: req.body.mother_education,
    job: req.body.mother_job,
    work_address: req.body.mother_work_address,
    work_phone: mother_phone,
  };
  req.session.fatherInfo = fatherData;
  req.session.motherInfo = motherData;
  req.session.currentStep = 5;
  res.redirect('/step5');
};