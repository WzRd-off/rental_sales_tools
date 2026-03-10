const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
router.post('/add', commentController.addComment);
router.get('/product/:prod_id', commentController.getCommentsByProductId);

module.exports = router;