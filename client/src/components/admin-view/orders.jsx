import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Dialog } from "../ui/dialog";
import axios from 'axios';
import { MoreHorizontal, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ORDERS_PER_PAGE = 20;

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "in_process":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    // Clear any existing order details when component mounts
    dispatch(resetOrderDetails());
    dispatch(getAllOrdersForAdmin());
    
    // Cleanup function to reset order details when component unmounts
    return () => {
      dispatch(resetOrderDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetailsForAdmin(getId));
    setSelectedOrderId(getId);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`);
      dispatch(getAllOrdersForAdmin());
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const deleteOrdersPast30Days = async () => {
    try {
      await axios.delete('http://localhost:5000/api/admin/orders/delete-old');
      dispatch(getAllOrdersForAdmin());
    } catch (error) {
      console.error('Error deleting orders from the past 30 days:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(orderList.length / ORDERS_PER_PAGE);
  const paginatedOrders = orderList.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">All Orders</CardTitle>
        <Button 
          onClick={deleteOrdersPast30Days} 
          className="mt-2 w-full md:w-auto"
          variant="destructive"
        >
          Delete Orders from the Past 30 Days
        </Button>
      </CardHeader>

      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden xl:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead className="w-48">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders && paginatedOrders.length > 0
                ? paginatedOrders.map((orderItem) => (
                    <TableRow key={orderItem?._id}>
                      <TableCell className="font-mono text-sm max-w-32 truncate">
                        {orderItem?._id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {orderItem?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${getStatusColor(orderItem?.orderStatus)}`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">
                        ${orderItem?.totalAmount}
                      </TableCell>
                      <TableCell className="w-48">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            size="sm"
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => deleteOrder(orderItem?._id)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        {/* Medium Screen Table View */}
        <div className="hidden lg:block xl:hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-40">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders && paginatedOrders.length > 0
                ? paginatedOrders.map((orderItem) => (
                    <TableRow key={orderItem?._id}>
                      <TableCell className="font-mono text-xs max-w-24 truncate">
                        {orderItem?._id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {orderItem?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-2 text-xs ${getStatusColor(orderItem?.orderStatus)}`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold whitespace-nowrap text-sm">
                        ${orderItem?.totalAmount}
                      </TableCell>
                      <TableCell className="w-40">
                        <div className="flex flex-col gap-1">
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            size="sm"
                            className="text-xs h-7"
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() => deleteOrder(orderItem?._id)}
                            variant="destructive"
                            size="sm"
                            className="text-xs h-7"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {paginatedOrders && paginatedOrders.length > 0
            ? paginatedOrders.map((orderItem) => (
                <Card key={orderItem?._id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Order ID</p>
                      <p className="font-mono text-sm font-semibold truncate">
                        {orderItem?._id}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteOrder(orderItem?._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-medium">{orderItem?.orderDate.split("T")[0]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Price</p>
                      <p className="font-semibold text-lg">${orderItem?.totalAmount}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge
                      className={`py-1 px-3 ${getStatusColor(orderItem?.orderStatus)}`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>
                </Card>
              ))
            : (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>

      {/* Dialog for Order Details */}
              <Dialog open={openDetailsDialog} onOpenChange={handleCloseDetailsDialog}>
        <AdminOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;
