import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeatureImages } from "@/store/common-slice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PublicHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  const categories = [
    { name: "Men's Fashion", image: "https://source.unsplash.com/800x600/?mens-fashion" },
    { name: "Women's Collection", image: "https://source.unsplash.com/800x600/?womens-fashion" },
    { name: "Kids' Wear", image: "https://source.unsplash.com/800x600/?kids-fashion" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Slider */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <motion.img
                key={index}
                src={slide?.image}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 1.1
                }}
                transition={{ duration: 0.7 }}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            ))
          : null}

        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to NEO</h1>
            <p className="text-xl md:text-2xl mb-8">Discover the latest in fashion</p>
            <Button 
              onClick={() => navigate("/auth/login")}
              className="bg-white text-black hover:bg-gray-200 transform hover:scale-105 transition-all"
              size="lg"
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories Section */}
      <section className="py-16 px-4 md:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Explore Our Collections
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg"
              onClick={() => navigate("/auth/login")}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Why Choose NEO?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Premium Quality", description: "Curated selection of high-quality fashion items" },
              { title: "Fast Delivery", description: "Quick and reliable shipping to your doorstep" },
              { title: "24/7 Support", description: "Always here to help with your shopping needs" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 rounded-lg bg-white shadow-md"
              >
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PublicHome;
