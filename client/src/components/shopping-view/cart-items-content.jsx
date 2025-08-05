import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Debug logging to track cart item data
  console.log('CartItem received:', cartItem);
  console.log('CartItem size:', cartItem?.size);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    // Check if cart item has required properties
    if (!getCartItem?.size) {
      console.error('Cart item missing size property:', getCartItem);
      toast({
        title: "Error: Cart item data is corrupted. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId && item.size === getCartItem?.size
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        
        if (getCurrentProductIndex > -1) {
          const product = productList[getCurrentProductIndex];
          const sizeStock = product.sizes?.[getCartItem?.size] || 0;

          if (indexOfCurrentCartItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
            if (getQuantity + 1 > sizeStock) {
              toast({
                title: `Only ${sizeStock} quantity available in size ${getCartItem?.size}`,
                variant: "destructive",
              });
              return;
            }
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
        size: getCartItem?.size,
      })
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
          title: "Cart item is updated successfully",
        });
      }
    }).catch((error) => {
      console.error('Cart update failed:', error);
      // If update fails, refresh cart to get current state
      dispatch(fetchCartItems(user?.id));
      toast({
        title: "Failed to update cart item",
        variant: "destructive",
      });
    });
  }

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
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
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

export default UserCartItemsContent;