import { Route, Routes, useLocation } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth, forceLogout } from "./store/auth-slice";
import { setProductDetails } from "./store/shop/products-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import SearchPage from "./pages/search";
import HashLoader from "react-spinners/HashLoader";
import  HomePage  from "./pages/home/home"; 
import HomeListing from "./pages/home/listing";

import ShoppingChat from "./pages/shopping-view/chat";
import AdminChats from "./pages/admin-view/chats";
import AdminChatConversation from "./pages/admin-view/chat-conversation";
import AdminBrands from "./pages/admin-view/brands";
import VisualSearch from "./pages/shopping-view/visual-search";
import { Toaster } from "@/components/ui/toaster";
import AboutUs from "./pages/about-us";
import AdminAboutUs from "./pages/admin-view/about-us";
import FAQ from './pages/faq';
import FaqAdmin from './pages/admin-view/faq';
import Contact from './pages/contact';
import ContactQueries from './pages/admin-view/contact-queries';
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import FilterManager from "./pages/admin-view/filter-manage";
import ProductDetailsPage from "./pages/product-details";
import AdminProductDetailsPage from "./pages/admin-product-details";

function App() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading, isLoggingOut } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for logout flags and force logout if detected
    const forceLogoutFlag = sessionStorage.getItem('forceLogout');
    const googleLogoutFlag = sessionStorage.getItem('googleLogoutFlag');
    const authDisabledUntil = sessionStorage.getItem('authDisabledUntil');
    const isAuthDisabled = authDisabledUntil && Date.now() < parseInt(authDisabledUntil);
    
    if (forceLogoutFlag === 'true' || googleLogoutFlag === 'true' || isAuthDisabled) {
      // Force logout immediately and prevent any auth checks
      dispatch(forceLogout());
      return;
    }
    

    
    // Don't check auth if user is in the process of logging out
    if (!isLoggingOut) {
      dispatch(checkAuth());
    }
  }, [dispatch, isLoggingOut]);
  
  // Prevent auth check from running if logout flags are set
  useEffect(() => {
    const forceLogoutFlag = sessionStorage.getItem('forceLogout');
    const googleLogoutFlag = sessionStorage.getItem('googleLogoutFlag');
    const authDisabledUntil = sessionStorage.getItem('authDisabledUntil');
    const isAuthDisabled = authDisabledUntil && Date.now() < parseInt(authDisabledUntil);
    
    if (forceLogoutFlag === 'true' || googleLogoutFlag === 'true' || isAuthDisabled) {
      // Clear any existing auth state immediately
      dispatch(forceLogout());
    }
  }, [dispatch]);
  
  // Additional effect to handle Google logout more aggressively
  useEffect(() => {
    const googleLogoutFlag = sessionStorage.getItem('googleLogoutFlag');
    if (googleLogoutFlag === 'true' && isAuthenticated) {
      // If Google user is still authenticated but has logout flag, force logout
      dispatch(forceLogout());
    }
  }, [isAuthenticated, dispatch]);

  // Global cleanup for product details when navigating away from product details page
  useEffect(() => {
    const isProductDetailsPage = location.pathname.startsWith('/product/');
    const isAdminProductDetailsPage = location.pathname.startsWith('/admin/product/');
    const isHomePage = location.pathname === '/';
    
    // Clear product details when navigating away from product details pages
    if (!isProductDetailsPage && !isAdminProductDetailsPage) {
      // Immediate cleanup
      dispatch(setProductDetails());
      
      // Additional cleanup with delays to ensure it's cleared
      const timers = [10, 50, 100, 200].map(delay => 
        setTimeout(() => {
          dispatch(setProductDetails());
        }, delay)
      );
      
      // Extra aggressive cleanup for home page
      if (isHomePage) {
        const homeTimers = [300, 500, 1000].map(delay => 
          setTimeout(() => {
            dispatch(setProductDetails());
          }, delay)
        );
        timers.push(...homeTimers);
      }
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [location.pathname, dispatch]);

  // Check for force logout or auth disable to bypass loading
  const forceLogoutFlag = sessionStorage.getItem('forceLogout');
  const googleLogoutFlag = sessionStorage.getItem('googleLogoutFlag');
  const authDisabledUntil = sessionStorage.getItem('authDisabledUntil');
  const isAuthDisabled = authDisabledUntil && Date.now() < parseInt(authDisabledUntil);
  
  // Bypass loading if any logout flags are set
  const shouldBypassLoading = forceLogoutFlag === 'true' || googleLogoutFlag === 'true' || isAuthDisabled;
  
  if (isLoading && !shouldBypassLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <Skeleton className="w-20 h-20 bg-white flex items-center justify-center">
          <HashLoader loading={isLoading} color="#000000" size={50} />
        </Skeleton>
      </div>
    );
  }
  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Toaster />
      <Routes>
      <Route path="/" element={<HomePage />} /> 
      <Route path="/listings" element={<HomeListing />} />
      <Route path="/search" element={<SearchPage />} />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="chat/:userId" element={<AdminChatConversation />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="about-us" element={<AdminAboutUs />} />
          <Route path="faq" element={<FaqAdmin />} />
          <Route path="contact-queries" element={<ContactQueries />} />
          <Route path="filters" element={<FilterManager />} />
          <Route path="product/:productId" element={<AdminProductDetailsPage />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="chat" element={<ShoppingChat />} />
          <Route path="visual-search" element={<VisualSearch />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/product/:productId"
          element={<ProductDetailsPage />}
          key={location.pathname} // Force re-render on path change
        />
      </Routes>
    </div>
  );
}

export default App;