const DBManager = require('./database/db_manager');
const dbManager = new DBManager();

async function addUser() {
    let email = document.getElementById('email').textContent,
     login =  document.getElementById('login').textContent,
     fullname = document.getElementById('fullname').textContent,
     password_hash = document.getElementById('password').textContent,
     phone_number = document.getElementById('phone').textContent;
    try {
        await dbManager.run(
            'INSERT INTO users (login, fullname, email, password_hash, phone_number) VALUES (?, ?, ?, ?, ?)', 
            [`${login}`, `${fullname}`, `${email}`, `${password_hash}`, `${phone_number}`]
        );
        console.log('User is added');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function login()
{
    let email = document.getElementById('login_email').textContent,
     password_hash = document.getElementById('login_password').textContent;
    
    try {
        let user = await dbManager.get(
            `SELECT * FROM users 
            WHERE(email == ${email} AND password_hash == ${password_hash})`
        );
        localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function update()
{
     let login =  document.getElementById('login').textContent,
     fullname = document.getElementById('fullname').textContent,
     phone_number = document.getElementById('phone').textContent;
    let user = JSON.parse(localStorage.getItem('currentUser'));
    try {
        await dbManager.run(
            `UPDATE users 
            SET login = ${login}, fullname = ${fullname}, phone_number = ${phone_number} 
            WHERE(email == ${user.email} AND password_hash == ${user.password_hash})`
        );
        user = await dbManager.get(
            `SELECT * FROM users 
            WHERE(email == ${email} AND password_hash == ${password_hash})`
        );
        localStorage.removeItem('currentUser');
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateProfile();
    } catch (err) {
        console.error('Error:', err.message);
    }
}
