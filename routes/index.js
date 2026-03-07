const express = require('express');
const router = express.Router();
const catalogRouter = require('./catalog.routes');
const orderRouter = require('./order.routes');
const authRouter = require('./auth.routes');

router.use('/catalog', catalogRouter);
router.use('/orders', orderRouter);
router.use('/auth', authRouter);

module.exports = router;
