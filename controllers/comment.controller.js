const db = require('../database/db_manager');

const addComment = async (req, res) => {
    try {
        const { prod_id, user_id, grade, comment } = req.body;
        await db._run('INSERT INTO comments (prod_id, user_id, grade, comment) VALUES (?, ?, ?, ?)', [prod_id, user_id, grade, comment]);
        res.status(201).json({ success: true, message: 'Коментар успішно додано' });
    } catch (error) {
        console.error('Помилка при додаванні коментаря:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }   

};

const getCommentsByProductId = async (req, res) => {
    try {
        const { prod_id } = req.params;
        const comments = await db._all('SELECT c.comment_id, c.prod_id, c.user_id, c.grade, c.comment, c.time, u.fullname FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.prod_id = ?', [prod_id]);
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Помилка при отриманні коментарів:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};