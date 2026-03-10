const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const DB_PATH = './database/db_main.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err.message);
  } else {
    console.log('Підключення до SQLite успішно.');
  }
});

class DBManager {
  constructor() {
    this.db = db;
    this.initSchema();
  }

  run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

    initSchema() {
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
}

module.exports = new DBManager();