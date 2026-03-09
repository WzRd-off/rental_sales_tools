const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

router.get('/wishlist', profileController.getWishlist);
router.post('/wishlist/add', profileController.addToWishlist);
router.delete('/wishlist/remove', profileController.removeFromWishlist);

module.exports = router;