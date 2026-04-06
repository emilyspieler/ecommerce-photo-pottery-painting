import { useCart } from "../Context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart }),
        },
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Failed to create session"));
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled — continue to shop around and checkout when you're ready.",
      );
    }
  }, []);

  if (message) {
    return (
      <section className="page-wrapper-cart">
        <div className="page-container-cart">
          <p>{message}</p>
        </div>
      </section>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0,
  );

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="page-container">
          <h2>Your cart is empty.</h2>
          <p>
            Browse our collections <a href="/">here</a>
          </p>
        </div>
      </div>
    );
  }

  console.log(cart);

  return (
    <div className="page-wrapper-cart">
      <div className="page-container-cart">
        <section>
          {cart.map((item) => (
            <div
              key={item.variantId || item.id}
              className="cart-item clickable"
              onClick={() =>
                navigate(
                  `/products/${item.productId}?variant=${item.variantId || ""}`,
                )
              }
            >
              <div className="cart-item-inner">
                <div className="cart-image">
                  <img src={item.image_url} alt={item.name} />
                </div>

                <div className="cart-details">
                  <div className="cart-header">
                    <div>
                      <h2>{item.name}</h2>
                      <p className="grey subtitle">{item.size}</p>
                      <p className="grey subtitle">{item.paper_type}</p>
                    </div>
                    <span className="cart-price">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                    <span>x {item.quantity || 1}</span>
                  </div>

                  <p className="cart-description">{item.description}</p>

                  <button
                    className="remove-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.variantId);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <div className="cart-summary">
              <div className="summary-row total-row">
                <span>Estimated Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CartPage;
