import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import PrintCustomizer from "../Components/PrintForm";
import ProductImageCarousel from "../Components/ProductImageCarousel";

const IndividualProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, updateQuantity, cart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(null);
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
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

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

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  const getCartQuantity = (variantId) => {
    const item = cart.find((i) => i.variantId === variantId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="product-page">
      {user && user.is_admin === 1 && (
        <button className="delete-btn" onClick={handleDelete}>
          Delete Product
        </button>
      )}

      <div className="product-layout">
        {/* LEFT: Images */}
        <ProductImageCarousel product={product} />

        {/* RIGHT: Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          {/* Customizer */}
          <PrintCustomizer
            product={product}
            variants={product.variants}
            cart={cart}
            updateCartQuantity={updateQuantity}
            addToCart={addToCart}
            setSelectedVariant={setSelectedVariant}
          />

          {/* Price */}
          {selectedVariant && (
            <div className="product-price">${selectedVariant.price}</div>
          )}

          {/* Add to Cart */}
          {selectedVariant && (
            <button
              className="amazon-cart-btn"
              onClick={() =>
                addToCart({
                  productId: product.id,
                  variantId: selectedVariant.id,
                  price: selectedVariant.price,
                  name: product.name,
                  size: selectedVariant.size,
                  paper_type: selectedVariant.paper_type,
                  quantity: 1,
                  image_url: product.image_url,
                })
              }
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualProduct;
