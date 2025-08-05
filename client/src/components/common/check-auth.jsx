import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const [forceUnauthenticated, setForceUnauthenticated] = useState(false);

  console.log(location.pathname, isAuthenticated);

  // Check for force logout flag on every render
  useEffect(() => {
    const forceLogout = sessionStorage.getItem('forceLogout');
    const googleLogoutFlag = sessionStorage.getItem('googleLogoutFlag');
    const authDisabledUntil = sessionStorage.getItem('authDisabledUntil');
    
    if (forceLogout === 'true' || googleLogoutFlag === 'true') {
      setForceUnauthenticated(true);
      // Clear the flags
      sessionStorage.removeItem('forceLogout');
      sessionStorage.removeItem('googleLogoutFlag');
    }
    
    // Check if authentication is temporarily disabled
    if (authDisabledUntil && Date.now() < parseInt(authDisabledUntil)) {
      setForceUnauthenticated(true);
    }
    
    // Enhanced: If we're on /shop/home and user has googleId, check for logout flags
    if (location.pathname === '/shop/home' && user?.googleId) {
      const hasAnyLogoutFlag = forceLogout === 'true' || 
                              googleLogoutFlag === 'true' ||
                              (authDisabledUntil && Date.now() < parseInt(authDisabledUntil));
      
      if (hasAnyLogoutFlag) {
        setForceUnauthenticated(true);
        window.location.replace('/auth/login');
        return;
      }
    }
    

  }, [location.pathname, user]);

  // Force unauthenticated state if logout flags are set
  const effectiveAuthState = forceUnauthenticated ? false : isAuthenticated;
  const effectiveUser = forceUnauthenticated ? null : user;

  if (location.pathname === "/") {
    if (!effectiveAuthState) {
      return <Navigate to="/auth/login" />;
    } else {
      if (effectiveUser?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  if (
    !effectiveAuthState &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    effectiveAuthState &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (effectiveUser?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    effectiveAuthState &&
    effectiveUser?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    effectiveAuthState &&
    effectiveUser?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;