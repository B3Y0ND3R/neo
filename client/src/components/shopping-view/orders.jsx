import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
  cancelUserOrder,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { Download } from "lucide-react";

const ORDERS_PER_PAGE = 10;

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();

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

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  };

  const handleCancelOrder = (orderId) => {
    dispatch(cancelUserOrder(orderId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersByUserId(user?.id));
        toast({
          title: "Order cancelled successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          title: data?.payload?.message || "Failed to cancel order",
        });
      }
    });
  };

  const handleDownloadCashMemo = async (orderId) => {
    try {
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = `http://localhost:5000/api/shop/pdf/cash-memo/${orderId}`;
      link.download = `cash-memo-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Cash memo downloaded successfully!",
        description: "The PDF has been downloaded to your device.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Failed to download cash memo",
      });
    }
  };

  useEffect(() => {
    // Clear any existing order details when component mounts
    dispatch(resetOrderDetails());
    dispatch(getAllOrdersByUserId(user?.id));
    
    // Cleanup function to reset order details when component unmounts
    return () => {
      dispatch(resetOrderDetails());
    };
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const paginatedOrders = orderList.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const totalPages = Math.ceil(orderList.length / ORDERS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl lg:text-2xl">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm lg:text-base">Order ID</TableHead>
                <TableHead className="text-sm lg:text-base">Order Date</TableHead>
                <TableHead className="text-sm lg:text-base">Order Status</TableHead>
                <TableHead className="text-sm lg:text-base">Order Price</TableHead>
                <TableHead className="text-sm lg:text-base">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders && paginatedOrders.length > 0
                ? paginatedOrders.map((orderItem) => {
                    const orderTime = new Date(orderItem.orderDate);
                    const now = new Date();
                    const diffInHours =
                      (now.getTime() - orderTime.getTime()) / (1000 * 60 * 60);
                    const canCancel =
                      orderItem.orderStatus !== "cancelled" &&
                      diffInHours <= 24;

                    return (
                      <TableRow key={orderItem._id}>
                        <TableCell className="text-sm lg:text-base font-mono">{orderItem._id.slice(-8)}</TableCell>
                        <TableCell className="text-sm lg:text-base">
                          {orderItem.orderDate.split("T")[0]}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`py-1 px-3 text-xs lg:text-sm ${getStatusColor(
                              orderItem.orderStatus
                            )}`}
                          >
                            {orderItem.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm lg:text-base font-semibold">${orderItem.totalAmount}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleFetchOrderDetails(orderItem._id)
                            }
                          >
                            View Details
                          </Button>
                          {(orderItem.orderStatus === "confirmed" || orderItem.orderStatus === "delivered") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadCashMemo(orderItem._id)}
                              className="text-green-600 border-green-600 hover:bg-green-50 text-xs sm:text-sm"
                            >
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Cash Memo</span>
                              <span className="sm:hidden">Memo</span>
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(orderItem._id)}
                            disabled={!canCancel}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedOrders && paginatedOrders.length > 0
            ? paginatedOrders.map((orderItem) => {
                const orderTime = new Date(orderItem.orderDate);
                const now = new Date();
                const diffInHours =
                  (now.getTime() - orderTime.getTime()) / (1000 * 60 * 60);
                const canCancel =
                  orderItem.orderStatus !== "cancelled" &&
                  diffInHours <= 24;

                return (
                  <Card key={orderItem._id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Order ID</p>
                          <p className="text-xs font-mono text-muted-foreground">{orderItem._id.slice(-8)}</p>
                        </div>
                        <Badge
                          className={`py-1 px-2 text-xs ${getStatusColor(
                            orderItem.orderStatus
                          )}`}
                        >
                          {orderItem.orderStatus}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-muted-foreground">{orderItem.orderDate.split("T")[0]}</p>
                        </div>
                        <div>
                          <p className="font-medium">Total</p>
                          <p className="font-semibold">${orderItem.totalAmount}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 pt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 min-w-0 text-xs"
                          onClick={() =>
                            handleFetchOrderDetails(orderItem._id)
                          }
                        >
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                        {(orderItem.orderStatus === "confirmed" || orderItem.orderStatus === "delivered") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-0 text-green-600 border-green-600 hover:bg-green-50 text-xs"
                            onClick={() => handleDownloadCashMemo(orderItem._id)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Cash Memo</span>
                            <span className="sm:hidden">Memo</span>
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 min-w-0 text-xs"
                          onClick={() => handleCancelOrder(orderItem._id)}
                          disabled={!canCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            : (
              <div className="text-center py-8 text-muted-foreground">
                No orders found
              </div>
            )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
            <Button
              variant="outline"
              size="sm"
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
              size="sm"
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
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <ShoppingOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </Card>
  );
}

export default ShoppingOrders;
