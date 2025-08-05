import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-2 sm:border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-3 sm:p-4 gap-3 sm:gap-4">
        <Label className="text-sm sm:text-base">Address: {addressInfo?.address}</Label>
        <Label className="text-sm sm:text-base">City: {addressInfo?.city}</Label>
        <Label className="text-sm sm:text-base">Pincode: {addressInfo?.pincode}</Label>
        <Label className="text-sm sm:text-base">Phone: {addressInfo?.phone}</Label>
        <Label className="text-sm sm:text-base">Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex flex-col sm:flex-row gap-2 sm:justify-between">
        <Button 
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => handleEditAddress(addressInfo)}
        >
          Edit
        </Button>
        <Button 
          size="sm"
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={() => handleDeleteAddress(addressInfo)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;