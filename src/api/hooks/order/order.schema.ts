import { z } from 'zod';

const orderItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export enum OrderStatus {
    pending="pending",confirmed="confirmed", shipped="shipped", delivered="delivered", cancelled="cancelled"
}

// Base schema for validation
export const orderBaseSchema = z.object({
  id: z.number().optional(),
  customer_id: z.number(),
  status: z.string().optional(),
  total: z.number().min(0),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  customer:z.object().optional(),
});

// Schema for creating new order
export const orderCreateSchema = orderBaseSchema;

// Schema for updating order
export const orderUpdateSchema = orderBaseSchema.extend({
  id: z.number(),
});

// Schema for form values
export const orderFormSchema = orderBaseSchema;

// Type definitions
export type OrderBase = z.infer<typeof orderBaseSchema>;
export type OrderCreate = z.infer<typeof orderCreateSchema>;
export type OrderUpdate = z.infer<typeof orderUpdateSchema>;
export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type OrderItemFormValues = z.infer<typeof orderItemSchema>;