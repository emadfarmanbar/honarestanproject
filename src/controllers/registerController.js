const { validationResult } = require('express-validator');

exports.step1 = (req, res) => {
  res.render('register/step1');
};

exports.getStep2 = (req, res) => {
  res.render('register/step2', { error: null, mobile: '' });
};

exports.postStep2 = (req, res) => {
  const errors = validationResult(req);
  const { mobile } = req.body;

  if (!errors.isEmpty()) {
    return res.render('register/step2', {
      error: errors.array()[0].msg,
      mobile
    });
  }

  res.cookie('mobile', mobile, { maxAge: 10 * 60 * 1000 });
  res.redirect('/step3');
};

exports.getStep3 = (req, res) => {
  res.render('register/step3', {
    error: null,
    formData: {},
  });
};

exports.postStep3 = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('register/step3', {
      error: errors.array().map(e => e.msg).join(' '),
      formData: req.body,
    });
  }

  const {
    firstName,
    lastName,
    fatherName,
    nationalId,
    shenasnamehSerial,
    issuePlace,
    birthPlace,
    birthDate,
    major,
  } = req.body;

  res.cookie('firstName', firstName);
  res.cookie('lastName', lastName);
  res.cookie('fatherName', fatherName);
  res.cookie('nationalId', nationalId);
  res.cookie('shenasnamehSerial', shenasnamehSerial);
  res.cookie('issuePlace', issuePlace);
  res.cookie('birthPlace', birthPlace);
  res.cookie('birthDate', birthDate);
  res.cookie('major', major);

  res.redirect('/step4');
};

// ========== مرحله 4 ==========

exports.getStep4 = (req, res) => {
  res.render('register/step4');
};

exports.postStep4 = (req, res) => {
  const divorced = req.body.divorced;

  if (divorced === 'yes') {
    const guardianData = {
      name: req.body.guardian_name,
      lastname: req.body.guardian_lastname,
      national_code: req.body.guardian_national_code,
      birth_certificate: req.body.guardian_birth_certificate,
      birth_date: req.body.guardian_birth_date,
      education: req.body.guardian_education,
      field: req.body.guardian_field,
      job: req.body.guardian_job,
      work_address: req.body.guardian_work_address,
      work_phone: req.body.guardian_work_phone,
    };
    req.session.guardianInfo = guardianData;
  } else {
    const fatherData = {
      name: req.body.father_name,
      lastname: req.body.father_lastname,
      national_code: req.body.father_national_code,
      birth_certificate: req.body.father_birth_certificate,
      birth_date: req.body.father_birth_date,
      education: req.body.father_education,
      field: req.body.father_field,
      job: req.body.father_job,
      work_address: req.body.father_work_address,
      work_phone: req.body.father_work_phone,
    };
    const motherData = {
      name: req.body.mother_name,
      lastname: req.body.mother_lastname,
      national_code: req.body.mother_national_code,
      birth_certificate: req.body.mother_birth_certificate,
      birth_date: req.body.mother_birth_date,
      education: req.body.mother_education,
      field: req.body.mother_field,
      job: req.body.mother_job,
      work_address: req.body.mother_work_address,
      work_phone: req.body.mother_work_phone,
    };
    req.session.fatherInfo = fatherData;
    req.session.motherInfo = motherData;
  }

  res.redirect('/step5');
};

exports.getStep5 = (req, res) => {
  res.render('register/step5', {
    error: null,
    formData: {},
  });
};

exports.postStep5 = (req, res) => {
  const {
    special_mobile,
    home_phone,
    father_mobile,
    mother_mobile,
    student_mobile,
    guardian,
    province,
    county,
    city,
    main_street,
    side_street,
    main_alley,
    side_alley,
    building_number,
    floor,
    postal_code,
    housing_status,
    latitude,
    longitude,
  } = req.body;

  const errors = [];

  if (!special_mobile || !guardian || !province || !county || !city || !main_street || !housing_status || !latitude || !longitude) {
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

  if (errors.length > 0) {
    return res.render('register/step5', {
      error: errors.join(' '),
      formData: req.body,
    });
  }

  res.cookie('special_mobile', special_mobile);
  res.cookie('home_phone', home_phone || '');
  res.cookie('father_mobile', father_mobile || '');
  res.cookie('mother_mobile', mother_mobile || '');
  res.cookie('student_mobile', student_mobile || '');
  res.cookie('guardian', guardian);
  res.cookie('province', province);
  res.cookie('county', county);
  res.cookie('city', city);
  res.cookie('main_street', main_street);
  res.cookie('side_street', side_street || '');
  res.cookie('main_alley', main_alley || '');
  res.cookie('side_alley', side_alley || '');
  res.cookie('building_number', building_number || '');
  res.cookie('floor', floor || '');
  res.cookie('postal_code', postal_code || '');
  res.cookie('housing_status', housing_status);
  res.cookie('latitude', latitude);
  res.cookie('longitude', longitude);

  res.redirect('/step6');
};

exports.getStep6 = (req, res) => {
  res.render('register/step6', {
    error: null,
    formData: {},
  });
};

exports.postStep6 = (req, res) => {
  const {
    livingWith,
    livingWithOthers,
    parentsStatus,
    divorcedParents,
    deceasedParents,
    deceasedExplanation,
    workingOutside,
    workingExplanation,
    sportsRank,
    sportsRankDesc,
    artRank,
    artRankDesc,
    specialSkill,
    specialSkillDesc,
    isSadat,
    writingHand,
    parentTeacher,
    fatherStaffCode,
    motherStaffCode,
    religion,
    religionOther,
    nationality,
    nationalityCountry,
    insurance,
    supportOrg,
    isVeteranFamily,
    veteranPriority,
    veteranPriorityOthers,
    physicalStatus,
    disabilities,
    educationInfo,
    additionalNotes,
  } = req.body;

  const errors = [];

  // اعتبارسنجی‌های نمونه (می‌توانید بیشتر اضافه کنید)
  if (!livingWith) errors.push('هم‌خانگی هنرجو را انتخاب کنید.');
  if (!parentsStatus) errors.push('وضعیت والدین را انتخاب کنید.');
  if (!workingOutside) errors.push('وضعیت اشتغال خارج از تحصیل را انتخاب کنید.');
  if (workingOutside === 'yes' && (!workingExplanation || workingExplanation.trim() === '')) {
    errors.push('توضیح اشتغال خارج از تحصیل را وارد کنید.');
  }
  if (sportsRank === 'yes' && (!sportsRankDesc || sportsRankDesc.trim() === '')) {
    errors.push('عنوان رشته و مقام ورزشی را وارد کنید.');
  }
  if (artRank === 'yes' && (!artRankDesc || artRankDesc.trim() === '')) {
    errors.push('عنوان رشته و مقام فرهنگی و هنری را وارد کنید.');
  }
  const validGrades = ['خیلی خوب', 'عالی'];
  if (sportsRank === 'yes' && !validGrades.some(g => sportsRankDesc && sportsRankDesc.includes(g))) {
    errors.push('مقدار رشته ورزشی باید فقط "خیلی خوب" یا "عالی" باشد.');
  }
  if (artRank === 'yes' && !validGrades.some(g => artRankDesc && artRankDesc.includes(g))) {
    errors.push('مقدار رشته فرهنگی و هنری باید فقط "خیلی خوب" یا "عالی" باشد.');
  }

  if (errors.length > 0) {
    return res.render('register/step6', {
      error: errors.join(' '),
      formData: req.body,
    });
  }

  // ذخیره داده‌ها در سشن یا کوکی (اینجا سشن)
  req.session.step6 = {
    livingWith,
    livingWithOthers,
    parentsStatus,
    divorcedParents,
    deceasedParents,
    deceasedExplanation,
    workingOutside,
    workingExplanation,
    sportsRank,
    sportsRankDesc,
    artRank,
    artRankDesc,
    specialSkill,
    specialSkillDesc,
    isSadat,
    writingHand,
    parentTeacher,
    fatherStaffCode,
    motherStaffCode,
    religion,
    religionOther,
    nationality,
    nationalityCountry,
    insurance,
    supportOrg,
    isVeteranFamily,
    veteranPriority,
    veteranPriorityOthers,
    physicalStatus,
    disabilities,
    educationInfo,
    additionalNotes,
  };

  res.redirect('/step7');
};