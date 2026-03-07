const db = require('../database/db_manager');
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await db._get('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Користувач з таким ім\'ям вже існує' });
        }
        await db._run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ success: true, message: 'Користувача успішно зареєстровано' });
    } catch (error) {
        console.error('Помилка при реєстрації користувача:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db._get('SELECT * FROM users WHERE username = ? AND password = ?', [username, hashedPassword]);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Невірне ім\'я користувача або пароль' });
        }
        res.status(200).json({ success: true, message: 'Успішний вхід' });
    } catch (error) {
        console.error('Помилка при вході користувача:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

module.exports = {
    registerUser,
    loginUser
};