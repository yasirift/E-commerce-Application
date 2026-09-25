interface SkeletonGridProps {
  count?: number;
}

export function ProductCardSkelton() {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 h-36 w-full animate-pulse rounded bg-gray-200" />
      <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="mb-2 h-3 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="mb-3 h-5 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="mt-auto h-9 w-full animate-pulse rounded-md bg-gray-200" />
    </div>
  );
}

export default function ProductGridSkeleton({ count = 8 }: SkeletonGridProps) {
  return (
    <div className="mt-8 mb-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkelton key={i} />
      ))}
    </div>
  );
}
