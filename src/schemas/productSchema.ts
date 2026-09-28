import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  discountPercentage: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .default(0),
  thumbnail: z.string().url("Please enter a valid image URL"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
