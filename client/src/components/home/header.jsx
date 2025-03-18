import { ShoppingBag, LogOut, Menu, ShoppingCart, UserCog, MessageCircle } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { fetchCartItems } from "@/store/shop/cart-slice";
import UserCartWrapper from "../shopping-view/cart-wrapper";
import { motion } from "framer-motion";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((state) => state.auth);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    // Update navigation based on auth status
    if (isAuthenticated) {
      // For logged in users, use shop routes
      const path = getCurrentMenuItem.id === "home" 
        ? "/shop/home"
        : getCurrentMenuItem.id === "products"
        ? "/shop/listing"
        : "/shop/listing";

      location.pathname.includes("listing") && currentFilter !== null
        ? setSearchParams(
            new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
          )
        : navigate(path);
    } else {
      // For non-logged in users, use public routes
      const path = getCurrentMenuItem.id === "home"
        ? "/"
        : "/listings";

      location.pathname.includes("listing") && currentFilter !== null
        ? setSearchParams(
            new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
          )
        : navigate(path);
    }
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row lg:justify-center">
      {shoppingViewHeaderMenuItems.map((menuItem, index) => (
        <motion.div
          key={menuItem.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2, type: "spring", stiffness: 300 }
          }}
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

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {isAuthenticated && (
        <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
          <motion.div 
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2, type: "spring", stiffness: 400 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => setOpenCartSheet(true)}
              variant="ghost"
              size="icon"
              className="relative text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 hover:shadow-lg"
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
            cartItems={cartItems?.items?.length > 0 ? cartItems.items : []}
          />
        </Sheet>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div 
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2, type: "spring", stiffness: 400 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isAuthenticated ? (
              <Avatar className="cursor-pointer bg-gradient-to-br from-yellow-400 to-yellow-500 hover:shadow-lg transition-all duration-200">
                <AvatarFallback className="text-black font-extrabold">
                  {user?.userName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserCog className="text-white cursor-pointer hover:text-yellow-400 transition-colors duration-200" />
            )}
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="right" 
          className="w-56 backdrop-blur-xl bg-gradient-to-b from-slate-900/95 to-slate-800/90 shadow-lg border border-white/10"
        >
          {isAuthenticated ? (
            <>
              <DropdownMenuLabel className="font-bold text-yellow-400">{user?.userName}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <DropdownMenuItem 
                  onClick={() => navigate("/shop/account")} 
                  className="cursor-pointer text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
              </motion.div>
              <DropdownMenuSeparator className="bg-white/10" />
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <DropdownMenuItem 
                  onClick={() => navigate("/shop/chat")} 
                  className="cursor-pointer text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </DropdownMenuItem>
              </motion.div>
              <DropdownMenuSeparator className="bg-white/10" />
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <DropdownMenuItem 
                  onClick={() => navigate("/auth/login")} 
                  className="cursor-pointer text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Login
                </DropdownMenuItem>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <DropdownMenuItem 
                  onClick={() => navigate("/auth/register")} 
                  className="cursor-pointer text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-200"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Register
                </DropdownMenuItem>
              </motion.div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border-b border-white/10 shadow-lg"
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo Section */}
          <div className="w-[200px]">
            <Link to={isAuthenticated ? "/shop/home" : "/"} className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ 
                  rotate: 360,
                  scale: 1.2,
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag className="h-6 w-6 text-white group-hover:text-yellow-400 transition-colors duration-200" />
              </motion.div>
              <motion.span 
                className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                NEO
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <motion.div 
            className="hidden lg:flex flex-1 justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MenuItems />
          </motion.div>

          {/* Mobile Menu Button and Right Content */}
          <div className="w-[200px] flex justify-end"> {/* Fixed width for right section */}
            <Sheet>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden text-white hover:bg-white/10 transition-all duration-200 hover:shadow-md"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle header menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-full max-w-xs backdrop-blur-xl bg-gradient-to-b from-slate-900/95 to-slate-800/90"
              >
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <MenuItems />
                  <HeaderRightContent />
                </motion.div>
              </SheetContent>
            </Sheet>

            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HeaderRightContent />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
