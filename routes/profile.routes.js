const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

router.get('/info', profileController.getProfile);
router.get('/history', profileController.getHistory);
router.put('/update', profileController.updateProfile);

module.exports = router;