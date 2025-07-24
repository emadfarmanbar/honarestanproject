const Registration = require('../../models/Registration');
const sanitizeHtml = require('sanitize-html');

// Configurable tuition fees (in Rials)
const TUITION_FEE = 80000000; // 8,000,000 Toman
const CASH_CHECK_AMOUNT = 20000000; // 2,000,000 Toman for check payment
const CHECK_AMOUNT = 60000000; // 6,000,000 Toman for check

exports.getStep8 = (req, res) => {
  req.session.currentStep = 8;
  res.render('register/step8', {
    error: null,
    formData: {},
    csrfToken: req.csrfToken()
  });
};

exports.postStep8 = async (req, res) => {
  const {
    paymentMethod,
    cashAmount,
    cashDate,
    cashTrackingCode,
    checkCashAmount,
    checkCashDate,
    checkCashTrackingCode,
    checkAmount,
    checkDate,
    checkTrackingCode,
    checkBank,
    checkShaba,
    checkAccountHolder,
    cooperation,
    cooperationFields,
    knowsBenefactor,
    benefactorInfo,
  } = req.body;

  const errors = [];

  // Validate payment method
  if (!paymentMethod || !['cash', 'check'].includes(paymentMethod)) {
    errors.push('لطفاً روش پرداخت را انتخاب کنید.');
  }

  // Validate cash payment
  if (paymentMethod === 'cash') {
    if (!cashAmount || isNaN(cashAmount) || parseInt(cashAmount) !== TUITION_FEE) {
      errors.push(`مبلغ نقدی باید دقیقاً ${TUITION_FEE.toLocaleString('fa-IR')} ریال باشد.`);
    }
    if (!cashDate) {
      errors.push('تاریخ پرداخت نقدی الزامی است.');
    }
    if (!cashTrackingCode) {
      errors.push('کد رهگیری کارت‌خوان/کارت الکترونیکی الزامی است.');
    }
  }

  // Validate check payment
  if (paymentMethod === 'check') {
    if (!checkCashAmount || isNaN(checkCashAmount) || parseInt(checkCashAmount) !== CASH_CHECK_AMOUNT) {
      errors.push(`مبلغ نقدی چک باید دقیقاً ${CASH_CHECK_AMOUNT.toLocaleString('fa-IR')} ریال باشد.`);
    }
    if (!checkCashDate) {
      errors.push('تاریخ پرداخت نقدی چک الزامی است.');
    }
    if (!checkCashTrackingCode) {
      errors.push('کد رهگیری پرداخت نقدی چک الزامی است.');
    }
    if (!checkAmount || isNaN(checkAmount) || parseInt(checkAmount) !== CHECK_AMOUNT) {
      errors.push(`مبلغ چک باید دقیقاً ${CHECK_AMOUNT.toLocaleString('fa-IR')} ریال باشد.`);
    }
    if (!checkDate) {
      errors.push('تاریخ وصول چک الزامی است.');
    }
    if (!checkTrackingCode) {
      errors.push('شناسه صیادی چک الزامی است.');
    }
    if (!checkBank) {
      errors.push('بانک عامل چک الزامی است.');
    }
    if (!checkShaba || !/^IR[0-9]{24}$/.test(checkShaba)) {
      errors.push('شماره شبا چک نامعتبر است.');
    }
    if (!checkAccountHolder) {
      errors.push('نام صاحب حساب چک الزامی است.');
    }
  }

  // Validate cooperation
  if (!cooperation || !['yes', 'no'].includes(cooperation)) {
    errors.push('لطفاً تمایل به همکاری را مشخص کنید.');
  }
  if (cooperation === 'yes' && (!cooperationFields || !Array.isArray(cooperationFields) || cooperationFields.length === 0)) {
    errors.push('لطفاً حداقل یک زمینه همکاری را انتخاب کنید.');
  }

  // Validate benefactor
  if (!knowsBenefactor || !['yes', 'no'].includes(knowsBenefactor)) {
    errors.push('لطفاً مشخص کنید که آیا خیری می‌شناسید یا خیر.');
  }
  if (knowsBenefactor === 'yes' && !benefactorInfo) {
    errors.push('لطفاً مشخصات خیر را وارد کنید.');
  }

  if (errors.length > 0) {
    return res.render('register/step8', {
      error: errors.join(' '),
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }

  // Prepare data for storage
  const step8 = {
    paymentMethod,
    cashPayment: paymentMethod === 'cash' ? {
      amount: parseInt(cashAmount) || 0,
      date: cashDate || '',
      trackingCode: cashTrackingCode || ''
    } : {
      amount: 0,
      date: '',
      trackingCode: ''
    },
    checkPayment: paymentMethod === 'check' ? {
      cash: {
        amount: parseInt(checkCashAmount) || 0,
        date: checkCashDate || '',
        trackingCode: checkCashTrackingCode || ''
      },
      checks: [{
        amount: parseInt(checkAmount) || 0,
        date: checkDate || '',
        trackingCode: checkTrackingCode || '',
        bank: checkBank || '',
        shaba: checkShaba || '',
        accountHolder: checkAccountHolder || ''
      }]
    } : {
      cash: {
        amount: 0,
        date: '',
        trackingCode: ''
      },
      checks: []
    },
    cooperation,
    cooperationFields: cooperation === 'yes' ? (Array.isArray(cooperationFields) ? cooperationFields : [cooperationFields]) : [],
    knowsBenefactor,
    benefactorInfo: knowsBenefactor === 'yes' ? sanitizeHtml(benefactorInfo) : ''
  };

  try {
    if (req.session.registrationId) {
      await Registration.findByIdAndUpdate(
        req.session.registrationId,
        { $set: { step8 } }, // حذف otp چون در اسکیما تعریف نشده است
        { new: true }
      );
      // پاکسازی سشن
      req.session.step3 = null;
      req.session.step5 = null;
      req.session.step6 = null;
      req.session.fatherInfo = null;
      req.session.motherInfo = null;
      req.session.mobile = null;
      req.session.currentStep = 9;
      res.redirect('/step9');
    } else {
      return res.render('register/step8', {
        error: 'خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.',
        formData: req.body,
        csrfToken: req.csrfToken()
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.render('register/step8', {
      error: 'خطا در ذخیره اطلاعات در پایگاه داده. لطفاً دوباره تلاش کنید.',
      formData: req.body,
      csrfToken: req.csrfToken()
    });
  }
};