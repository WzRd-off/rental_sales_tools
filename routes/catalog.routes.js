const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');

router.get('/', catalogController.getAllProducts);
router.get('/:id', catalogController.getProductById);

module.exports = router;