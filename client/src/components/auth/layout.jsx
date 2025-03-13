import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center w-1/2 px-12 relative overflow-hidden bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z" fill="%23ffffff" fill-opacity="0.4" fill-rule="evenodd"/%3E%3C/svg%3E")',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="relative z-10 max-w-md space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
              NEO
            </h1>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mb-6" />
            <h2 className="text-2xl font-light text-gray-200">
              Discover new trends,{" "}
              <span className="font-medium bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                everyday
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col space-y-4 text-gray-300 text-lg"
          >
            <p>✨ Curated Fashion Collections</p>
            <p>🌟 Exclusive Deals</p>
            <p>💫 Personalized Experience</p>
          </motion.div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;