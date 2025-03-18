import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import debounce from 'lodash/debounce';
import { Loader2 } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  // Initialize search from URL params
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword) {
      setKeyword(urlKeyword);
      if (urlKeyword.length > 2) {
        dispatch(getSearchResults(urlKeyword));
      }
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm && searchTerm.trim() !== "" && searchTerm.trim().length > 2) {
        setIsSearching(true);
        dispatch(getSearchResults(searchTerm))
          .finally(() => setIsSearching(false));
        setSearchParams(new URLSearchParams(`?keyword=${searchTerm}`));
      } else {
        setSearchParams(new URLSearchParams(`?keyword=${searchTerm}`));
        dispatch(resetSearchResults());
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(keyword);
    return () => debouncedSearch.cancel();
  }, [keyword, debouncedSearch]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Input
              value={keyword}
              name="keyword"
              onChange={(event) => setKeyword(event.target.value)}
              className="py-6 pr-12 text-lg shadow-lg focus-visible:ring-yellow-400"
              placeholder="Search for products..."
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
              </div>
            )}
          </div>
          
          {keyword.length > 0 && keyword.length <= 2 && (
            <p className="text-sm text-gray-500 mt-2">
              Please enter at least 3 characters to search
            </p>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center min-h-[300px]"
          >
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
          </motion.div>
        ) : (
          <>
            {!searchResults.length && keyword.length > 2 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold text-gray-800">No results found</h1>
                <p className="text-gray-600 mt-2">
                  Try different keywords or check the spelling
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {searchResults.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }}
                  >
                    <ShoppingProductTile
                      handleAddtoCart={handleAddtoCart}
                      product={item}
                      handleGetProductDetails={handleGetProductDetails}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;