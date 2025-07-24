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
import { useDeleteCustomer, useGetCustomers } from "../../api/hooks/customer/customer.api";
import { CustomerForm } from "./components/CustomerForm";
import { FormDialog } from "../../components/form/FormDialog";

export const CustomerList = () => {
  const { data: customers, isLoading, isError } = useGetCustomers();
  const { mutate: deleteCustomer } = useDeleteCustomer();
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleDelete = (id: number | null) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(id);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading customers</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedCustomer(null);
            setOpenForm(true);
          }}
        >
          Add Customer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.data?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <Chip
                    label={customer.customer_type}
                    color={customer.customer_type === 'VIP' ? "primary" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedCustomer(customer.id ?? null);
                      setOpenForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(customer.id ?? null)}>
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
        title={selectedCustomer ? "Edit Customer" : "Create Customer"}
      >
        <CustomerForm
          initialData={
            selectedCustomer
              ? customers?.data?.find(
                  (c) => c.id !== undefined && c.id === Number(selectedCustomer)
                )
              : undefined
          }
          onSuccess={() => {
            setOpenForm(false);
            setSelectedCustomer(null);
          }}
        />
      </FormDialog>
    </Box>
  );
};