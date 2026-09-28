import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useToast } from "../../components/Toast";
import {
  addProduct,
  selectMutationStatus,
  selectMutationError,
} from "../../features/products/productSlice";
import ProductForm from "./ProductForm";
import type { ProductFormValues } from "../../schemas/productSchema";

export default function AdminProductAdd() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const status = useAppSelector(selectMutationStatus);
  const error = useAppSelector(selectMutationError);

  async function handleSubmit(values: ProductFormValues) {
    const result = await dispatch(addProduct(values));
    if (addProduct.fulfilled.match(result)) {
      showToast(`"${values.title}" added`, "success");
      navigate("/admin/products");
    }
  }

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-blue-600 hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-semibold text-gray-900">Add Product</h1>

      <ProductForm
        onSubmit={handleSubmit}
        submitting={status === "loading"}
        submitLabel="Add Product"
        serverError={error}
      />
    </div>
  );
}
