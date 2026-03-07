const db = require('../database/db_manager');

const getUserProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db._get('SELECT username FROM users WHERE user_id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }
        const purchases = await db._all(
            `SELECT p.prod_id, p.name, hp.total_price, hp.purchase_date 
             FROM history_purchases hp
             JOIN products p ON hp.prod_id = p.prod_id
             WHERE hp.user_id = ?`,
            [userId]
        );

        const rentals = await db._all(
            `SELECT p.prod_id, p.name, hr.total_price, hr.start_date, hr.end_date
             FROM history_rentals hr
             JOIN products p ON hr.prod_id = p.prod_id
             WHERE hr.user_id = ?`,
            [userId]
        );

        res.status(200).json({
            success: true,
            user: user,
            purchases: purchases,
            rentals: rentals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Помилка отримання профілю: " + error.message
        });
    }
};