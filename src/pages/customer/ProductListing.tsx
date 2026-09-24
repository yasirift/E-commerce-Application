import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { usePagination } from "../../hooks/usePagination";
import {
  fetchProducts,
  fetchCategories,
  selectProducts,
  selectProductsStatus,
  selectProductsError,
  selectTotal,
  selectSearch,
  selectCategory,
  selectSort,
} from "../../features/products/productSlice";
import SearchFilters from "../../components/products/SearchFilters";
import ProductGrid from "../../components/products/ProductGrid";
import ProductGridSkeleton from "../../components/products/Skeleton";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Pagination from "../../components/ui/Pagination";

interface PriceRange {
  min: string;
  max: string;
}

export default function ProductListing() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const total = useAppSelector(selectTotal);
  const search = useAppSelector(selectSearch);
  const category = useAppSelector(selectCategory);
  const sort = useAppSelector(selectSort);

  const { page, pageSize, setPage, setPageSize } = usePagination({
    initialPageSize: 12,
  });

  const [priceRange, setPriceRange] = useState<PriceRange>({ min: "", max: "" });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: pageSize }));
  }, [dispatch, page, pageSize, search, category, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const filteredItems = useMemo(() => {
    const min = priceRange.min ? Number(priceRange.min) : null;
    const max = priceRange.max ? Number(priceRange.max) : null;
    if (min === null && max === null) return items;

    return items.filter((p) => {
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      return true;
    });
  }, [items, priceRange]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Products</h1>

      <SearchFilters priceRange={priceRange} onPriceRangeChange={setPriceRange} />

      {status === "loading" && <ProductGridSkeleton count={pageSize} />}

      {status === "failed" && (
        <ErrorMessage
          message={error || "Failed to load products."}
          onRetry={() => dispatch(fetchProducts({ page, limit: pageSize }))}
        />
      )}

      {status === "succeeded" && <ProductGrid products={filteredItems} />}

      {status === "succeeded" && total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[8, 12, 20, 40]}
        />
      )}
    </div>
  );
}
