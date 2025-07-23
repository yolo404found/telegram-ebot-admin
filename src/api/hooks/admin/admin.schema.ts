import { z } from 'zod';

// Base schema for validation
export const adminBaseSchema = z.object({
  id:z.number().optional(),
  phone: z.string().min(6, 'Phone must be at least 6 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  telegram_id: z.string().min(1, 'Telegram ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  is_owner: z.boolean().default(false).optional(),
});

// Schema for creating new admin (password required)
export const adminCreateSchema = adminBaseSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for updating admin (password optional)
export const adminUpdateSchema = adminBaseSchema.extend({
  id: z.number(),
});

// Schema for form values (password optional)
export const adminFormSchema = adminBaseSchema;

// Type definitions
export type AdminBase = z.infer<typeof adminBaseSchema>;
export type AdminCreate = z.infer<typeof adminCreateSchema>;
export type AdminUpdate = z.infer<typeof adminUpdateSchema>;
export type AdminFormValues = z.infer<typeof adminFormSchema>;

// Type for initial form data
export type AdminFormInitialValues = Partial<AdminFormValues> & Pick<AdminFormValues, 'is_owner'>;