const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AboutUs = require('../models/aboutUs');

dotenv.config();

const aboutUsData = {
  hero: {
    title: 'About NEO',
    subtitle: 'Revolutionizing online shopping with quality products and exceptional service.'
  },
  features: [
    {
      icon: 'CheckCircle2',
      title: 'Quality Assured',
      description: 'Every product meets our high standards'
    },
    {
      icon: 'Star',
      title: 'Best Service',
      description: 'Customer satisfaction guaranteed'
    },
    {
      icon: 'Clock',
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping'
    },
    {
      icon: 'ShieldCheck',
      title: 'Secure Shopping',
      description: 'Safe and protected transactions'
    }
  ],
  story: {
    title: 'Our Story',
    content: [
      'Founded in 2023, NEO emerged from a vision to transform the online shopping experience.',
      'Today, we serve thousands of customers with carefully curated products.'
    ],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174'
  },
  mission: {
    title: 'Our Mission',
    content: 'To provide an unparalleled online shopping experience through innovation, quality products, and exceptional customer service.'
  },
  values: [
    {
      icon: 'Heart',
      title: 'Customer First',
      description: 'Our customers are at the heart of every decision we make.'
    },
    {
      icon: 'Award',
      title: 'Quality',
      description: 'We never compromise on the quality of our products and services.'
    },
    {
      icon: 'Rocket',
      title: 'Innovation',
      description: 'We continuously evolve and adapt to serve you better.'
    }
  ],
  stats: [
    {
      value: '5000+',
      label: 'Happy Customers'
    },
    {
      value: '1000+',
      label: 'Products'
    },
    {
      value: '24/7',
      label: 'Customer Support'
    }
  ],
  team: [
    {
      name: 'John Doe',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    },
    {
      name: 'Jane Smith',
      position: 'Chief Operations Officer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    {
      name: 'Mike Johnson',
      position: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef'
    }
  ]
};

mongoose
  .connect('mongodb+srv://ahsanulhasib2:hasib&abid@cluster0.gdn8u.mongodb.net/')
  .then(async () => {
    try {
      await AboutUs.deleteMany();
      await AboutUs.create(aboutUsData);
      console.log('About Us data seeded successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error seeding data:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 