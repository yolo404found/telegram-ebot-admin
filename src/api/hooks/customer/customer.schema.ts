import { z } from 'zod';

// Define the customer type enum
enum CustomerTypes {normal="normal",vip="VIP"}

// Base schema for validation
export const customerBaseSchema = z.object({
  id: z.number().optional(),
  phone: z.string().min(6, 'Phone must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  customer_type: z.string().default('normal').optional(),
//   customer_type: z.enum(CustomerTypes).optional(),
//   customer_type: z.union([z.literal("normal"), z.literal("VIP")]).optional(),

});

// Schema for creating new customer
export const customerCreateSchema = customerBaseSchema;

// Schema for updating customer
export const customerUpdateSchema = customerBaseSchema.extend({
  id: z.number(),
});

// Schema for form values
export const customerFormSchema = customerBaseSchema;

// Type definitions
export type CustomerBase = z.infer<typeof customerBaseSchema>;
export type CustomerCreate = z.infer<typeof customerCreateSchema>;
export type CustomerUpdate = z.infer<typeof customerUpdateSchema>;
export type CustomerFormValues = z.infer<typeof customerFormSchema>;
export type CustomerType = z.infer<typeof CustomerTypes>;