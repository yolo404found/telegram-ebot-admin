import { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDeleteOrder, useGetOrders } from "../../api/hooks/order/order.api";
import { OrderForm } from ".";
import { FormDialog } from "../../components/form/FormDialog";

export const OrderList = () => {
  const { data: orders, isLoading, isError } = useGetOrders();
  const { mutate: deleteOrder } = useDeleteOrder();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleDelete = (id: number | null) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(id);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading orders</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedOrder(null);
            setOpenForm(true);
          }}
        >
          Create Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer?.name}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'delivered' ? 'success' : 
                      order.status === 'cancelled' ? 'error' : 
                      order.status === 'shipped' ? 'info' : 'default'
                    }
                  />
                </TableCell>
                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                {/* <TableCell>{new Date(order?.created_at).toLocaleDateString()}</TableCell> */}
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedOrder(order.id ?? null);
                      setOpenForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(order.id ?? null)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={selectedOrder ? "Edit Order" : "Create Order"}
        maxWidth="md"
      >
        <OrderForm
          initialData={
            selectedOrder
              ? orders?.data?.find(
                  (o) => o.id !== undefined && o.id === Number(selectedOrder)
                )
              : undefined
          }
          onSuccess={() => {
            setOpenForm(false);
            setSelectedOrder(null);
          }}
        />
      </FormDialog>
    </Box>
  );
};