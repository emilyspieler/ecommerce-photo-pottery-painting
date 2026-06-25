import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const SuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="success-page">
      <div className="success-inner">
        <p className="success-eyebrow">Order Confirmed</p>
        <h1 className="success-title">Thank you for your purchase.</h1>
        <p className="success-body">
          You'll receive an email confirmation shortly. Each piece is carefully
          packaged and shipped with care.
        </p>
        <Link to="/" className="success-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
