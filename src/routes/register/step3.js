const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getStep3,
  postStep3
} = require('../../controllers/register/step3Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

router.get('/step3', registerStepGuard, getStep3);
router.post(
  '/step3',
  registerStepGuard,
  body('firstName').notEmpty().withMessage('نام الزامی است!'),
  body('lastName').notEmpty().withMessage('نام خانوادگی الزامی است!'),
  body('fatherName').notEmpty().withMessage('نام پدر الزامی است!'),
  body('nationalId').matches(/^\d{10}$/).withMessage('کد ملی معتبر نیست!'),
  body('shenasnamehSerialPart1').matches(/^[آ-ی]\d{2}$/).withMessage('قسمت اول سریال شناسنامه معتبر نیست!'),
  body('shenasnamehSerialPart2').matches(/^\d{6}$/).withMessage('قسمت دوم سریال شناسنامه معتبر نیست!'),
  body('issuePlace').notEmpty().withMessage('محل صدور الزامی است!'),
  body('birthPlace').notEmpty().withMessage('محل تولد الزامی است!'),
  body('birthDate').notEmpty().withMessage('تاریخ تولد الزامی است!'),
  body('major').notEmpty().withMessage('رشته الزامی است!'),
  postStep3
);

module.exports = router;
