const mongoose = require('mongoose');
const Faq = require('../models/Faq');
require('dotenv').config();

const faqData = {
  categories: [
    {
      name: "General Questions",
      faqs: [
        {
          question: "What is NEO?",
          answer: "NEO is a modern e-commerce platform showcasing innovative products and designs. We focus on providing a seamless shopping experience with a carefully curated selection of items.",
          isExpanded: false
        },
        {
          question: "How do I create an account?",
          answer: "Creating an account is easy! Click the 'Sign Up' button in the top right corner, enter your email address and create a password. You can also sign up using your Google account for faster access.",
          isExpanded: false
        }
      ]
    },
    {
      name: "Products & Categories",
      faqs: [
        {
          question: "What types of products do you offer?",
          answer: "We offer a wide range of products including electronics, fashion items, accessories, and more. Our products are carefully selected to ensure quality and customer satisfaction.",
          isExpanded: false
        },
        {
          question: "How often do you add new products?",
          answer: "We regularly update our product catalog with new and exciting items. Check back frequently or subscribe to our newsletter to stay updated on new arrivals.",
          isExpanded: false
        }
      ]
    },
    {
      name: "Shopping Experience",
      faqs: [
        {
          question: "How can I find specific products?",
          answer: "You can easily find products using our search bar at the top of the page or browse through our organized categories. You can also use filters to narrow down your search results.",
          isExpanded: false
        },
        {
          question: "Can I save products for later?",
          answer: "Yes! When logged in, you can add items to your wishlist by clicking the heart icon on any product. Access your saved items anytime from your account dashboard.",
          isExpanded: false
        }
      ]
    },
    {
      name: "Payment & Security",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various digital payment methods. All transactions are secured with industry-standard encryption.",
          isExpanded: false
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers.",
          isExpanded: false
        }
      ]
    },
    {
      name: "Customer Support",
      faqs: [
        {
          question: "How can I contact customer support?",
          answer: "Our customer support team is available to help! You can reach us through email at support@neo.com or use the contact form on our website. We typically respond to inquiries within 24 hours.",
          isExpanded: false
        },
        {
          question: "Where can I find more information about NEO?",
          answer: "Visit our About Us page to learn more about our story, mission, and team. You can also follow us on social media for updates and announcements.",
          isExpanded: false
        }
      ]
    }
  ]
};

const seedFAQs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://ahsanulhasib2:hasib&abid@cluster0.gdn8u.mongodb.net/');
    console.log('Connected to MongoDB...');

    // Clear existing FAQs
    await Faq.deleteMany({});
    console.log('Cleared existing FAQs...');

    // Insert new FAQ data
    await Faq.create(faqData);
    console.log('FAQ data seeded successfully!');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');

  } catch (error) {
    console.error('Error seeding FAQ data:', error);
    process.exit(1);
  }
};

seedFAQs();