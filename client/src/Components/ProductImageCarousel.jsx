import { useState } from "react";

export default function ProductImageCarousel({ product }) {
  const images = [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null; // no images

  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="product-image-carousel">
      <img
        className="carousel-image"
        src={images[currentIndex]}
        alt={`${product.name} image ${currentIndex + 1}`}
      />

      {images.length > 1 && (
        <>
          <button className="carousel-arrow left" onClick={prevImage}>
            &#8592;
          </button>
          <button className="carousel-arrow right" onClick={nextImage}>
            &#8594;
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}