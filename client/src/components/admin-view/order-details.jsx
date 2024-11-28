import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
   const [formData, setFormData] = useState(initialFormData);

   function handleUpdateStatus(event) {
     event.preventDefault();
   }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>1111</Label>
          </div>
           <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>01/01/2025</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>$5M</Label>
          </div>
          <div className="flex mt-2 items-center justify-between"> 
             <p className="font-medium">Order Status</p>
            <Label>In Process</Label>
          </div>
        </div>
        <Separator />
         <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                      <span>Product 1</span>
                      <span>$2K</span>
                    </li>
            </ul>
          </div> 
        </div>
         <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>Hasib</span>
              <span>address</span>
              <span>city</span>
              <span>pincode</span>
              <span>phone</span>
              <span>notes</span>
             </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select", 
                 options: [
                   { id: "pending", label: "Pending" },
                   { id: "inProcess", label: "In Process" },
                   { id: "inShipping", label: "In Shipping" },
                   { id: "delivered", label: "Delivered" },
                   { id: "rejected", label: "Rejected" },
                 ],
               },
             ]}
             formData={formData}
             setFormData={setFormData}
             buttonText={"Update Order Status"}
             onSubmit={handleUpdateStatus}
           /> 
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;