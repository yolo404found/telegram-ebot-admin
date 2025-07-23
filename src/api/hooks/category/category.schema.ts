import { z } from 'zod';

export const categoryBaseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

export const categoryCreateSchema = categoryBaseSchema;
export const categoryUpdateSchema = categoryBaseSchema.extend({
  id: z.number(),
});

export type CategoryBase = z.infer<typeof categoryBaseSchema>;
export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
export type CategoryFormValues = z.infer<typeof categoryBaseSchema>;