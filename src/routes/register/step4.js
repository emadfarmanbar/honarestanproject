const express = require('express');
const router = express.Router();
const {
  getStep4,
  postStep4
} = require('../../controllers/register/step4Controller');
const registerStepGuard = require('../../middleware/registerStepGuard');

router.get('/step4', registerStepGuard, getStep4);
router.post('/step4', registerStepGuard, postStep4);

module.exports = router;
