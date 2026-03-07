const express = require('express');
const router = express.Router();
const catalogRouter = require('./catalog.routes');
const orderRouter = require('./order.routes');
const authRouter = require('./auth.routes');
const profileRouter = require('./profile.routes');


router.use('/catalog', catalogRouter);
router.use('/orders', orderRouter);
router.use('/auth', authRouter);
router.use('/profile', profileRouter);

module.exports = router;
