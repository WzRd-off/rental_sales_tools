const db = require('../database/db_manager');
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {
    try {
        const { email, fullname, password, number } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (!emailRegex.test(email)){
            return res.status(500).json({success: false, message: 'Пошта невiрна'});
        }
        const numberRegex = /^\+\d{1,3}\d{9,15}$/; 
        if (!numberRegex.test(number)){
            return res.status(500).json({success: false, message: 'Номер телефону невiрний'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await db._get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Користувач з таким ім\'ям вже існує' });
        }
        await db._run('INSERT INTO users (email, fullname, password_hash, number) VALUES (?, ?, ?, ?)', [email, fullname, hashedPassword, number]);
        res.status(201).json({ success: true, message: 'Користувача успішно зареєстровано' });

    } catch (error) {
        console.error('Помилка при реєстрації користувача:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db._get('SELECT * FROM users WHERE email = ? AND password_hashed = ?', [email, hashedPassword]);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Невірна пошта або пароль' });
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