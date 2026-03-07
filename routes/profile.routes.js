const express = require('express');
const router = express.Router();
const authController = require('../controllers/profile.controller');

router.get('/:id', authController.getUserProfile);

module.exports = router;