
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import AdminOrderDetailsView from "./order-details";
function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
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
                  <TableRow>
                    <TableCell>1111</TableCell>
                    <TableCell>01/01/2025</TableCell>
                    <TableCell>In Process</TableCell>
                    <TableCell>$5M</TableCell>
                    <TableCell>
                    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                        <Button
                          onClick={() =>setOpenDetailsDialog(true)}>
                          View Details
                        </Button>
                        <AdminOrderDetailsView />
                      </Dialog>
                    </TableCell>
                  </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;