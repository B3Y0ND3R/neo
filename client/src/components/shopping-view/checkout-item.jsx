import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useToast } from "../ui/use-toast";

function CheckoutItem({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleCartItemDelete(getCartItem) {
    // Check if cart item has required properties
    if (!getCartItem?.size) {
      console.error('Cart item missing size property for deletion:', getCartItem);
      toast({
        title: "Error: Cart item data is corrupted. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId, size: getCartItem?.size })
    ).then((data) => {
      if (data?.payload?.success) {
        // Refresh cart items to ensure data integrity
        dispatch(fetchCartItems(user?.id)).then(() => {
          // Only refresh product list after cart is refreshed
          dispatch(fetchAllFilteredProducts({
            filterParams: {},
            sortParams: "price-lowtohigh",
          }));
        });
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    }).catch((error) => {
      console.error('Cart deletion failed:', error);
      // If deletion fails, refresh cart to get current state
      dispatch(fetchCartItems(user?.id));
      toast({
        title: "Failed to delete cart item",
        variant: "destructive",
      });
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <p className="text-sm text-gray-600">
          Size: {cartItem?.size || 'Unknown'}
          {!cartItem?.size && (
            <span className="text-red-500 ml-2">(Data Error)</span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">Quantity: {cartItem?.quantity}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default CheckoutItem; 