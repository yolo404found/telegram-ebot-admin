import { z } from 'zod';

// Base schema without ID
export const productBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().positive('Stock must be positive'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  category_id: z.number().positive('Category ID must be positive'),
  category:z.object().optional(),
});

// Update schema extends base with required ID
export const updateProductSchema = productBaseSchema.extend({
  id: z.number().positive('ID must be positive'),
});

// Type definitions
export type ProductFormBase = z.infer<typeof productBaseSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;

// Combined type for form values
export type ProductFormValues = ProductFormBase & { id?: number };

// Type guard for update operations
export function isUpdateProduct(values: ProductFormValues): values is UpdateProductDto {
  return values.id !== undefined;
}