const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

router.get('/', wishlistController.getWishlist);
router.post('/add', wishlistController.addToWishlist);
router.delete('/remove', wishlistController.removeFromWishlist);

module.exports = router;