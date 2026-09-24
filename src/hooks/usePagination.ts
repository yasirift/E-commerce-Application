import { useCallback, useState } from "react";

interface usePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 20,
}: usePaginationProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const skip = (page - 1) * pageSize;
  return { page, pageSize, setPage, setPageSize, skip };
}
