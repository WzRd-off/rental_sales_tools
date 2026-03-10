const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');

router.get('/products/', catalogController.getAllProducts);
router.get('/products/:id', catalogController.getProductById);

module.exports = router;