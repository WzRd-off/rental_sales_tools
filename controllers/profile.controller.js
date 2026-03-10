const db = require('../database/db_manager');
const bcrypt = require('bcrypt');

const getProfile = async (req, res) => {
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Не авторизовано' });
    }

    try {
        const user = await db.get(
            'SELECT user_id, email, fullname, number, company_name, edrpou, legal_address FROM users WHERE user_id = ?',
            [userId]
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Помилка отримання профілю:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const getHistory = async (req, res) => {
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Не авторизовано' });
    }

    try {
        const purchases = await db.all(`
            SELECT h.*, p.name, p.photo 
            FROM history_purchases h
            JOIN products p ON h.prod_id = p.prod_id
            WHERE h.user_id = ?
            ORDER BY h.order_date DESC
        `, [userId]);

        const rentals = await db.all(`
            SELECT h.*, p.name, p.photo 
            FROM history_rentals h
            JOIN products p ON h.prod_id = p.prod_id
            WHERE h.user_id = ?
            ORDER BY h.order_date DESC
        `, [userId]);

        res.status(200).json({
            success: true,
            data: {
                purchases,
                rentals
            }
        });
    } catch (error) {
        console.error('Помилка отримання історії:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.headers['user-id'];
    const { email, fullname, number, company_name, edrpou, legal_address } = req.body;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Не авторизовано' });
    }

    try {
        await db.run(`
            UPDATE users 
            SET email = ?, fullname = ?, number = ?, company_name = ?, edrpou = ?, legal_address = ?
            WHERE user_id = ?
        `, [email, fullname, number, company_name, edrpou, legal_address, userId]);

        res.status(200).json({ success: true, message: 'Профіль оновлено' });
    } catch (error) {
        console.error('Помилка оновлення профілю:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const changePassword = async (req, res) => {
    const userId = req.headers['user-id'];
    const { oldPassword, newPassword } = req.body;

    const {oldPassHash, newPassHash} = await Promise.all([
        bcrypt.hash(oldPassword, 10),
        bcrypt.hash(newPassword, 10)
    ]);

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Не авторизовано' });
    }

    try {
        const user = await db.get('SELECT password_hash FROM users WHERE user_id = ?', [userId]);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }

        if (!await bcrypt.compare(oldPassword, user.password_hash)) {
            return res.status(400).json({ success: false, message: 'Неправильний старий пароль' });
        }

        await db.run('UPDATE users SET password_hash = ? WHERE user_id = ?', [newPassHash, userId]);

        res.status(200).json({ success: true, message: 'Пароль оновлено' });
    } catch (error) {
        console.error('Помилка зміни пароля:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

module.exports = {
    getProfile,
    getHistory,
    updateProfile,
    changePassword
};