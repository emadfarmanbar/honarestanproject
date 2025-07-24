const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const { getStep9, postStep9 } = require('../../controllers/register/step9Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

const csrfProtection = csrf({ cookie: true });

// روت‌های مرحله ۹
router.get('/step9', registerStepGuard, getStep9);
router.post('/step9', registerStepGuard, csrfProtection, postStep9);

module.exports = router;
