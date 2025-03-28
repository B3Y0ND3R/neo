import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Card, CardContent } from "@/components/ui/card";
import { getFeatureImages } from "@/store/common-slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Airplay, BabyIcon, CloudLightning, Heater,
  Images, Shirt, ShirtIcon, ShoppingBasket,
  UmbrellaIcon, WashingMachine, WatchIcon,
} from "lucide-react";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon, color: "from-blue-500 to-blue-600" },
  { id: "women", label: "Women", icon: CloudLightning, color: "from-pink-500 to-pink-600" },
  { id: "kids", label: "Kids", icon: BabyIcon, color: "from-purple-500 to-purple-600" },
  { id: "accessories", label: "Accessories", icon: WatchIcon, color: "from-amber-500 to-amber-600" },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon, color: "from-green-500 to-green-600" },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt, color: "from-gray-800 to-gray-900" },
  { id: "adidas", label: "Adidas", icon: WashingMachine, color: "from-blue-800 to-blue-900" },
  { id: "puma", label: "Puma", icon: ShoppingBasket, color: "from-red-800 to-red-900" },
  { id: "levi", label: "Levi's", icon: Airplay, color: "from-indigo-800 to-indigo-900" },
  { id: "zara", label: "Zara", icon: Images, color: "from-emerald-800 to-emerald-900" },
  { id: "h&m", label: "H&M", icon: Heater, color: "from-rose-800 to-rose-900" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "date-newest",
        limit: 4
      })
    );
  }, [dispatch]);

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  const handleAddtoCart = (getCurrentProductId) => {
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
  };

  const handleNavigateToListingPage = (item, type) => {
    let filterParams = {};
    if (type === "category") {
      filterParams.category = [item.id];
      setSelectedCategories([item.id]);
    } else if (type === "brand") {
      filterParams.brand = [item.id];
      setSelectedBrands([item.id]);
    }

    dispatch(fetchAllFilteredProducts({
      filterParams,
      sortParams: "price-lowtohigh",
    }));

    navigate({
      pathname: "/shop/listing",
      search: `?${type}=${item.id}`,
    });
  };

  useEffect(() => {
    const filters = {};
    if (selectedCategories.length > 0) {
      filters.category = selectedCategories;
    }
    if (selectedBrands.length > 0) {
      filters.brand = selectedBrands;
    }
    
    dispatch(fetchAllFilteredProducts({
      filterParams: filters,
      sortParams: "price-lowtohigh",
    }));
  }, [selectedCategories, selectedBrands, dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="relative min-h-screen bg-[#fafafa]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex flex-col lg:flex-row items-center overflow-hidden">
        {/* Left Content */}
        <motion.div 
          className="relative z-10 w-full lg:w-1/2 p-8 lg:p-16"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Welcome back,
            </span>
            <br />
            {user?.userName || "Shopper"}!
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-8">
            Continue exploring our latest collections curated just for you
          </p>
          <div className="flex gap-4">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full"
              onClick={() => navigate("/shop/listing")}
            >
              Browse Collection
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-6 rounded-full"
              onClick={() => navigate("/shop/cart")}
            >
              View Cart
            </Button>
          </div>
        </motion.div>

        {/* Right Slider */}
        <motion.div 
          className="relative w-full lg:w-1/2 h-[50vh] lg:h-[80vh]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {featureImageList?.map((slide, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                      opacity: index === currentSlide ? 1 : 0,
                      scale: index === currentSlide ? 1 : 1.1,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={slide?.image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlide((prev) => 
                (prev - 1 + featureImageList.length) % featureImageList.length
              )}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
          </motion.div>

          <div className="flex gap-2">
            {featureImageList?.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlide((prev) => 
                (prev + 1) % featureImageList.length
              )}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <motion.section 
        className="relative py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categoriesWithIcon.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  onClick={() => handleNavigateToListingPage(category, "category")}
                  className="group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="relative aspect-square rounded-3xl overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                    <div className="relative h-full p-6 flex flex-col items-center justify-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 p-4 bg-white/20 rounded-2xl backdrop-blur-sm"
                      >
                        <category.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <span className="text-xl font-semibold text-white group-hover:scale-110 transition-transform">
                        {category.label}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Brands Section */}
      <motion.section 
        className="relative py-24 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Featured Brands</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brandsWithIcon.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative p-1 rounded-2xl bg-gradient-to-br from-gray-200 to-white"
                  onClick={() => handleNavigateToListingPage(brand, "brand")}
                >
                  <div className="bg-white p-6 rounded-xl cursor-pointer">
                    <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <brand.icon className="w-12 h-12 text-gray-700" />
                      </motion.div>
                    </div>
                    <p className="text-center font-semibold">{brand.label}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section 
        className="relative py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Latest Arrivals</h2>
            <p className="text-gray-600">Check out our newest additions</p>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productList && productList.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="p-2">
                    <ShoppingProductTile 
                      product={product}
                      handleGetProductDetails={handleGetProductDetails}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </motion.div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;