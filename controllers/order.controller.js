const db = require('../database/db_manager');

const createOrder = async (req, res) => {
   
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Невірні дані замовлення. Очікується userId та масив items."
        });
    }

    try {
        await db._run("BEGIN TRANSACTION");

        let grandTotal = 0;

        for (const item of items) {
            const { prodId, type, startDate, endDate, quantity = 1 } = item;

            if (!prodId || !type) {
                const err = new Error("Кожен товар у кошику повинен мати prodId та type");
                err.status = 400;
                throw err;
            }

            const product = await db._get("SELECT * FROM products WHERE prod_id = ?", [prodId]);
            if (!product) {
                const err = new Error(`Товар з ID ${prodId} не знайдено`);
                err.status = 404;
                throw err;
            }

            let itemTotalPrice = 0;

            if (type === 'sell') {
                itemTotalPrice = product.cost * quantity;
                await db._run(
                    "INSERT INTO history_purchases (prod_id, user_id, quantity, total_price) VALUES (?, ?, ?, ?)",
                    [prodId, userId, quantity, itemTotalPrice]
                );
            } else if (type === 'rent') {
                if (!startDate || !endDate) {
                    const err = new Error(`Не вказано дати оренди для товару з ID ${prodId}`);
                    err.status = 400;
                    throw err;
                }

                const start = new Date(startDate);
                const end = new Date(endDate);
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                
                if (days <= 0) {
                    const err = new Error(`Некоректний період оренди для товару з ID ${prodId}`);
                    err.status = 400;
                    throw err;
                }

                itemTotalPrice = days * product.cost * quantity; 
                await db._run(
                    "INSERT INTO history_rentals (prod_id, user_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)",
                    [prodId, userId, startDate, endDate, itemTotalPrice]
                );
            } else {
                const err = new Error(`Невідомий тип операції '${type}' для товару ${prodId} (тільки sell або rent)`);
                err.status = 400;
                throw err;
            }

            await db._run(
                "UPDATE products SET count_of_bought = count_of_bought + ? WHERE prod_id = ?",
                [quantity, prodId]
            );

            grandTotal += itemTotalPrice;
        }

        await db._run("COMMIT");

        res.status(200).json({
            success: true,
            message: "Замовлення успішно оформлено",
            totalPrice: grandTotal
        });

    } catch (error) {
        await db._run("ROLLBACK");
        
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: statusCode === 500 ? "Помилка транзакції БД" : error.message
        });
    }
};

module.exports = {
    createOrder
};