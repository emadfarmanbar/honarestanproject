const Registration = require('../../models/Registration');

exports.getStep6 = (req, res) => {
  req.session.currentStep = 6;
  res.render('register/step6', {
    error: null,
    formData: {},
    csrfToken: req.csrfToken()
  });
};

exports.postStep6 = async (req, res) => {
  const {
    livingWith, livingWithOthers, parentsStatus, divorcedParents,
    deceasedParents, deceasedExplanation, workingOutside, workingExplanation,
    sportsRank, sportsRankDesc, artRank, artRankDesc, specialSkill, specialSkillDesc,
    isSadat, writingHand, parentTeacher, fatherStaffCode, motherStaffCode,
    religion, religionOther, nationality, nationalityCountry, insurance, supportOrg,
    isVeteranFamily, veteranPriority, veteranPriorityOthers,
    physicalStatus, disabilities, 
    ninthGradeAverage, ninthGradeDiscipline,
    additionalNotes,
  } = req.body;

  const errors = [];

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
  if (specialSkill === 'yes' && (!specialSkillDesc || specialSkillDesc.trim() === '')) {
    errors.push('توضیح مهارت خاص را وارد کنید.');
  }
  if (deceasedParents === 'yes' && (!deceasedExplanation || !['پدر','مادر','هر دو'].includes(deceasedExplanation))) {
    errors.push('لطفاً مشخص کنید کدام والد فوت شده است.');
  }
  if (isVeteranFamily === 'yes') {
    if (!veteranPriority) {
      errors.push('اولویت ایثارگری را انتخاب کنید.');
    }
    if (veteranPriority === 'others' && (!veteranPriorityOthers || veteranPriorityOthers.trim() === '')) {
      errors.push('لطفاً توضیح سایرین ایثارگری را وارد کنید.');
    }
  }
  if (physicalStatus === 'disabled') {
    if (!disabilities || (Array.isArray(disabilities) && disabilities.length === 0) || (!Array.isArray(disabilities) && !disabilities)) {
      errors.push('حداقل یک مورد از بیماری/معلولیت را انتخاب کنید.');
    }
  }
  if (parentTeacher === 'yes') {
    if ((!fatherStaffCode || fatherStaffCode.trim() === '') && (!motherStaffCode || motherStaffCode.trim() === '')) {
      errors.push('حداقل یکی از کدهای پرسنلی پدر یا مادر باید وارد شود.');
    }
  }

  if (!ninthGradeAverage || ninthGradeAverage.trim() === '') {
    errors.push('معدل کل سال نهم را وارد کنید.');
  }
  if (!ninthGradeDiscipline || !['خیلی خوب', 'عالی'].includes(ninthGradeDiscipline)) {
    errors.push('انضباط سال نهم فقط باید "خیلی خوب" یا "عالی" باشد.');
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
      csrfToken: req.csrfToken()
    });
  }

  // ساختاردهی داده‌های مرحله ۶
  const step6 = {
    family: {
      livingWith,
      livingWithOthers,
      parentsStatus,
      divorcedParents: divorcedParents === 'yes',
      deceasedParents: deceasedParents === 'yes',
      deceasedExplanation,
    },
    skills: {
      workingOutside: workingOutside === 'yes',
      workingExplanation,
      sportsRank: sportsRank === 'yes',
      sportsRankDesc,
      artRank: artRank === 'yes',
      artRankDesc,
      specialSkill: specialSkill === 'yes',
      specialSkillDesc,
    },
    identity: {
      isSadat: isSadat === 'yes',
      writingHand,
      parentTeacher: parentTeacher === 'yes',
      fatherStaffCode,
      motherStaffCode,
      religion,
      religionOther,
      nationality,
      nationalityCountry,
      insurance,
      supportOrg,
      isVeteranFamily: isVeteranFamily === 'yes',
      veteranPriority,
      veteranPriorityOthers,
      physicalStatus,
      disabilities: Array.isArray(disabilities) ? disabilities : disabilities ? [disabilities] : [],
    },
    education: {
      ninthGradeAverage,
      ninthGradeDiscipline,
      additionalNotes,
    }
  };

  req.session.step6 = step6;

  // جمع‌آوری اطلاعات همه مراحل قبلی
  const registrationData = {
    mobile: req.session.mobile,
    firstName: req.session.step3.firstName,
    lastName: req.session.step3.lastName,
    fatherName: req.session.step3.fatherName,
    nationalId: req.session.step3.nationalId,
    shenasnamehSerial: req.session.step3.shenasnamehSerial,
    issuePlace: req.session.step3.issuePlace,
    birthPlace: req.session.step3.birthPlace,
    birthDate: req.session.step3.birthDate,
    major: req.session.step3.major,
    fatherInfo: req.session.fatherInfo,
    motherInfo: req.session.motherInfo,
    special_mobile: req.session.step5.special_mobile,
    home_phone: req.session.step5.home_phone,
    father_mobile: req.session.step5.father_mobile,
    mother_mobile: req.session.step5.mother_mobile,
    student_mobile: req.session.step5.student_mobile,
    guardian: req.session.step5.guardian,
    other_guardian_phone: req.session.step5.other_guardian_phone,
    province: req.session.step5.province,
    county: req.session.step5.county,
    city: req.session.step5.city,
    main_street: req.session.step5.main_street,
    side_street: req.session.step5.side_street,
    main_alley: req.session.step5.main_alley,
    side_alley: req.session.step5.side_alley,
    building_number: req.session.step5.building_number,
    floor: req.session.step5.floor,
    postal_code: req.session.step5.postal_code,
    housing_status: req.session.step5.housing_status,
    other_housing_desc: req.session.step5.other_housing_desc,
    step6,
  };

  try {
    let registration;
    if (req.session.registrationId) {
      registration = await Registration.findByIdAndUpdate(
        req.session.registrationId,
        { $set: registrationData },
        { new: true }
      );
    } else {
      registration = new Registration(registrationData);
      await registration.save();
      req.session.registrationId = registration._id;
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.render('register/step6', {
      error: 'خطا در ذخیره اطلاعات در پایگاه داده. لطفاً دوباره تلاش کنید.',
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }

  req.session.currentStep = 7;
  res.redirect('/step7');
};