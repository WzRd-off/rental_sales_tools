const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');

router.get('/', catalogController.getProducts);

module.exports = router;