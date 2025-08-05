import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import debounce from 'lodash/debounce';
import { Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  // Cleanup product details when component mounts to prevent modal from showing
  useEffect(() => {
    dispatch(setProductDetails());
  }, [dispatch]);

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

  function handleAddtoCart(getCurrentProductId, selectedSizes) {
    if (!selectedSizes || Object.keys(selectedSizes).length === 0) {
      toast({ title: "Please select sizes", variant: "destructive" });
      return;
    }

    let getCartItems = cartItems.items || [];
    const product = productList?.find(p => p._id === getCurrentProductId);

    // Validate all selected sizes and quantities
    for (const [size, quantity] of Object.entries(selectedSizes)) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && item.size === size
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        const sizeStock = product?.sizes?.[size] || 0;
        
        if (getQuantity + quantity > sizeStock) {
          toast({
            title: `Only ${sizeStock} quantity available in size ${size}`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Add each size to cart
    const promises = Object.entries(selectedSizes).map(([size, quantity]) => 
      dispatch(addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity,
        size,
      }))
    );

    Promise.all(promises).then((results) => {
      const allSuccess = results.every(res => res?.payload?.success);
      if (allSuccess) {
        dispatch(fetchCartItems(user?.id));
        // Refresh product list to update stock display
        dispatch(fetchAllFilteredProducts({
          filterParams: {},
          sortParams: "price-lowtohigh",
        }));
        const sizeText = Object.entries(selectedSizes).map(([size, qty]) => `${size}(${qty})`).join(', ');
        toast({
          title: `Products added to cart (${sizeText})`,
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    // Add a small delay to allow cleanup to happen first
    const timer = setTimeout(() => {
      if (productDetails !== null) {
        setOpenDetailsDialog(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8 min-h-[calc(100vh-200px)]">
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
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
            
            {/* Visual Search Button - Only visible for logged-in users */}
            {user && (
              <Button
                onClick={() => navigate('/shop/visual-search')}
                className="px-6 py-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Camera className="w-5 h-5 mr-2" />
                Visual Search
              </Button>
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
            className="flex justify-center items-center min-h-[400px]"
          >
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
          </motion.div>
        ) : (
          <>
            {!keyword || keyword.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center min-h-[400px] flex flex-col justify-center items-center"
              >
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Search Products</h1>
                <p className="text-gray-600 text-lg">
                  Enter keywords above to find the products you're looking for
                </p>
              </motion.div>
            ) : !searchResults.length && keyword.length > 2 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center min-h-[400px] flex flex-col justify-center items-center"
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
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 min-h-[400px]"
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