const express = require('express');
const cors = require('cors');
const DBManager = require('./database/db_manager');
const apiRouter = require('./routes/index');

const PORT = 3000;

const dbManager = new DBManager();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});