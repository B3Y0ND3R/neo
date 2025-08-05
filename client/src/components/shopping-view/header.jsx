import {
  ShoppingBag,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, logoutGoogleUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useRef, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { motion } from "framer-motion";

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleNavigate(getCurrentMenuItem) {
    let targetPath;
    
    if (getCurrentMenuItem.id === "home") {
      targetPath = "/shop/home";
    } else if (getCurrentMenuItem.id === "search") {
      targetPath = "/shop/search";
    } else if (getCurrentMenuItem.id === "products") {
      targetPath = "/shop/listing";
    } else if (["men", "women", "kids"].includes(getCurrentMenuItem.id)) {
      // For gender-specific pages, add gender parameter
      targetPath = `/shop/listing?gender=${getCurrentMenuItem.id}`;
    } else {
      targetPath = getCurrentMenuItem.path;
    }
    
    const currentPath = location.pathname + location.search;
    if (currentPath !== targetPath) {
      navigate(targetPath);
      if (closeSheet) closeSheet();
    }
  }

  return (
    <nav className="flex flex-col items-center mb-3 lg:mb-0 gap-6 lg:flex-row lg:justify-center">
      {shoppingViewHeaderMenuItems.map((menuItem, index) => (
        <motion.div
          key={menuItem.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1, transition: { duration: 0.2, type: "spring", stiffness: 300 } }}
          whileTap={{ scale: 0.95 }}
        >
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-medium cursor-pointer text-white/90 hover:text-yellow-400 transition-all duration-200 hover:font-bold"
          >
            {menuItem.label}
          </Label>
        </motion.div>
      ))}
    </nav>
  );
}

function HeaderRightContent({ closeSheet }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    // Check if user is a Google user (has googleId field)
    const isGoogleUser = user?.googleId;
    
    console.log('Logging out user:', user?.userName, 'Is Google user:', isGoogleUser);
    
    if (isGoogleUser) {
      // Enhanced Google logout using improved backend logout
      console.log('Enhanced Google logout initiated...');
      
      // Set logout flags
      sessionStorage.setItem('forceLogout', 'true');
      sessionStorage.setItem('googleLogoutFlag', 'true');
      sessionStorage.setItem('authDisabledUntil', Date.now() + 30000);
      
      // Clear browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Set flags again after clearing
      sessionStorage.setItem('forceLogout', 'true');
      sessionStorage.setItem('googleLogoutFlag', 'true');
      sessionStorage.setItem('authDisabledUntil', Date.now() + 30000);
      
      // Clear Google OAuth session in browser
      try {
        // Method 1: Google API signOut
        if (window.gapi && window.gapi.auth2) {
          window.gapi.auth2.getAuthInstance().signOut();
        }
        
        // Method 2: Clear any Google OAuth tokens
        if (window.google && window.google.accounts) {
          window.google.accounts.oauth2.revoke();
        }
        
        // Method 3: Popup logout
        const popup = window.open('https://accounts.google.com/logout', '_blank', 'width=1,height=1');
        
        // Method 4: Iframe logout
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'https://accounts.google.com/logout';
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          if (popup && !popup.closed) popup.close();
          if (iframe && iframe.parentNode) document.body.removeChild(iframe);
        }, 2000);
      } catch (e) {
        console.log('Error clearing Google session:', e);
      }
      
      // Clear browser cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      // Use the enhanced regular logout function (now handles Google OAuth)
      dispatch(logoutUser()).then(() => {
        // Force redirect after backend logout
        window.location.replace('/auth/login');
      });
      
      return; // Exit immediately
      

      
    } else {
      // For regular users, call the standard logout
      console.log('Calling regular logout...');
      dispatch(logoutUser());
    }
    
    if (closeSheet) closeSheet();
  }

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch, user]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col items-center gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="ghost"
            size="icon"
            className="relative text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 hover:shadow-lg mx-auto"
          >
            <ShoppingCart className="w-6 h-6" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md"
            >
              {cartItems?.items?.length || 0}
            </motion.span>
          </Button>
        </motion.div>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          className="p-0 flex items-center gap-1 text-white hover:text-yellow-400"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <Avatar className="bg-gradient-to-br from-yellow-400 to-yellow-500">
            <AvatarFallback className="text-black font-extrabold">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {dropdownOpen && (
          <div
            className="absolute mt-2 w-56 rounded-md shadow-lg left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0
              z-50 backdrop-blur-xl bg-gradient-to-b from-slate-900/95 to-slate-800/90 border border-white/10"
          >
            <div className="px-4 py-2 font-bold text-yellow-400">{user?.userName}</div>
            <button
              onClick={() => {
                navigate("/shop/account");
                setDropdownOpen(false);
                if (closeSheet) closeSheet();
              }}
              className="w-full flex items-center px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10"
            >
              <UserCog className="mr-2 h-4 w-4" /> Account
            </button>
            <button
              onClick={() => {
                navigate("/shop/chat");
                setDropdownOpen(false);
                if (closeSheet) closeSheet();
              }}
              className="w-full flex items-center px-4 py-2 text-white hover:text-yellow-400 hover:bg-white/10"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chat
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ShoppingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border-b border-white/10 shadow-lg"
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="w-[200px]">
            <Link to="/shop/home" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2, transition: { duration: 0.3, ease: "easeInOut" } }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag className="h-6 w-6 text-white group-hover:text-yellow-400 transition-colors duration-200" />
              </motion.div>
              <motion.span
                className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                NEO
              </motion.span>
            </Link>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-yellow-400 hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs backdrop-blur-xl bg-gradient-to-b from-slate-900/95 to-slate-800/90"
            >
              <MenuItems closeSheet={() => setOpen(false)} />
              <HeaderRightContent closeSheet={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block">
            <MenuItems />
          </div>

          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default ShoppingHeader;
