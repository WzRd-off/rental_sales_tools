const db = require('../database/db_manager');

const getAllProducts = async (req, res) => {
  try {
    const products = await db.all('SELECT * FROM products');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Помилка при отриманні товарів:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await db.get('SELECT * FROM products WHERE prod_id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Товар не знайдено' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Помилка при отриманні товару:', error);
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
};

module.exports = { getAllProducts, getProductById };