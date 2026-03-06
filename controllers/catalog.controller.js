const DBManager = require('../database/db_manager');
const db = new DBManager();

exports.getProducts = async (req, res) => {
    try {
        const { category, minCost, maxCost, status, search } = req.query;

        let sql = "SELECT * FROM products WHERE 1=1";
        let params = [];

        if (search) {
            sql += " AND name LIKE ?";
            params.push(`%${search}%`); 
        }

      
        if (category && category !== 'all') {
            sql += " AND category LIKE ?";
            params.push(`%${category}%`);
        }

   
        if (minCost) {
            sql += " AND cost >= ?";
            params.push(Number(minCost));
        }
        if (maxCost) {
            sql += " AND cost <= ?";
            params.push(Number(maxCost));
        }

      
        if (status && status !== 'all') {
            if (status === 'rent' || status === 'sell') {
                sql += " AND status = ?";
                params.push(status);
            }
        }

        const products = await db._all(sql, params);

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ошибка фильтрации",
            error: error.message
        });
    }
};