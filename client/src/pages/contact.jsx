import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock, Mail, Send, Loader2 } from 'lucide-react';
import Header from '../components/home/header';
import Footer from '../components/home/footer';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ContactUs = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3
      }
    }
  };

  const iconVariants = {
    hidden: { rotate: -180, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      rotate: 360,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
    },
    tap: {
      scale: 0.95
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1
      }
    }
  };

  const slideVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Current user:', user);

      const dataToSend = {
        ...formData,
        userId: user?.id,
        username: user?.userName
      };

      console.log('Data being sent:', dataToSend);

      const response = await axios.post('http://localhost:5000/api/contact', dataToSend, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
      });
      setFormData({ fullName: '', email: '', message: '' });
    } catch (error) {
      console.error('Error details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="text-center mb-12"
            variants={titleVariants}
          >
            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600"
              variants={itemVariants}
            >
              We'd love to hear from you. Drop us a line and we'll get back to you shortly.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="space-y-8"
              variants={slideVariants}
            >
              {[
                { icon: MapPin, color: "purple", title: "Our Location", content: "123 Business Avenue, New York, NY 10001" },
                { icon: Phone, color: "blue", title: "Phone Number", content: "+1 (555) 123-4567" },
                { icon: Mail, color: "green", title: "Email Address", content: "contact@example.com" },
                { icon: Clock, color: "yellow", title: "Business Hours", content: "Mon - Fri: 9:00 AM - 6:00 PM" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Card className="p-6">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`p-3 bg-${item.color}-100 rounded-full`}
                        variants={iconVariants}
                        whileHover="hover"
                      >
                        <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                      </motion.div>
                      <div>
                        <motion.h3 
                          className="font-semibold text-gray-900"
                          variants={itemVariants}
                        >
                          {item.title}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-600"
                          variants={itemVariants}
                        >
                          {item.content}
                        </motion.p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
            >
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={inputVariants} whileFocus="focus">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="w-full"
                    />
                  </motion.div>
                  <motion.div variants={inputVariants} whileFocus="focus">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full"
                    />
                  </motion.div>
                  <motion.div variants={inputVariants} whileFocus="focus">
                    <Textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[150px]"
                    />
                  </motion.div>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-[100px] py-3 px-6 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                </form>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default ContactUs; 