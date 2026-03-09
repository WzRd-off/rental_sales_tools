const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/index');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});