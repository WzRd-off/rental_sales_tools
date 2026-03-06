//Catalog
const express = require('express');
const router = express.Router();
const catalogRouter = require('./catalog.routes');


router.use('/catalog', catalogRouter);

module.exports = router;

//Order
const orderRouter = require('./order.routes');
router.use('/orders', orderRouter);
