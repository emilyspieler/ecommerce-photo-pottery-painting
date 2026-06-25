import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { addToCart, addedItems } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pottery = products.filter((p) => p.art_type === "pottery");
  const painting = products.filter((p) => p.art_type === "painting");
  const prints = products.filter((p) => p.art_type === "photographic print");

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const isInCart = (id) => addedItems.has(id);

  if (loading) return <p className="loading-state">Loading products...</p>;
  if (error) return <p className="loading-state">Error: {error}</p>;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          credentials: "include", // send cookies
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      // Remove product from state so UI updates immediately
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const openFullProductSuite = (product) => {
    return navigate(`/products/${product}`);
  };

  const renderCard = (product) => (
    <div
      key={product.id}
      onClick={() => openFullProductSuite(product.id)}
      style={{ cursor: "pointer" }}
    >
      {user && user.is_admin === 1 && (
        <button onClick={() => handleDelete(product.id)}>Delete</button>
      )}
      <div className="product-card">
        <div className="">
          <div className="product-image-wrapper">
            <img src={product.image_url} alt={product.name} />
          </div>

          <div className="display-flex">
            <div>
              <div className="title">{product.name}</div>
            </div>
            <div className="price">${parseFloat(product.base_price).toFixed(2)}</div>
          </div>

          {/* {!isInCart(product.id) && (
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          )} */}
          {/* 
          {isInCart(product.id) && <h2 className="added-label">✔ In Cart</h2>} */}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* HERO BANNER */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Hi, I am Emily and this is my art.</h1>
          <p className="hero-subtitle">
            Buy or browse, I'm just glad you are here.
          </p>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <section className="category-section">
        <h2 className="category-title">Browse by Category</h2>

        <div className="category-circles">
          <div
            onClick={() => scrollToSection("pottery")}
            className="category-circle"
          >
            <div className="circle-img pottery-img" />
            <span>Pottery</span>
          </div>

          <div
            onClick={() => scrollToSection("painting")}
            className="category-circle"
          >
            <div className="circle-img painting-img" />
            <span>Painting</span>
          </div>

          <div
            onClick={() => scrollToSection("print")}
            className="category-circle"
          >
            <div className="circle-img print-img" />
            <span>Photographic Print</span>
          </div>
        </div>
      </section>

      <div className="page-content">
        {/* POTTERY */}
        <section id="pottery">
          <h2 className="category-heading">POTTERY</h2>
          <div className="grid">
            {pottery.map((product) => renderCard(product))}
          </div>
        </section>

        {/* PAINTINGS */}
        <section id="painting">
          <h2 className="category-heading">PAINTINGS</h2>
          <div className="grid">
            {painting.map((product) => renderCard(product))}
          </div>
        </section>

        {/* PRINTS */}
        <section id="print">
          <h2 className="category-heading">PHOTOGRAPHIC PRINTS</h2>
          <div className="grid">
            {prints.map((product) => renderCard(product))}
          </div>
        </section>
      </div>

      {/* PRODUCT SECTION
      <div className="page-content">
        <div className="margin-bottom">
          <h2>All Artwork</h2>
        </div>

        <div className="grid">
          {products.map((product) => (
            <div key={product.id}>
              <div className="product-card">
                <div className="">
                  <div className="product-image-wrapper">
                    <img src={product.image_url} alt={product.name} />
                  </div>

                  <div className="display-flex">
                    <div>
                      <div className="title">{product.name}</div>
                      <div className="subtitle">{product.description}</div>
                    </div>

                    <div className="price">${product.price}</div>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    {isInCart(product.id) ? "Add Another" : "Add to Cart"}
                  </button>

                  {isInCart(product.id) && (
                    <div className="added-label">✔ In Cart</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};

export default HomePage;
