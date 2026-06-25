import { useState, useEffect } from "react";

export default function PrintCustomizer({
  product,
  variants = [],
  cart,
  updateCartQuantity,
  addToCart,
  removeFromCart,
}) {
  const hasVariants = variants.length > 0;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");

  useEffect(() => {
    if (hasVariants) {
      setSelectedSize(variants[0].size);
      setSelectedPaper(variants[0].paper_type);
    }
  }, [variants, hasVariants]);

  const selectedVariant = hasVariants
    ? variants.find((v) => v.size === selectedSize && v.paper_type === selectedPaper)
    : null;

  const cartItem = hasVariants
    ? cart.find((item) => item.variantId === selectedVariant?.id)
    : cart.find((item) => item.productId === product.id && !hasVariants);

  const quantity = cartItem?.quantity || 0;

  const basePrice = hasVariants
    ? parseFloat(selectedVariant?.price || 0)
    : parseFloat(product.base_price);

  const artType = product.art_type.trim().toLowerCase();

  const isOriginalSelected = artType === "pottery" || artType === "painting";

  const sizes = [...new Set(variants.map((v) => v.size))];
  const papers = [
    ...new Set(
      variants.filter((v) => v.size === selectedSize).map((v) => v.paper_type)
    ),
  ];

  useEffect(() => {
    if (papers.length > 0) setSelectedPaper(papers[0]);
  }, [selectedSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) return;
    addToCart({
      productId: product.id,
      variantId: hasVariants ? selectedVariant.id : null,
      name: product.name,
      image_url: product.image_url,
      price: hasVariants ? selectedVariant.price : parseFloat(product.base_price),
      size: hasVariants ? selectedVariant.size : null,
      paper_type: hasVariants ? selectedVariant.paper_type : null,
      quantity: 1,
      isOriginal: isOriginalSelected,
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(cartItem?.variantId);
  };

  return (
    <div className="product-purchase">

      {/* Variant selects — prints only */}
      {hasVariants && (
        <div className="product-options">
          <div className="product-option">
            <label className="option-label">Size</label>
            <select
              className="option-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="product-option">
            <label className="option-label">Paper</label>
            <select
              className="option-select"
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
            >
              {papers.map((paper) => (
                <option key={paper} value={paper}>{paper}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="product-price-display">
        ${basePrice.toFixed(2)}
      </div>

      {/* CTA */}
      {isOriginalSelected ? (
        quantity === 0 ? (
          <button className="product-cta-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        ) : (
          <button className="product-cta-btn product-cta-btn--remove" onClick={handleRemoveFromCart}>
            Remove from Cart
          </button>
        )
      ) : (
        <button
          className="product-cta-btn"
          onClick={quantity === 0 ? handleAddToCart : undefined}
        >
          {quantity === 0 ? (
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
      )}
      <p className="product-disclaimer">
        Prices do not include tax and shipping. All prints and paintings are sold without frames unless otherwise noted.
      </p>

    </div>
  );
}
