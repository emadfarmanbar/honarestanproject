const express = require('express');
const router = express.Router();
const { step1 } = require('../../controllers/register/step1Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

router.get('/', registerStepGuard, step1);

module.exports = router;
