import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../components/Toast";
import {
  updateProduct,
  selectMutationStatus,
  selectMutationError,
} from "../../features/products/productSlice";
import ProductForm, { toDefaults } from "./ProductForm";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import type { Product } from "../../types";
import type { ProductFormValues } from "../../schemas/productSchema";

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: product, loading, error, refetch } = useFetch<Product>(
    id ? `/products/${id}` : null,
  );
  const mutationStatus = useAppSelector(selectMutationStatus);
  const mutationError = useAppSelector(selectMutationError);

  async function handleSubmit(values: ProductFormValues) {
    if (!id) return;
    const result = await dispatch(updateProduct({ id: Number(id), values }));
    if (updateProduct.fulfilled.match(result)) {
      showToast(`"${values.title}" updated`, "success");
      navigate("/admin/products");
    }
  }

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-blue-600 hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-semibold text-gray-900">Edit Product</h1>

      {loading && <Loader size="lg" label="Loading product..." />}

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {product && (
        <ProductForm
          key={product.id}
          defaultValues={toDefaults(product)}
          onSubmit={handleSubmit}
          submitting={mutationStatus === "loading"}
          submitLabel="Save Changes"
          serverError={mutationError}
        />
      )}
    </div>
  );
}
