const express = require('express');
const router = express.Router();
const registerStepGuard = require('../../middleware/registerStepGuard');

// وارد کردن فایل‌های روت مراحل
router.use('/', require('./step1'));
router.use('/', require('./step2'));
router.use('/', require('./otp'));
router.use('/', require('./step3'));
router.use('/', require('./step4'));
router.use('/', require('./step5'));
router.use('/', require('./step6'));
router.use('/', require('./step7'));
router.use('/', require('./step8'));
router.use('/', require('./step9')); 


module.exports = router;