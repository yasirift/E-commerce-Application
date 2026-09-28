import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../components/Toast";
import {
  fetchAdminProducts,
  deleteProduct,
  selectAdminProducts,
  selectAdminTotal,
  selectAdminStatus,
  selectAdminError,
} from "../../features/products/productSlice";
import Table from "../../components/ui/Table";
import type { TableColumn } from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";
import Badge from "../../components/Badge";
import ErrorMessage from "../../components/ui/ErrorMessage";
import type { Product } from "../../types";

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const items = useAppSelector(selectAdminProducts);
  const total = useAppSelector(selectAdminTotal);
  const status = useAppSelector(selectAdminStatus);
  const error = useAppSelector(selectAdminError);

  const { page, pageSize, setPage, setPageSize } = usePagination({
    initialPageSize: 10,
  });
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts({ page, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await dispatch(deleteProduct(pendingDelete.id));
    setDeleting(false);
    setPendingDelete(null);

    if (deleteProduct.fulfilled.match(result)) {
      showToast(`Deleted "${pendingDelete.title}"`, "success");
    } else {
      showToast(result.payload ?? "Failed to delete product.", "error");
    }
  }

  const columns: TableColumn<Product>[] = [
    {
      key: "title",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.thumbnail} alt="" className="h-9 w-9 rounded object-contain" />
          <span className="line-clamp-1">{p.title}</span>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (p) => `$${p.price.toFixed(2)}`,
    },
    {
      key: "stock",
      header: "Stock",
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge variant={p.stock > 0 ? "success" : "danger"}>
          {p.stock > 0 ? "Active" : "Out"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/products/${p.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={() => setPendingDelete(p)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link to="/admin/products/add">
          <Button>
            <Plus size={16} className="mr-1.5 inline" />
            Add Product
          </Button>
        </Link>
      </div>

      {status === "failed" && (
        <ErrorMessage
          message={error || "Failed to load products."}
          onRetry={() => dispatch(fetchAdminProducts({ page, limit: pageSize }))}
        />
      )}

      {status !== "failed" && (
        <>
          <Table
            columns={columns}
            data={items}
            keyExtractor={(p) => p.id}
            emptyState={
              <p className="p-6 text-center text-sm text-gray-400">
                {status === "loading" ? "Loading products..." : "No products found."}
              </p>
            }
          />

          {total > 0 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 20, 50]}
            />
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!pendingDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${pendingDelete?.title}"? This can't be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
