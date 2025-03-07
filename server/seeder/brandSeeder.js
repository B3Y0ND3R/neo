const Brand = require("../models/Brand");
const mongoose = require("mongoose");

const brands = [
  {
    name: "Nike",
    icon: "Shirt",
    description: "Leading sportswear manufacturer",
  },
  {
    name: "Adidas",
    icon: "WashingMachine",
    description: "Global sports and lifestyle brand",
  },
  {
    name: "Puma",
    icon: "ShoppingBasket",
    description: "Sports and casual wear manufacturer",
  },
  {
    name: "Levi's",
    icon: "Airplay",
    description: "Iconic denim brand",
  },
  {
    name: "Zara",
    icon: "Images",
    description: "Fast fashion retail brand",
  },
  {
    name: "H&M",
    icon: "Heater",
    description: "Global fashion retailer",
  },
];

const seedBrands = async () => {
  try {
    await mongoose.connect("mongodb+srv://ahsanulhasib2:hasib&abid@cluster0.gdn8u.mongodb.net/");
    console.log("Connected to MongoDB");
    
    await Brand.deleteMany({});
    console.log("Deleted existing brands");
    
    await Brand.insertMany(brands);
    console.log("Brands seeded successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding brands:", error);
    process.exit(1);
  }
};

seedBrands(); 