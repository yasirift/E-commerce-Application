import { memo } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    console.warn("Add to cart in next phase");
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-shadow hover:shadow-xl">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="mb-2 h-36 w-full object-contain"
        />
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
          {product.title}
        </h3>
      </Link>
      <p className="mb-1 text-xs text-gray-500">{product.category}</p>
      <p className="mb-1 text-lg font-bold text-blue-600">
        ${product.price.toFixed(2)}
      </p>
      <p className="mb-3 text-xs text-gray-500">
        {outOfStock ? "Out of Stock" : `${product.stock} in stock`}
        {" · "}⭐ {product.rating.toFixed(1)}
      </p>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className={`mt-auto rounded-md px-3 py-2 text-sm font-medium text-white transition-colors ${
          outOfStock
            ? "cursor-not-allowed bg-gray-300"
            : "cursor-pointer bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {outOfStock ? "Unavailable" : "Add to Cart"}
      </button>
    </div>
  );
}

export default memo(ProductCard);
