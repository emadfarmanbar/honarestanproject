const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const { check } = require('express-validator');
const { getStep7, postStep7 } = require('../../controllers/register/step7Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

// میدل‌ور CSRF
const csrfProtection = csrf({ cookie: true });

// اعتبارسنجی برای مرحله ۷
const step7Validators = [
  check('acceptRules').equals('yes').withMessage('لطفاً آیین‌نامه انضباطی را مطالعه کرده و تأیید کنید.')
];

// روت‌های مرحله ۷
router.get('/step7', registerStepGuard, getStep7);
router.post('/step7', registerStepGuard, csrfProtection, step7Validators, postStep7);

module.exports = router;