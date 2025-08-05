import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  setProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import HashLoader from "react-spinners/HashLoader";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value)) {
      queryParams.push(`${key}=${value.join(",")}`);
    }
  }

  return queryParams.join("&");
}


function ShoppingListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const { toast } = useToast();

  // Cleanup product details when component mounts to prevent modal from showing
  useEffect(() => {
    dispatch(setProductDetails());
  }, [dispatch]);

  // 1️⃣ Sync filters from URL → state
  useEffect(() => {
    const filtersFromURL = {};
    for (const [key, value] of searchParams.entries()) {
      const values = value.split(",");
      filtersFromURL[key] = key === "price" ? values.map(Number) : values;
    }
    

    if (JSON.stringify(filters) !== JSON.stringify(filtersFromURL)) {
      setFilters(filtersFromURL);
    }

    setFiltersInitialized(true);
  }, [location.search]); // Important: listen to location changes

  // 2️⃣ Update URL when filters change manually
  useEffect(() => {
    if (!filtersInitialized) return;
    const qs = createSearchParamsHelper(filters);
    setSearchParams(qs);
  }, [filters]);

  // 3️⃣ Fetch only after filters are ready
  useEffect(() => {
    if (!filtersInitialized) return;
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
  }, [filters, sort, filtersInitialized]);

  // 4️⃣ Open product detail dialog
  useEffect(() => {
    // Add a small delay to allow cleanup to happen first
    const timer = setTimeout(() => {
      if (productDetails !== null) {
        setOpenDetailsDialog(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [productDetails]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(sectionId, option) {
    let updated = { ...filters };
  
    if (sectionId === "price") {
      updated.price = option; // direct assignment: [min, max]
    } else {
      const idx = updated[sectionId]?.indexOf(option);
  
      if (!updated[sectionId]) {
        updated[sectionId] = [option];
      } else if (idx === -1) {
        updated[sectionId].push(option);
      } else {
        updated[sectionId].splice(idx, 1);
        if (updated[sectionId].length === 0) delete updated[sectionId];
      }
    }
  
    setFilters(updated);
  }
  

  function handleGetProductDetails(id) {
    dispatch(fetchProductDetails(id));
  }

  function handleAddtoCart(productId, selectedSizes) {
    if (!selectedSizes || Object.keys(selectedSizes).length === 0) {
      toast({ title: "Please select sizes", variant: "destructive" });
      return;
    }

    const current = cartItems?.items || [];
    const product = productList?.find(p => p._id === productId);
    
    // Validate all selected sizes and quantities
    for (const [size, quantity] of Object.entries(selectedSizes)) {
      const index = current.findIndex((item) => item.productId === productId && item.size === size);
      const existingQty = index !== -1 ? current[index].quantity : 0;
      const sizeStock = product?.sizes?.[size] || 0;

      if (existingQty + quantity > sizeStock) {
        toast({ 
          title: `Only ${sizeStock} quantity available in size ${size}`, 
          variant: "destructive" 
        });
        return;
      }
    }

    // Add each size to cart
    const promises = Object.entries(selectedSizes).map(([size, quantity]) => 
      dispatch(addToCart({ userId: user?.id, productId, quantity, size }))
    );

    Promise.all(promises).then((results) => {
      const allSuccess = results.every(res => res?.payload?.success);
      if (allSuccess) {
        dispatch(fetchCartItems(user?.id));
        // Refresh product list to update stock display
        dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
        const sizeText = Object.entries(selectedSizes).map(([size, qty]) => `${size}(${qty})`).join(', ');
        toast({ title: `Products added to cart (${sizeText})` });
      }
    });
  }

  // 5️⃣ Prevent flicker
  if (!filtersInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <Skeleton className="w-20 h-20 bg-white flex items-center justify-center">
          <HashLoader loading={true} color="#000000" size={50} />
        </Skeleton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((s) => (
                    <DropdownMenuRadioItem key={s.id} value={s.id}>
                      {s.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList?.map((p) => (
            <ShoppingProductTile
              key={p._id}
              product={p}
              handleGetProductDetails={handleGetProductDetails}
              handleAddtoCart={handleAddtoCart}
            />
          ))}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
