const express = require('express');
const router = express.Router();
const catalogRouter = require('./catalog.routes');


router.use('/catalog', catalogRouter);

module.exports = router;