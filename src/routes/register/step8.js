const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const { check } = require('express-validator');
const { getStep8, postStep8 } = require('../../controllers/register/step8Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

// میدل‌ور CSRF
const csrfProtection = csrf({ cookie: true });

// اعتبارسنجی برای مرحله ۸
const step8Validators = [
  check('paymentMethod').isIn(['cash', 'check']).withMessage('لطفاً روش پرداخت را انتخاب کنید.'),
  check('cashAmount').if(check('paymentMethod').equals('cash')).custom((value) => parseInt(value) === 80000000).withMessage('مبلغ نقدی باید دقیقاً ۸۰,۰۰۰,۰۰۰ ریال باشد.'),
  check('cashDate').if(check('paymentMethod').equals('cash')).notEmpty().withMessage('تاریخ پرداخت نقدی الزامی است.'),
  check('cashTrackingCode').if(check('paymentMethod').equals('cash')).notEmpty().withMessage('کد رهگیری کارت‌خوان/کارت الکترونیکی الزامی است.'),
  check('checkCashAmount').if(check('paymentMethod').equals('check')).custom((value) => parseInt(value) === 20000000).withMessage('مبلغ نقدی چک باید دقیقاً ۲۰,۰۰۰,۰۰۰ ریال باشد.'),
  check('checkCashDate').if(check('paymentMethod').equals('check')).notEmpty().withMessage('تاریخ پرداخت نقدی چک الزامی است.'),
  check('checkCashTrackingCode').if(check('paymentMethod').equals('check')).notEmpty().withMessage('کد رهگیری پرداخت نقدی چک الزامی است.'),
  check('checkAmount').if(check('paymentMethod').equals('check')).custom((value) => parseInt(value) === 60000000).withMessage('مبلغ چک باید دقیقاً ۶۰,۰۰۰,۰۰۰ ریال باشد.'),
  check('checkDate').if(check('paymentMethod').equals('check')).notEmpty().withMessage('تاریخ وصول چک الزامی است.'),
  check('checkTrackingCode').if(check('paymentMethod').equals('check')).notEmpty().withMessage('شناسه صیادی چک الزامی است.'),
  check('checkBank').if(check('paymentMethod').equals('check')).notEmpty().withMessage('بانک عامل چک الزامی است.'),
  check('checkShaba').if(check('paymentMethod').equals('check')).matches(/^IR[0-9]{24}$/).withMessage('شماره شبا چک نامعتبر است.'),
  check('checkAccountHolder').if(check('paymentMethod').equals('check')).notEmpty().withMessage('نام صاحب حساب چک الزامی است.'),
  check('cooperation').isIn(['yes', 'no']).withMessage('لطفاً تمایل به همکاری را مشخص کنید.'),
  check('cooperationFields').if(check('cooperation').equals('yes')).isArray({ min: 1 }).withMessage('لطفاً حداقل یک زمینه همکاری را انتخاب کنید.'),
  check('knowsBenefactor').isIn(['yes', 'no']).withMessage('لطفاً مشخص کنید که آیا خیری می‌شناسید یا خیر.'),
  check('benefactorInfo').if(check('knowsBenefactor').equals('yes')).notEmpty().withMessage('لطفاً مشخصات خیر را وارد کنید.')
];

// روت‌های مرحله ۸
router.get('/step8', registerStepGuard, getStep8);
router.post('/step8', registerStepGuard, csrfProtection, step8Validators, postStep8);

module.exports = router;