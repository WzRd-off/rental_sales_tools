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
}

module.exports = new DBManager();