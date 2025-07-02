const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const registerController = require('../controllers/registerController');

// مرحله 1
router.get('/', registerController.step1);

// مرحله 2
router.get('/step2', registerController.getStep2);
router.post(
  '/step2',
  body('mobile')
    .matches(/^09\d{9}$/)
    .withMessage('شماره موبایل معتبر نیست!'),
  registerController.postStep2
);

// مرحله 3
router.get('/step3', registerController.getStep3);
router.post(
  '/step3',
  body('firstName').notEmpty().withMessage('نام الزامی است!'),
  body('lastName').notEmpty().withMessage('نام خانوادگی الزامی است!'),
  body('fatherName').notEmpty().withMessage('نام پدر الزامی است!'),
  body('nationalId').matches(/^\d{10}$/).withMessage('کد ملی معتبر نیست!'),
  body('shenasnamehSerial').notEmpty().withMessage('سریال شناسنامه الزامی است!'),
  body('issuePlace').notEmpty().withMessage('محل صدور الزامی است!'),
  body('birthPlace').notEmpty().withMessage('محل تولد الزامی است!'),
  body('birthDate').notEmpty().withMessage('تاریخ تولد الزامی است!'),
  body('major').notEmpty().withMessage('رشته الزامی است!'),
  registerController.postStep3
);

// مرحله 4
router.get('/step4', registerController.getStep4);
router.post('/step4', registerController.postStep4);

// مرحله 5
router.get('/step5', registerController.getStep5);
router.post('/step5', registerController.postStep5);

// مرحله 6
router.get('/step6', registerController.getStep6);
router.post('/step6', registerController.postStep6);

module.exports = router;