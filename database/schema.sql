CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  fullname TEXT,
  password_hash  TEXT UNIQUE NOT NULL, 
  number TEXT UNIQUE,
  company_name TEXT,
  edrpou TEXT,
  legal_address TEXT  
);

CREATE TABLE IF NOT EXISTS products (
  prod_id INTEGER PRIMARY KEY AUTOINCREMENT ,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  cost REAL NOT NULL,
  photo TEXT NOT NULL,
  status TEXT NOT NULL,
  count_of_bought INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  reviews_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER, 
  user_id INTEGER,
  comment TEXT,
  rating INTEGER,
  time TEXT DEFAULT (Date('now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS wishlist (
  wishlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  prod_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id)
);

CREATE TABLE IF NOT EXISTS history_purchases (
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER,
  user_id INTEGER,
  quantity INTEGER DEFAULT 1,
  total_price REAL NOT NULL,
  order_date TEXT DEFAULT (Date('now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id)
);

CREATE TABLE IF NOT EXISTS history_rentals (
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prod_id INTEGER,
  user_id INTEGER,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'Активна',
  order_date TEXT DEFAULT (Date('now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (prod_id) REFERENCES products(prod_id)
);

-- ============================================
-- SEED DATA — тестові дані для всіх таблиць
-- ============================================

-- USERS
INSERT OR IGNORE INTO users (user_id, email, fullname, password_hash, number, company_name, edrpou, legal_address) VALUES
(1, 'ivan.test@example.com',       'Іванов Іван Іванович',      'a1b2c3d4e5f6',                                                  '+380501234567', NULL,                    NULL,       NULL),
(2, 'contact@smarttech.ua',        'Петров Петро Петрович',     'f6e5d4c3b2a1',                                                  '+380671234567', 'ТОВ "Смарт Тек"',       '12345678', 'м. Київ, вул. Хрещатик, 10'),
(3, 'wolena.fop@example.com',      'Коваленко Олена',           'qwert12345hash',                                                '+380631234567', 'ФОП Коваленко О.І.',    '87654321', 'м. Одеса, вул. Дерибасівська, 1'),
(4, 'primorskylisei67915@gmail.com','тест тест тест',            '$2b$10$mW7mX2zPNfNDngGk5rtc2evKWqoFqNHD/X07EzJp9lYJsiD6VJGYG', '+380980797773', NULL,                    NULL,       NULL),
(5, 'mykola.bud@gmail.com',        'Мельник Микола',            'hash_mykola_123',                                               '+380991112233', 'ТОВ "БудМайстер"',      '11223344', 'м. Харків, вул. Сумська, 5'),
(6, 'oksana.tool@ukr.net',         'Шевченко Оксана',           'hash_oksana_456',                                               '+380661112233', 'ФОП Шевченко О.В.',     '55667788', 'м. Львів, вул. Городоцька, 12'),
(7, 'serhii.rent@gmail.com',       'Бондаренко Сергій',         'hash_serhii_789',                                               '+380731112233', NULL,                    NULL,       NULL),
(8, 'anna.build@ukr.net',          'Ткаченко Анна',             'hash_anna_000',                                                 '+380501119988', 'ТОВ "АннаБуд"',         '99887766', 'м. Дніпро, вул. Робоча, 3'),
(9, 'dmytro.pro@gmail.com',        'Кравченко Дмитро',          'hash_dmytro_321',                                               '+380671117766', 'ФОП Кравченко Д.О.',    '44332211', 'м. Запоріжжя, пр. Металургів, 7');

-- PRODUCTS
INSERT OR IGNORE INTO products (prod_id, name, category, description, cost, photo, status, count_of_bought) VALUES
(1, 'Ударний дриль Bosch',              'electro',  'Потужний дриль для свердління бетону, металу та дерева. Потужність 700 Вт.',                                                                                                                                            2500,    'drill_bosch.webp',         'В наявності',       14),
(2, 'Кутова шліфмашина Makita',         'electro',  'Болгарка з діаметром диска 125 мм. Ідеальна для різання та шліфування.',                                                                                                                                               3100.5,  'grinder_makita.webp',      'В наявності',       8),
(3, 'Шуруповерт акумуляторний Hyundai A 2020Li', 'electro', 'Акумуляторний шуруповерт Hyundai A 2020LI. Напруга 20В, Ємність акумулятора 1.5 Аг, Максимальний крутний момент 35 Нм, Кількість швидкостей 2, Патрон 10 мм, Кількість акумуляторів 2.',                   3814,    'drill_Hyundai.webp',       'В наявності',       21),
(4, 'Лазерний рівень DeWalt',           'measure',  'Самовирівнювальний лазерний рівень з проекцією на 360 градусів.',                                                                                                                                                       5400,    'laser_level_DeWalt.webp',  'В наявності',       5),
(5, 'Рулетка будівельна 5м',            'measure',  'Ергономічна рулетка з магнітним зачепом та автофіксацією.',                                                                                                                                                             450,     'tape_5m.webp',             'Залишилось мало',   33),
(6, 'Бетономішалка 150л',               'heavy',    'Оренда професійної бетономішалки на добу. Вартість вказана за 1 день оренди.',                                                                                                                                          800,     'concrete_mixer.webp',      'Тільки оренда',     0),
(7, 'Віброплита бензинова',             'heavy',    'Оренда віброплити для ущільнення ґрунту та асфальту (за добу).',                                                                                                                                                        600,     'vibroplate.webp',          'В оренді',          0),
(8, 'Молоток слюсарний 500г',           'hand',     'Надійний молоток з фібергласовою ручкою, що гасить вібрацію.',                                                                                                                                                          350,     'hammer.webp',              'В наявності',       17),
(9, 'Набір викруток (6 шт)',             'hand',     'Комплект хрестових та плоских викруток з магнітними накінечниками.',                                                                                                                                                    280,     'screwdrivers.webp',        'Немає в наявності', 9);

-- REVIEWS
INSERT OR IGNORE INTO reviews (reviews_id, prod_id, user_id, comment, rating, time) VALUES
(1, 1, 2, 'Відмінний дриль, працює без нарікань вже пів року. Рекомендую!',                           5, '2025-11-10 10:23:00'),
(2, 1, 3, 'Хороший інструмент, але трохи важкуватий для тривалої роботи.',                             4, '2025-12-01 14:05:00'),
(3, 2, 4, 'Болгарка супер, ріже як масло. Диски тримаються добре.',                                   5, '2025-10-15 09:00:00'),
(4, 3, 5, 'Шуруповерт зручний, акумулятор тримає довго. Брав для дачі — ідеально.',                   5, '2026-01-20 16:30:00'),
(5, 4, 6, 'Лазерний рівень точний, вирівнював плитку — все ідеально лягло.',                          5, '2026-02-05 11:00:00'),
(6, 5, 7, 'Звичайна рулетка, нічого особливого. За ці гроші — норм.',                                 3, '2026-01-08 08:45:00'),
(7, 8, 8, 'Молоток міцний, ручка не ковзає. Задоволений покупкою.',                                   4, '2025-09-22 13:20:00'),
(8, 3, 9, 'Шуруповерт трохи шумить на великих обертах, але загалом добре.',                           4, '2026-02-14 17:10:00'),
(9, 2, 1, 'Для побутових задач підходить чудово. Ціна/якість на висоті.',                             4, '2026-03-01 12:00:00');

-- WISHLIST
INSERT OR IGNORE INTO wishlist (wishlist_id, user_id, prod_id) VALUES
(1, 1, 2),
(2, 1, 4),
(3, 2, 1),
(4, 2, 3),
(5, 3, 5),
(6, 4, 1),
(7, 4, 8),
(8, 5, 4),
(9, 6, 9);

-- HISTORY_PURCHASES
INSERT OR IGNORE INTO history_purchases (history_id, prod_id, user_id, quantity, total_price, order_date) VALUES
(1, 1, 2, 1, 2500,   '2025-11-01'),
(2, 3, 4, 2, 7628,   '2025-11-15'),
(3, 5, 3, 3, 1350,   '2025-12-03'),
(4, 8, 5, 1, 350,    '2025-12-20'),
(5, 2, 1, 1, 3100.5, '2026-01-05'),
(6, 4, 6, 1, 5400,   '2026-01-18'),
(7, 9, 7, 2, 560,    '2026-02-02'),
(8, 1, 8, 1, 2500,   '2026-02-22'),
(9, 5, 9, 5, 2250,   '2026-03-01');

-- HISTORY_RENTALS
INSERT OR IGNORE INTO history_rentals (history_id, prod_id, user_id, start_date, end_date, total_price, status, order_date) VALUES
(1, 6, 2, '2025-11-05', '2025-11-08', 2400,  'Завершена', '2025-11-05'),
(2, 7, 3, '2025-11-20', '2025-11-22', 1200,  'Завершена', '2025-11-20'),
(3, 6, 4, '2025-12-10', '2025-12-12', 1600,  'Завершена', '2025-12-10'),
(4, 7, 5, '2026-01-03', '2026-01-05', 1200,  'Завершена', '2026-01-03'),
(5, 6, 1, '2026-01-15', '2026-01-20', 4000,  'Завершена', '2026-01-15'),
(6, 7, 6, '2026-02-01', '2026-02-03', 1200,  'Завершена', '2026-02-01'),
(7, 6, 7, '2026-02-10', '2026-02-11', 800,   'Завершена', '2026-02-10'),
(8, 7, 8, '2026-03-01', '2026-03-04', 1800,  'Активна',   '2026-03-01'),
(9, 6, 9, '2026-03-05', '2026-03-07', 1600,  'Активна',   '2026-03-05');

-- SEQUENCES
INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('users', 9);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('products', 9);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('reviews', 9);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('wishlist', 9);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('history_purchases', 9);
INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('history_rentals', 9);


