import { useEffect, useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useDebounce } from "../hooks/useDebounce";
import {
  setSearch,
  setCategory,
  setSort,
  selectCategories,
  selectCategory,
  selectSearch,
  selectSort,
  type SortOption,
} from "../features/products/productSlice";

interface PriceRange {
  min: string;
  max: string;
}

interface SearchFiltersProps {
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating-desc", label: "Rating: High → Low" },
];

export default function SearchFilters({
  priceRange,
  onPriceRangeChange,
}: SearchFiltersProps) {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const category = useAppSelector(selectCategory);
  const sort = useAppSelector(selectSort);
  const categories = useAppSelector(selectCategories);

  const [searchDraft, setSearchDraft] = useState(search);
  const debouncedSearch = useDebounce(searchDraft, 400);

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      dispatch(setSearch(debouncedSearch));
    }
  }, [debouncedSearch, dispatch, search]);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchDraft(e.target.value);
  }
  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    dispatch(setCategory(e.target.value));
  }
  function handleSortChange(e: ChangeEvent<HTMLSelectElement>) {
    dispatch(setSort(e.target.value as SortOption));
  }

  return (
    <div className="mb-5 flex flex-wrap items-end gap-3">
      <input
        type="text"
        placeholder="Search products..."
        value={searchDraft}
        onChange={handleSearchChange}
        className="min-w-50 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />

      <select
        value={category}
        onChange={handleCategoryChange}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="All">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          placeholder="Min $"
          value={priceRange.min}
          onChange={(e) =>
            onPriceRangeChange({ ...priceRange, min: e.target.value })
          }
          className="w-24 rounded-md border border-gray-300 px-2 py-2 text-sm"
        />
        <span className="text-sm text-gray-400">–</span>
        <input
          type="number"
          min={0}
          placeholder="Max $"
          value={priceRange.max}
          onChange={(e) =>
            onPriceRangeChange({ ...priceRange, max: e.target.value })
          }
          className="w-24 rounded-md border border-gray-300 px-2 py-2 text-sm"
        />
      </div>

      <select
        value={sort}
        onChange={handleSortChange}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
