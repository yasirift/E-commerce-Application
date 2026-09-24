import ProductCard from "./ProductCard";
import StatusMessage from "./StatusMessage";
import type { Product } from "../../types/index";

interface productGridProps {
  products: Product[];
}

function ProductGrid({ products }: productGridProps) {
  if (products.length === 0) {
    return (
      <StatusMessage type="empty" message="No products match your filter" />
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-8 mb-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
