const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

exports.createCheckoutSession = async (req, res) => {
  const { cart, guestEmail } = req.body;
  const userId = req.user ? req.user.id : null;

  if (!cart || !Array.isArray(cart) || cart.length === 0)
    return res.status(400).json({ error: "Cart is empty" });

  try {
    const lineItems = [];

    for (const item of cart) {
      const results = await new Promise((resolve, reject) => {
        if (item.variantId) {
          connection.query(
            `SELECT v.id AS variantId, v.size, v.paper_type, v.price, p.name AS productName
             FROM product_variants v
             JOIN products p ON v.product_id = p.id
             WHERE v.id = ? AND v.product_id = ?`,
            [item.variantId, item.productId],
            (err, results) => (err ? reject(err) : resolve(results))
          );
        } else {
          connection.query(
            `SELECT id AS variantId, base_price AS price, name AS productName
             FROM products WHERE id = ?`,
            [item.productId],
            (err, results) => (err ? reject(err) : resolve(results))
          );
        }
      });

      if (!results?.length) continue;

      const variant = results[0];
      const title =
        variant.size && variant.paper_type && variant.size !== "Original"
          ? `${variant.productName} - ${variant.size} / ${variant.paper_type}`
          : variant.productName;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: title },
          unit_amount: Math.round(parseFloat(variant.price) * 100),
        },
        quantity: item.quantity || 1,
      });
    }

    if (lineItems.length === 0)
      return res.status(400).json({ error: "No valid items in cart" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: userId ? undefined : guestEmail,
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}/cancel`,
      shipping_address_collection: { allowed_countries: ["US"] },
      automatic_tax: { enabled: true },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

exports.webhook = (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const productId = session.metadata.productId;
    const userId = session.metadata.userId !== "guest" ? session.metadata.userId : null;

    connection.query(
      "SELECT id FROM orders WHERE stripe_session_id = ?",
      [session.id],
      (err, existing) => {
        if (existing?.length > 0) return res.json({ received: true });

        connection.query(
          "INSERT INTO orders (stripe_session_id, user_id, email, product_id, amount) VALUES (?, ?, ?, ?, ?)",
          [session.id, userId, session.customer_details?.email, productId, session.amount_total],
          (err) => {
            if (err) return res.status(500).end();
            connection.query(
              "UPDATE products SET is_sold = TRUE WHERE id = ?",
              [productId],
              (err) => { if (err) console.error("Failed to mark product sold:", err); }
            );
          }
        );
      }
    );
  }

  res.json({ received: true });
};