CREATE TABLE IF NOT EXISTS users
(
  user_id INTEGER PRIMARY KEY AUTOINCREMENT FOREINGN KEY,
  email TEXT UNIQUE NOT NULL,
  fullname TEXT,
  password_hash  TEXT UNIQUE NOT NULL, 
  number TEXT UNIQUE 
);

CREATE TABLE IF NOT EXISTS products(
  prod_id INTEGER PRIMARY KEY AUTOINCREMENT ,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  cost REAL NOT NULL,
  photo TEXT NOT NULL,
  status TEXT NOT NULL,
  count_of_bought INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews
(
  reviews_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER, 
  user_id INTEGER,
  comment TEXT,
  rating INTEGER,
  time TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS wishlist
(
  wishlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  prod_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id)
);

CREATE TABLE IF NOT EXISTS history_purchases
(
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER,
  user_id INTEGER,
  total_price REAL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id)
);

CREATE TABLE IF NOT EXISTS history_rentals
(
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER,
  user_id INTEGER,
  start_date TEXT,
  end_date TEXT,
  total_price REAL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id)
);



