exports.getStep5 = (req, res) => {
  res.render('register/step5', {
    error: null,
    formData: {},
    csrfToken: req.csrfToken()
  });
};

exports.postStep5 = (req, res) => {
  const {
    special_mobile, home_phone, father_mobile, mother_mobile, student_mobile,
    guardian, province, county, city, main_street, side_street,
    main_alley, side_alley, building_number, floor, postal_code,
    housing_status, other_guardian_phone, other_housing_desc
  } = req.body;

  const errors = [];

  if (!special_mobile || !guardian || !province || !county || !city || !main_street || !housing_status) {
    errors.push('لطفاً فیلدهای ضروری را کامل کنید.');
  }

  const phoneRegex = /^09\d{9}$/;
  if (!phoneRegex.test(special_mobile)) {
    errors.push('شماره تلفن همراه خاص پیامک معتبر نیست.');
  }
  if (father_mobile && !phoneRegex.test(father_mobile)) {
    errors.push('شماره همراه پدر معتبر نیست.');
  }
  if (mother_mobile && !phoneRegex.test(mother_mobile)) {
    errors.push('شماره همراه مادر معتبر نیست.');
  }
  if (student_mobile && !phoneRegex.test(student_mobile)) {
    errors.push('شماره همراه دانش‌آموز معتبر نیست.');
  }
  if (postal_code && !/^\d{10}$/.test(postal_code)) {
    errors.push('کد پستی باید ده رقمی باشد.');
  }
  if (guardian === 'other') {
    if (!other_guardian_phone || !phoneRegex.test(other_guardian_phone)) {
      errors.push('شماره تماس ولی پیگیر (سایر) معتبر نیست.');
    }
  }
  if (housing_status === 'other') {
    if (!other_housing_desc || other_housing_desc.trim().length === 0) {
      errors.push('لطفاً توضیحات وضعیت مسکن (سایر) را وارد کنید.');
    }
  }

  if (errors.length > 0) {
    return res.render('register/step5', {
      error: errors.join(' '),
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }

  // ذخیره در سشن به جای کوکی
  req.session.step5 = {
    special_mobile,
    home_phone: home_phone || '',
    father_mobile: father_mobile || '',
    mother_mobile: mother_mobile || '',
    student_mobile: student_mobile || '',
    guardian,
    other_guardian_phone: guardian === 'other' ? other_guardian_phone : '',
    province,
    county,
    city,
    main_street,
    side_street: side_street || '',
    main_alley: main_alley || '',
    side_alley: side_alley || '',
    building_number: building_number || '',
    floor: floor || '',
    postal_code: postal_code || '',
    housing_status,
    other_housing_desc: housing_status === 'other' ? other_housing_desc : ''
  };
  req.session.currentStep = 6;
  res.redirect('/step6');
};