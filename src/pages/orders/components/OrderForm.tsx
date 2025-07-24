import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  MenuItem,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { orderFormSchema, OrderFormValues } from '../../../api/hooks/order/order.schema';
import { useCreateOrder, useUpdateOrder } from '../../../api/hooks/order/order.api';
import { useGetCustomers } from '../../../api/hooks/customer/customer.api';
import { useGetProducts } from '../../../api/hooks/product/product.api';

interface OrderFormProps {
  initialData?: OrderFormValues;
  onSuccess?: () => void;
}

export const OrderForm = ({ initialData, onSuccess }: OrderFormProps) => {
  const { mutate: createOrder, isPending: isCreating, error: createError } = useCreateOrder();
  const { mutate: updateOrder, isPending: isUpdating, error: updateError } = useUpdateOrder();
  const { data: customers } = useGetCustomers();
  const { data: products } = useGetProducts();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_id: 0,
      status: 'pending',
      total: 0,
      notes: '',
      items: [],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (initialData) {
        console.log('initial Data =>',initialData)
        const transformedItems = initialData.items?.map((item:any) => ({
        product_id: item.product?.id || 0,
        quantity: item.quantity,
        price: item.price,
        product_name: item.product?.name || '',
      })) || [];
      reset({
        status:initialData?.status,
        customer_id:initialData.customer?.id,
        items:transformedItems,
        total:Number(initialData.total),
        id:initialData?.id,
        notes:initialData?.notes
      });
    }
  }, [initialData, reset]);

  console.log('watch value =>',watch('total'))
  console.log(errors)

const onSubmit = (data: OrderFormValues) => {
  if (initialData?.id) {
    updateOrder({ 
      ...data, 
      id: initialData.id,
      items: data.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    }, { onSuccess });
  } else {
    createOrder(data, { onSuccess });
  }
};

  const addItem = () => {
    append({
      product_id: 0,
      quantity: 1,
      price: 0,
    });
  };

  const removeItem = (index: number) => {
    remove(index);
    calculateTotal();
  };

  const calculateTotal = () => {
    const items = watch('items');
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setValue('total', parseFloat(total.toFixed(2)));
  };

  const error = createError || updateError;
  const orderItems = watch('items');

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <Controller
        name="customer_id"
        control={control}
        render={({ field }) => (
          <TextField
            select
            margin="normal"
            fullWidth
            label="Customer"
            value={field.value}
            onChange={field.onChange}
            error={!!errors.customer_id}
            helperText={errors.customer_id?.message}
            required
          >
            <MenuItem value={0}>Select Customer</MenuItem>
            {customers?.data?.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name} ({customer.phone})
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <TextField
            select
            margin="normal"
            fullWidth
            label="Status"
            value={field.value}
            onChange={field.onChange}
          >
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Order Items
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Controller
                    name={`items.${index}.product_id`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          const selectedProduct = products?.data?.find(p => p.id === Number(e.target.value));
                          if (selectedProduct) {
                            setValue(`items.${index}.price`, selectedProduct.price);
                            calculateTotal();
                          }
                        }}
                      >
                        <MenuItem value={0}>Select Product</MenuItem>
                        {products?.data?.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setValue(`items.${index}.quantity`, value);
                      calculateTotal();
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    {...register(`items.${index}.price`, { valueAsNumber: true })}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setValue(`items.${index}.price`, value);
                      calculateTotal();
                    }}
                  />
                </TableCell>
                <TableCell>
                  {(orderItems[index]?.quantity * orderItems[index]?.price).toFixed(2)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => removeItem(index)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addItem}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>

      <TextField
        margin="normal"
        fullWidth
        label="Total"
        value={Number(watch('total')).toFixed(2)}
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        margin="normal"
        fullWidth
        label="Notes"
        multiline
        rows={3}
        {...register('notes')}
        error={!!errors.notes}
        helperText={errors.notes?.message}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isCreating || isUpdating || fields.length === 0}
          startIcon={isCreating || isUpdating ? <CircularProgress size={20} /> : null}
        >
          {initialData?.id ? 'Update Order' : 'Create Order'}
        </Button>
      </Box>
    </Box>
  );
};