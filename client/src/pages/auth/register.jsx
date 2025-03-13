import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/store/auth-slice";
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    if (!agreedToTerms) {
      toast({
        title: "Please agree to the Terms of Service",
        variant: "destructive",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                to="/auth/login"
              >
                Sign In
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                type="text"
                placeholder="Username"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to the{" "}
                <Link to="/terms" className="text-purple-600 hover:text-purple-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              onClick={onSubmit}
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Create Account
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  By creating an account, you agree to our
                </span>
              </div>
            </div>

            <div className="text-center text-sm space-x-1">
              <Link 
                to="/terms" 
                className="text-purple-600 hover:text-purple-500 transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-gray-500">and</span>
              <Link 
                to="/privacy" 
                className="text-purple-600 hover:text-purple-500 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-gray-500"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🔒</span>
                <span>Your data is securely encrypted</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AuthRegister;