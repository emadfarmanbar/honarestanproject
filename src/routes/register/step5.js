const express = require('express');
const router = express.Router();
const {
  getStep5,
  postStep5
} = require('../../controllers/register/step5Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

router.get('/step5', registerStepGuard, getStep5);
router.post('/step5', registerStepGuard, postStep5);

module.exports = router;
