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
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        console.error('Помилка отримання вішліста:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const addToWishlist = async (req, res) => {
    const userId = req.headers['user-id'];
    const { prod_id } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: 'Не авторизовано' });
    try {
        const existing = await db.get(
            'SELECT wishlist_id FROM wishlist WHERE user_id = ? AND prod_id = ?',
            [userId, prod_id]
        );
        if (existing) return res.status(200).json({ success: true, message: 'Вже в списку бажань' });
        await db.run('INSERT INTO wishlist (user_id, prod_id) VALUES (?, ?)', [userId, prod_id]);
        res.status(201).json({ success: true, message: 'Додано до списку бажань' });
    } catch (error) {
        console.error('Помилка додавання до вішліста:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const removeFromWishlist = async (req, res) => {
    const userId = req.headers['user-id'];
    const { prod_id } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: 'Не авторизовано' });
    try {
        await db.run('DELETE FROM wishlist WHERE user_id = ? AND prod_id = ?', [userId, prod_id]);
        res.status(200).json({ success: true, message: 'Видалено зі списку бажань' });
    } catch (error) {
        console.error('Помилка видалення з вішліста:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

module.exports = { getProfile, getHistory, updateProfile, getWishlist, addToWishlist, removeFromWishlist };
