import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {

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
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;