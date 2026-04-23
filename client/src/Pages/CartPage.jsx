import { useCart } from "../Context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
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
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Failed to create session"));
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage("Order canceled — continue shopping.");
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );

  if (message) {
    return <div className="page-wrapper-cart">{message}</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="page-wrapper-cart no-items-cart">
        <p>Your cart is empty.&nbsp;
        <a href="/">Click Here</a> to continue shopping.
        </p>
      </div>
    );
  }

  return (
    <div className="page-wrapper-cart">
      <div className="page-container-cart">
        {cart.map((item) => (
          <div key={item.variantId || item.id} className="cart-item">
            <div className="cart-item-inner">
              
              {/* IMAGE */}
              <div
                className="cart-image"
                onClick={() =>
                  navigate(`/products/${item.productId}?variant=${item.variantId}`)
                }
              >
                <img src={item.image_url} alt={item.name} />
              </div>

              {/* DETAILS */}
              <div className="cart-details">
                <div className="cart-header">
                  <div>
                    <h3 className="cart-title">{item.name}</h3>
                    {item.size && item.paper_size && <div className="cart-meta">
                      {item.size} · {item.paper_type}
                    </div>}
                  </div>

                  <div className="cart-side">
                    <div className="cart-price">
                      ${parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                <p className="cart-description">{item.description}</p>

                <div className="remove-button-container">
                  <div className="cart-qty">
                      <button
                        className="qty-btn-cart"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        className="qty-btn-cart"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  <button
                    className="remove-link"
                    onClick={() => removeFromCart(item.variantId)}
                  >
                    Remove item
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="cart-summary">
          <div className="summary-row total-row">
            <span>Estimated Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;