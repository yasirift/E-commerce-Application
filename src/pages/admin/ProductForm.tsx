import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "../../schemas/productSchema";
import Input from "../../components/ui/InputField";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import type { Product } from "../../types";

const CATEGORY_OPTIONS = [
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
].map((c) => ({ label: c, value: c }));

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  submitting: boolean;
  submitLabel: string;
  serverError?: string | null;
}

function toDefaults(product?: Partial<Product>): Partial<ProductFormValues> {
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    category: product.category,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    discountPercentage: product.discountPercentage,
    thumbnail: product.thumbnail,
  };
}

export { toDefaults };

export default function ProductForm({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel,
  serverError,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <Input label="Title" error={errors.title?.message} {...register("title")} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          placeholder="Select category"
          error={errors.category?.message}
          {...register("category")}
        />
        <Input label="Brand" error={errors.brand?.message} {...register("brand")} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          label="Stock"
          type="number"
          error={errors.stock?.message}
          {...register("stock")}
        />
        <Input
          label="Discount %"
          type="number"
          error={errors.discountPercentage?.message}
          {...register("discountPercentage")}
        />
      </div>

      <Input
        label="Thumbnail URL"
        error={errors.thumbnail?.message}
        {...register("thumbnail")}
      />

      {serverError && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
