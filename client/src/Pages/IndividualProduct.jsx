import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import PrintCustomizer from "../Components/PrintForm";
import ProductImageCarousel from "../Components/ProductImageCarousel";

const artTypeLabel = (type) => {
  const t = type.trim().toLowerCase();
  if (t === "pottery") return "One-of-a-kind · Handmade Ceramic";
  if (t === "painting") return "Original Painting";
  return "Photographic Print";
};

const IndividualProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, updateQuantity, removeFromCart, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      alert("Product deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p style={{ padding: "80px 48px" }}>Loading…</p>;
  if (error) return <p style={{ padding: "80px 48px" }}>Error: {error}</p>;
  if (!product) return <p style={{ padding: "80px 48px" }}>No product found.</p>;

  return (
    <div className="product-page">
      {user?.is_admin === 1 && (
        <button className="admin-delete-btn" onClick={handleDelete}>
          Delete Product
        </button>
      )}

      <div className="product-layout">

        <div className="product-image-panel">
          <ProductImageCarousel product={product} />
        </div>

        <div className="product-info-panel">
          <div className="product-info-inner">

            <span className="product-art-label">
              {artTypeLabel(product.art_type)}
            </span>

            <h1 className="product-title">{product.name}</h1>

            <p className="product-description">{product.description}</p>

            <div className="product-rule" />

            <PrintCustomizer
              product={product}
              variants={product.variants}
              cart={cart}
              updateCartQuantity={updateQuantity}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualProduct;
