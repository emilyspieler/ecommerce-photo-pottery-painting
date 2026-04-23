import { useState } from "react";

export default function ProductImageCarousel({ product }) {
  const images = [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="carousel">
      <div className="carousel-main">
        <img
          className="carousel-main-image"
          src={images[currentIndex]}
          alt={`${product.name} ${currentIndex + 1}`}
        />
      </div>

      {images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`carousel-thumb ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={img} alt={`${product.name} view ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}