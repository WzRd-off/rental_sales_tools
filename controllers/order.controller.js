const db = require('../database/db_manager');


exports.createOrder = async (req, res) => {
    const { userId, prodId, type, startDate, endDate } = req.body;

    try {
        await db._run("BEGIN TRANSACTION");

        const product = await db._get("SELECT * FROM products WHERE prod_id = ?", [prodId]);
        if (!product) throw new Error("Товар не знайдено");

        let totalPrice = 0;

        if (type === 'sell') {
            totalPrice = product.cost;
            await db._run(
                "INSERT INTO history_purchases (prod_id, user_id, total_price) VALUES (?, ?, ?)",
                [prodId, userId, totalPrice]
            );
        } else if (type === 'rent') {
            if (!startDate || !endDate) throw new Error("Не вказано дати оренди");

            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            
            if (days <= 0) throw new Error("Некоректний період оренди");

            totalPrice = days * product.cost; 
            await db._run(
                "INSERT INTO history_rentals (prod_id, user_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)",
                [prodId, userId, startDate, endDate, totalPrice]
            );
        }

        await db._run(
            "UPDATE products SET count_of_bought = count_of_bought + 1 WHERE prod_id = ?",
            [prodId]
        );

        await db._run("COMMIT");

        res.status(200).json({
            success: true,
            message: "Замовлення оформлено",
            totalPrice: totalPrice
        });

    } catch (error) {
        await db._run("ROLLBACK");
        res.status(500).json({
            success: false,
            message: "Помилка транзакції: " + error.message
        });
    }
};