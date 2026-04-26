import { useState, useEffect } from "react";

export default function PrintCustomizer({
  product,
  variants = [],
  cart,
  updateCartQuantity,
  addToCart,
}) {
  const hasVariants = variants.length > 0;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");

  // Initialize selections
  useEffect(() => {
    if (hasVariants) {
      setSelectedSize(variants[0].size);
      setSelectedPaper(variants[0].paper_type);
    }
  }, [variants]);

  const selectedVariant = hasVariants
    ? variants.find(
        (v) => v.size === selectedSize && v.paper_type === selectedPaper,
      )
    : null;

  // Cart item matching the selected variant or original
  const cartItem = hasVariants
    ? cart.find((item) => item.variantId === selectedVariant?.id)
    : cart.find((item) => item.productId === product.id && !hasVariants);

  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) return;

    addToCart({
      productId: product.id,
      variantId: hasVariants ? selectedVariant.id : null,
      name: product.name,
      image_url: product.image_url,
      price: hasVariants
        ? selectedVariant.price
        : parseFloat(product.base_price),
      size: hasVariants ? selectedVariant.size : null,
      paper_type: hasVariants ? selectedVariant.paper_type : null,
      quantity: 1,
    });
  };

  const basePrice = hasVariants
    ? parseFloat(selectedVariant?.price || 0)
    : parseFloat(product.base_price);

  const artType = product.art_type.trim().toLowerCase();

  // Determine if this selection should limit quantity to 1
  const isOriginalSelected =
    artType === "pottery" ||
    (artType === "painting" && selectedSize.toLowerCase() === "original");

  // Unique dropdown options
  const sizes = [...new Set(variants.map((v) => v.size))];
  const papers = [
    ...new Set(
      variants.filter((v) => v.size === selectedSize).map((v) => v.paper_type),
    ),
  ];

  // Keep paper selection in sync with size
  useEffect(() => {
    if (papers.length > 0) {
      setSelectedPaper(papers[0]);
    }
  }, [selectedSize]);

  return (
    <div className="print-customizer">
      <h2>{hasVariants ? "Customize Your Print" : "Original Artwork"}</h2>

      {/* Variant dropdowns if variants exist */}
      {hasVariants && (
        <>
          <div>
            <label>
              Size:
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Paper:
              <select
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
              >
                {papers.map((paper) => (
                  <option key={paper} value={paper}>
                    {paper}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}

      {/* Cart / Add to Cart */}
      <div className="cart-section">
        <p className="subtotal">Price: ${basePrice.toFixed(2)}</p>

        <button
          className="amazon-cart-btn"
          onClick={quantity === 0 ? handleAddToCart : undefined}
        >
          {quantity === 0 || isOriginalSelected ? (
            "Add to Cart"
          ) : (
            <div className="qty-controls">
              <span
                className="qty-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(selectedVariant.id, quantity - 1);
                }}
              >
                −
              </span>

              <span className="qty-number">{quantity}</span>

              <span
                className="qty-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(selectedVariant.id, quantity + 1);
                }}
              >
                +
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
