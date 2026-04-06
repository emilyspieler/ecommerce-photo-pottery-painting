const connection = require("../config/db");
const fs = require("fs");
const path = require("path");
const { uploadDir } = require("../utils/uploads");
const { generatePhotoVariants } = require("../utils/variants");

exports.createProduct = (req, res) => {
  const { name, price, description, art_type } = req.body;
  const files = req.files;

  if (!name || !price || !description || !art_type || !files?.image) {
    return res.status(400).json({
      error: "Name, price, description, art type, and main image are required",
    });
  }

  const image_url = `/uploads/${files.image[0].filename}`;
  const image_url_2 = files.image_2 ? `/uploads/${files.image_2[0].filename}` : null;
  const image_url_3 = files.image_3 ? `/uploads/${files.image_3[0].filename}` : null;

  const insertProductSql = `
    INSERT INTO products (name, base_price, description, image_url, image_url_2, image_url_3, art_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    insertProductSql,
    [name, price, description, image_url, image_url_2, image_url_3, art_type],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Failed to add product" });
      }

      const productId = result.insertId;
      const normalizedType = art_type.trim().toLowerCase();

      if (normalizedType === "photographic print") {
        const variantsToInsert = generatePhotoVariants({ id: productId, base_price: parseFloat(price) });

        connection.query(
          "INSERT INTO product_variants (product_id, size, paper_type, price) VALUES ?",
          [variantsToInsert],
          (variantErr) => {
            if (variantErr) {
              console.error("Variant insert error:", variantErr);
              return res.status(500).json({ error: "Product created but failed to create variants" });
            }
            return res.json({ success: true });
          }
        );
      } else {
        res.json({ success: true });
      }
    }
  );
};

exports.getProducts = (req, res) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
    res.status(200).json(results);
  });
};

exports.getProduct = (req, res) => {
  const productId = Number(req.params.id);
  if (isNaN(productId)) return res.status(400).json({ error: "Invalid product ID" });

  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, productResults) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (productResults.length === 0) return res.status(404).json({ error: "Product not found" });

      const product = productResults[0];

      connection.query(
        "SELECT id, size, paper_type, price FROM product_variants WHERE product_id = ?",
        [productId],
        (err, variantResults) => {
          if (err) return res.status(500).json({ error: "DB error" });

          res.json({
            ...product,
            variants: variantResults,
            images: [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean),
          });
        }
      );
    }
  );
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  connection.query(
    "SELECT image_url, image_url_2, image_url_3 FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to fetch product" });
      if (results.length === 0) return res.status(404).json({ error: "Product not found" });

      const { image_url, image_url_2, image_url_3 } = results[0];

      connection.query("DELETE FROM products WHERE id = ?", [productId], (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete product" });

        [image_url, image_url_2, image_url_3].forEach((img) => {
          if (img) fs.unlink(path.join(uploadDir, path.basename(img)), () => {});
        });

        res.status(200).json({ success: "Product and images deleted successfully" });
      });
    }
  );
};