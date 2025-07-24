const express = require('express');
const { body } = require('express-validator');
const { getOtp, postOtp } = require('../../controllers/register/otpController');
const registerStepGuard = require('../../middleware/registerStepGuard');

const router = express.Router();

router.get('/otp', registerStepGuard, getOtp);
router.post(
  '/otp',
  body('otp')
    .isLength({ min: 4, max: 4 })
    .withMessage('کد باید ۴ رقمی باشد'),
  registerStepGuard,
  postOtp
);

module.exports = router;
