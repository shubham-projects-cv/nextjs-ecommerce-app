import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be >= 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock must be >= 0"),
});

export const productUpdateSchema = productCreateSchema.partial();

// Types
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
