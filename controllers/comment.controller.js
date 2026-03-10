
const db = require('../database/db_manager');

const addComment = async (req, res) => {
    try {
        const { prod_id, user_id, grade, comment } = req.body;
        const time = new Date().toISOString().replace('T', ' ').substring(0, 19)
        await db.run(
            'INSERT INTO reviews (prod_id, user_id, rating, comment, time) VALUES (?, ?, ?, ?, ?)',
            [prod_id, user_id, grade, comment, time]
        );
        res.status(201).json({ success: true, message: 'Коментар успішно додано' });
    } catch (error) {
        console.error('Помилка при додаванні коментаря:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const getCommentsByProductId = async (req, res) => {
    try {
        const { prod_id } = req.params;
        const comments = await db.all(
            'SELECT r.reviews_id, r.prod_id, r.user_id, r.rating AS grade, r.comment, r.time, u.fullname FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.prod_id = ?',
            [prod_id]
        );
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Помилка при отриманні коментарів:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

module.exports = { addComment, getCommentsByProductId };