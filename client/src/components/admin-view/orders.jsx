import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Dialog } from "../ui/dialog"; // Import Dialog
import axios from 'axios';

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "inProcess":
        return "bg-blue-500";
      case "inShipping":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "rejected":
        return "bg-red-600";
      default:
        return "bg-black";
    }
  };

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetailsForAdmin(getId));
    setSelectedOrderId(getId);
    setOpenDetailsDialog(true); // Open the dialog
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`); // Ensure the URL is correct
      dispatch(getAllOrdersForAdmin()); // Refresh the order list
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const deleteOrdersPast30Days = async () => {
    try {
      await axios.delete('http://localhost:5000/api/admin/orders/delete-old'); // Ensure the URL is correct
      dispatch(getAllOrdersForAdmin()); // Refresh the order list
    } catch (error) {
      console.error('Error deleting orders from the past 30 days:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <Button onClick={deleteOrdersPast30Days} className="mt-2">
          Delete Orders from the Past 30 Days
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${getStatusColor(orderItem?.orderStatus)}`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Button onClick={() => deleteOrder(orderItem?._id)} className="mr-2">
                        Delete
                      </Button>
                      <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog for Order Details */}
      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <AdminOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;