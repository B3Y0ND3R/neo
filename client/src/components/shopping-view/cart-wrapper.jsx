import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { fetchCartItems } from "@/store/shop/cart-slice";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems: storeCartItems, isLoading } = useSelector((state) => state.shopCart);

  // Refresh cart data when component mounts to ensure data integrity
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Use store cart items if available, otherwise use props
  // Prioritize store cart items as they're more reliable
  // Filter out any items without size to prevent corruption
  const displayCartItems = (storeCartItems?.items && storeCartItems.items.length > 0) 
    ? storeCartItems.items.filter(item => item.size) 
    : (cartItems && cartItems.length > 0) 
      ? cartItems.filter(item => item.size)
      : [];

  // Debug logging to track cart data (moved after variable declaration)
  console.log('Cart wrapper - storeCartItems:', storeCartItems);
  console.log('Cart wrapper - props cartItems:', cartItems);
  console.log('Cart wrapper - displayCartItems:', displayCartItems);

  const totalCartAmount =
    displayCartItems && displayCartItems.length > 0
      ? displayCartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading cart...</p>
          </div>
        ) : displayCartItems && displayCartItems.length > 0 ? (
          displayCartItems.map((item) => (
            <UserCartItemsContent 
              key={`${item.productId}-${item.size}`} 
              cartItem={item} 
            />
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        )}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;