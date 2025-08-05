import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import debounce from 'lodash/debounce';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/home/layout";
import HomeProductTile from "@/components/home/product-tile";
import HomeProductDetails from "@/components/home/product-details";
import { fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { addToCart } from "@/store/shop/cart-slice";

function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);

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

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  // Add a small delay to allow cleanup to happen first
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productDetails !== null) {
        setOpenDetailsDialog(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [productDetails]);

  return (
    <Layout>
      <div className="container mx-auto md:px-6 px-4 py-8 min-h-[calc(100vh-200px)]">
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
                      <HomeProductTile
                        product={item}
                        handleGetProductDetails={handleGetProductDetails}
                        handleAddtoCart={handleAddtoCart}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        <HomeProductDetails
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      </div>
    </Layout>
  );
}

export default SearchPage; 