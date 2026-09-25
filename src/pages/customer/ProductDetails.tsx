import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useCart } from "../../hooks/useCart";
import ErrorMessage from "../../components/ui/ErrorMessage";
import type { Product } from "../../types";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    loading,
    error,
    refetch,
  } = useFetch<Product>(id ? `/products/${id}` : null);
  const { add } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-80 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <ErrorMessage
          message={error || "Product not found."}
          onRetry={refetch}
        />
      </div>
    );
  }

  const outOfStock = product.stock === 0;
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  function handleAddToCart() {
    if (!product) return;
    add(product, quantity);
  }

  function handleBuyNow() {
    if (!product) return;
    add(product, quantity);
    navigate("/checkout");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/products" className="text-sm text-blue-600 hover:underline">
        ← Back to products
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.images[activeImage] ?? product.thumbnail}
            alt={product.title}
            className="h-80 w-full rounded-lg border border-gray-200 object-contain"
          />
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded border ${
                    i === activeImage ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {product.category}
            {product.brand ? ` · ${product.brand}` : ""}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            {product.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            ⭐ {product.rating.toFixed(1)}
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-green-600">
                  -{product.discountPercentage.toFixed(0)}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          <p className="mt-3 text-sm text-gray-500">
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-700">Quantity</span>
            <div className="flex items-center rounded-md border border-gray-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                aria-label="Increase quantity"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="flex-1 rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
