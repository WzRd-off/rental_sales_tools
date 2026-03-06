const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DB_PATH = './database/db_main.db';

class DBManager {
    constructor() {
        this.db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Помилка підключення до БД:', err.message);
            }
        });
        this._initSchema();
    }

    _initSchema() {
        try {
            const schemaSql = fs.readFileSync('./database/schema.sql', 'utf8');

            db.exec(schemaSql, (err) => {
                if (err) {
                    console.error('Помилка при виконанні schema.sql:', err.message);
                } else {
                    console.log('База даних успішно ініціалізована схемою.');
                }
            });
        } catch (err) {
            console.error('Помилка читання файлу schema.sql:', err.message);
        }
    }

    _run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }           
             });
        });
    }

    _get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {              
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }         
            });  
        });  
    }

    _all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    _close() {
        this.db.close((err) => {
            if (err) {
                console.error('Помилка при закритті бази даних:', err.message);
            } else {
                console.log('База даних успішно закрита.');
            }
        });
    }
}

module.exports = DBManager;