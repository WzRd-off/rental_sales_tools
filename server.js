const express = require('express');
const cors = require('cors');
const DBManager = require('./database/db_manager');
const apiRouter = require('./routes/index');

const PORT = 3000;

const dbManager = new DBManager();
const app = express();



async function changeUserData()
{
    let email = document.getElementById('user-email').textContent,
     login =  document.getElementById('user-login').textContent,
     fullname = document.getElementById('user-fullname').textContent,
     password_hash = document.getElementById('user-password').textContent,
     phone_number = document.getElementById('user-number').textContent;

      try {
        await dbManager.run(
            'SELECT * FROM users WHERE id ==  (login, fullname, email, password_hash, phone_number) VALUES (?, ?, ?, ?, ?)', 
            [`${login}`, `${fullname}`, `${email}`, `${password_hash}`, `${phone_number}`]
        );
        console.log('User is added');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});