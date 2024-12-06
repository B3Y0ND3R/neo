import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ProductTile from "@/components/shopping-view/product-tile";
import Layout from "@/components/home/layout";
import { Card, CardContent } from "@/components/ui/card";
import {
    Airplay,
    BabyIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloudLightning,
    Heater,
    Images,
    Shirt,
    ShirtIcon,
    ShoppingBasket,
    UmbrellaIcon,
    WashingMachine,
    WatchIcon,
  } from "lucide-react";
  import ShoppingProductTile from "@/components/shopping-view/product-tile";
const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { productList } = useSelector((state) => state.shopProducts);

  const slides = [bannerOne, bannerThree];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Fetch products based on selected filters (categories & brands)
  useEffect(() => {
    const filters = {};

    if (selectedCategories.length > 0) {
      filters.category = selectedCategories;
    }

    if (selectedBrands.length > 0) {
      filters.brand = selectedBrands;
    }

    dispatch(
      fetchAllFilteredProducts({
        filterParams: filters,
        sortParams: "price-lowtohigh",
      })
    );
  }, [selectedCategories, selectedBrands, dispatch]);

  const handleNavigateToListingPage = (item, type) => {
    let filterParams = {};
    if (type === "category") {
      filterParams.category = item.id;
      setSelectedCategories([item.id]);  // Update selected category filter
    } else if (type === "brand") {
      filterParams.brand = item.id;
      setSelectedBrands([item.id]);  // Update selected brand filter
    }

    // Navigate to the same page with updated filters in the query params
    navigate({
      pathname: "/",
      search: `?category=${filterParams.category || ""}&brand=${filterParams.brand || ""}`,
    });

    // Dispatch to fetch filtered products
    dispatch(fetchAllFilteredProducts({ filterParams, sortParams: "price-lowtohigh" }));
  };

  useEffect(() => {
    // Extract query params from the URL and update filters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get("category");
    const brandFromURL = urlParams.get("brand");

    if (categoryFromURL) {
      setSelectedCategories([categoryFromURL]);
    }
    if (brandFromURL) {
      setSelectedBrands([brandFromURL]);
    }
  }, []);

  // Image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        {/* Banner Section */}
        <div className="relative w-full h-[600px] overflow-hidden">
          {slides.map((slide, index) => (
            <img
              src={slide}
              key={index}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
            }
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
            }
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Shop by Category Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Shop by category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoriesWithIcon.map((categoryItem) => (
                <Card
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  key={categoryItem.id}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{categoryItem.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Brand Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brandsWithIcon.map((brandItem) => (
                <Card
                  onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  key={brandItem.id}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{brandItem.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
      
<section className="py-12 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-8">Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productList && productList.length > 0 ? (
        productList.map((productItem) => (
          <ShoppingProductTile
            key={productItem.id}
            product={productItem}
            //showAddToCart={false}  // Hide Add to Cart button on HomePage
           // handleGetProductDetails={handleGetProductDetails}
            //handleAddtoCart={handleAddtoCart}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No products found.
        </p>
      )}
    </div>
  </div>
</section>

      </div>
    </Layout>
  );
}

export default HomePage;
