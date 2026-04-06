const connection = require("../config/db");

exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, variantId } = req.body;

  connection.query(
    "SELECT price FROM product_variants WHERE id = ? AND product_id = ?",
    [variantId, productId],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(400).json({ error: "Invalid variant" });

      const price = results[0].price;
      connection.query(
        "INSERT INTO cart_items (user_id, product_variant_id, quantity, price_at_purchase) VALUES (?, ?, 1, ?)",
        [userId, variantId, price],
        (err) => {
          if (err) return res.status(500).json({ error: "Cart insert failed" });
          res.json({ success: true });
        }
      );
    }
  );
};