const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getStep2,
  postStep2
} = require('../../controllers/register/step2Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

router.get('/step2', registerStepGuard, getStep2);
router.post(
  '/step2',
  registerStepGuard,
  body('mobile')
    .matches(/^09\d{9}$/)
    .withMessage('شماره موبایل معتبر نیست!'),
  postStep2
);

module.exports = router;
