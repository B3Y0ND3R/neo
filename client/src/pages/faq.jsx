import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import Header from '../components/home/header';
import Footer from '../components/home/footer';

const FAQ = () => {
  const [faqData, setFaqData] = useState({ categories: [] });
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedFaqs, setExpandedFaqs] = useState({});

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faq', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (response.data) {
          setFaqData(response.data);
        }
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      }
    };

    fetchFaqData();
  }, []);

  const toggleFaq = (categoryIndex, faqIndex) => {
    setExpandedFaqs(prev => {
      const key = `${categoryIndex}-${faqIndex}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-gray-900 sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-5 text-xl text-center text-gray-500">
              Find answers to common questions about our services
            </p>

            <div className="mt-12">
              {/* Category Tabs */}
              <div className="flex space-x-2 overflow-x-auto pb-4">
                {faqData.categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(index)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      activeCategory === index
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* FAQ Accordion */}
              <div className="mt-8 space-y-4">
                <AnimatePresence mode='wait'>
                  {faqData.categories[activeCategory]?.faqs.map((faq, faqIndex) => (
                    <motion.div
                      key={faqIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg shadow-sm"
                    >
                      <button
                        onClick={() => toggleFaq(activeCategory, faqIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center"
                      >
                        <span className="text-lg font-medium text-gray-900">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            expandedFaqs[`${activeCategory}-${faqIndex}`] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      <AnimatePresence>
                        {expandedFaqs[`${activeCategory}-${faqIndex}`] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4 prose prose-purple max-w-none">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ; 