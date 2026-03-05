CREATE TABLE IF NOT EXISTS users
(
  user_id INTEGER PRIMARY KEY AUTOINCREMENT FOREINGN KEY,
  email TEXT UNIQUE NOT NULL,
  login TEXT NOT NULL,
  fullname TEXT,
  password_hash  TEXT UNIQUE NOT NULL, 
  number INTEGER UNIQUE 
);

CREATE TABLE IF NOT EXISTS products(
  prod_id INTEGER PRIMARY KEY AUTOINCREMENT ,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  cost REAL NOT NULL,
  photo BLOB NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews
(
  reviews_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER, 
  user_id INTEGER,
  comment TEXT,
  rating INTEGER,
  time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE (prod_id, user_id)
);

CREATE TABLE IF NOT EXISTS wishlist
(
  wishlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  prod_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id),
  UNIQUE (prod_id, user_id)
);

CREATE TABLE IF NOT EXISTS history_purchases
(
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id),
  UNIQUE (prod_id, user_id)
);

CREATE TABLE IF NOT EXISTS history_rentals
(
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id),
  UNIQUE (prod_id, user_id)
);


