function generatePhotoVariants(product) {
  const sizes = ["8x10", "11x14", "16x20"];
  const paperTypes = ["Matte", "Glossy"];
  const variants = [];

  for (const size of sizes) {
    for (const paper of paperTypes) {
      let price = product.base_price;
      if (size === "11x14") price += 10;
      if (size === "16x20") price += 20;
      variants.push([product.id, size, paper, price]);
    }
  }
  return variants;
}

function generatePaintingVariants(product) {
  return [
    [product.id, "Original", "Original", product.base_price],
    ...generatePhotoVariants(product),
  ];
}

module.exports = { generatePhotoVariants, generatePaintingVariants };
