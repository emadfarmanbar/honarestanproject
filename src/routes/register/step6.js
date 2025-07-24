const express = require('express');
const router = express.Router();
const {
  getStep6,
  postStep6
} = require('../../controllers/register/step6Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

router.get('/step6', registerStepGuard, getStep6);
router.post('/step6', registerStepGuard, postStep6);

module.exports = router;
