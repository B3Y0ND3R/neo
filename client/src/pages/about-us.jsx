import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, CheckCircle2, Star, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/home/header";
import Footer from "../components/home/footer";

const defaultAboutData = {
  hero: {
    title: 'About NEO',
    subtitle: 'Revolutionizing online shopping with quality products and exceptional service.'
  },
  features: [
    {
      icon: 'CheckCircle2',
      title: 'Quality Products',
      description: 'We offer high-quality products that meet the highest standards.'
    },
    {
      icon: 'Star',
      title: 'Exceptional Service',
      description: 'Our team is dedicated to providing exceptional service.'
    },
    {
      icon: 'Clock',
      title: 'Fast Delivery',
      description: 'We deliver products quickly and efficiently.'
    },
    {
      icon: 'ShieldCheck',
      title: 'Secure Shopping',
      description: 'Your security is our top priority.'
    }
  ],
  story: {
    title: 'Our Story',
    content: [
      'We started NEO with a vision to revolutionize online shopping. Our journey began in 2020, when we realized the potential of the internet to connect people and businesses.',
      'Our founders, with a passion for technology and a deep understanding of the market, set out to create a platform that would not only meet but exceed the expectations of our customers.',
      'From the very beginning, we focused on building a strong foundation. We invested in technology, hired the best talent, and established a culture of innovation and excellence.'
    ],
    image: '/path/to/our-story-image.jpg'
  },
  stats: [
    {
      value: '100+',
      label: 'Products'
    },
    {
      value: '500+',
      label: 'Customers'
    },
    {
      value: '98%',
      label: 'Customer Satisfaction'
    }
  ],
  team: [
    {
      name: 'John Doe',
      position: 'CEO',
      image: '/path/to/john-doe.jpg'
    },
    {
      name: 'Jane Smith',
      position: 'CTO',
      image: '/path/to/jane-smith.jpg'
    },
    {
      name: 'Bob Johnson',
      position: 'COO',
      image: '/path/to/bob-johnson.jpg'
    }
  ]
};

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/about-us', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Fetched data:', response.data);

        if (response.data && Object.keys(response.data).length > 0) {
          setAboutData((prevData) => ({
            ...prevData,
            ...response.data, // Merge new data, keeping defaults if missing
            features: response.data.features || prevData.features,
            story: response.data.story || prevData.story,
            stats: response.data.stats || prevData.stats,
            team: response.data.team || prevData.team,
          }));
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  };

  const slideIn = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with enhanced animation */}
        <motion.div 
          className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-32 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
                {aboutData?.hero?.title || 'About NEO'}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                {aboutData?.hero?.subtitle || 'Revolutionizing online shopping with quality products and exceptional service.'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid with stagger animation */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {(aboutData?.features || []).map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-purple-500 h-10 w-10 mb-4">
                    {feature.icon === 'CheckCircle2' && <CheckCircle2 />}
                    {feature.icon === 'Star' && <Star />}
                    {feature.icon === 'Clock' && <Clock />}
                    {feature.icon === 'ShieldCheck' && <ShieldCheck />}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Story Section with scroll animation */}
        {aboutData?.story && (
          <div className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="space-y-6"
                    variants={slideIn}
                  >
                    <h2 className="text-4xl font-bold text-gray-900 mb-8">{aboutData.story.title}</h2>
                    {aboutData.story.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-600 text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                  <motion.div 
                    className="relative"
                    variants={scaleIn}
                  >
                    <img 
                      src={aboutData.story.image} 
                      alt="Our Story" 
                      className="rounded-lg shadow-xl"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section with counter animation */}
        {aboutData?.stats && (
          <motion.div 
            className="bg-gradient-to-r from-gray-900 to-gray-800 py-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
                variants={staggerChildren}
              >
                {aboutData.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    variants={fadeIn}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div 
                      className="text-5xl font-bold text-purple-400 mb-3"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xl text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Team Section with hover effects */}
        {aboutData?.team && (
          <motion.div 
            className="py-20 bg-white"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4">
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-16 text-center flex items-center justify-center gap-3"
                variants={fadeIn}
              >
                <Users className="text-purple-500" />
                Our Leadership Team
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
                variants={staggerChildren}
              >
                {aboutData.team.map((member, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    variants={fadeIn}
                  >
                    <motion.div 
                      className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <img 
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-purple-500 font-medium">{member.position}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;