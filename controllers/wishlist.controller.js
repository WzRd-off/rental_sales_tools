const db = require('../database/db_manager');

const getWishlist = async (req, res) => {
    const userId = req.headers['user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Не авторизовано' });
    try {
        const items = await db.all(`
            SELECT w.wishlist_id, p.prod_id, p.name, p.photo, p.cost, p.status, p.category
            FROM wishlist w
            JOIN products p ON w.prod_id = p.prod_id
            WHERE w.user_id = ?
        `, [userId]);
        res.json({ success: true, data: items });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const addToWishlist = async (req, res) => {
    const userId = req.headers['user-id'];
    const { prod_id } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: 'Не авторизовано' });
    try {
        const existing = await db.get('SELECT * FROM wishlist WHERE user_id = ? AND prod_id = ?', [userId, prod_id]);
        if (existing) return res.json({ success: true, message: 'Вже в списку' });
        await db.run('INSERT INTO wishlist (user_id, prod_id) VALUES (?, ?)', [userId, prod_id]);
        res.json({ success: true, message: 'Додано до бажаного' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const removeFromWishlist = async (req, res) => {
    const userId = req.headers['user-id'];
    const { prod_id } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: 'Не авторизовано' });
    try {
        await db.run('DELETE FROM wishlist WHERE user_id = ? AND prod_id = ?', [userId, prod_id]);
        res.json({ success: true, message: 'Видалено з бажаного' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };