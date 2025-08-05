import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  isLoggingOut: false,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    // Clear any local storage or session storage that might contain auth data
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('filters');
    
    // Set logout flag to prevent re-authentication
    sessionStorage.setItem('forceLogout', 'true');
    
    // Clear all possible authentication-related data
    localStorage.clear();
    sessionStorage.clear();
    
    // Set logout flag again after clearing
    sessionStorage.setItem('forceLogout', 'true');
    
    return response.data;
  }
);

export const logoutGoogleUser = createAsyncThunk(
  "/auth/google/logout",
  async () => {
    const response = await axios.get("http://localhost:5000/api/auth/google/logout", {
      withCredentials: true,
    });
    
    // Clear any local storage or session storage that might contain auth data
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('filters');
    
    // Set logout flag to prevent re-authentication
    sessionStorage.setItem('forceLogout', 'true');
    
    // Clear all possible authentication-related data
    localStorage.clear();
    sessionStorage.clear();
    
    // Set logout flag again after clearing
    sessionStorage.setItem('forceLogout', 'true');
    sessionStorage.setItem('googleLogoutFlag', 'true');
    
    // Clear Google OAuth session by redirecting to Google's logout URL
    // This will clear the Google OAuth session in the browser
    // We'll handle this in the component to avoid issues with async thunk
    return { 
      success: true, 
      shouldRedirectToGoogle: true 
    };
  }
);


export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    // Check if user has forced logout
    const forceLogout = sessionStorage.getItem('forceLogout');
    const googleLogoutFlag = sessionStorage.getItem('googleLogoutFlag');
    const authDisabledUntil = sessionStorage.getItem('authDisabledUntil');
    
    if (forceLogout === 'true' || googleLogoutFlag === 'true') {
      // Clear the flags and return unauthenticated
      sessionStorage.removeItem('forceLogout');
      sessionStorage.removeItem('googleLogoutFlag');
      throw new Error('Force logout detected');
    }
    
    // Check if authentication is temporarily disabled
    if (authDisabledUntil && Date.now() < parseInt(authDisabledUntil)) {
      throw new Error('Authentication temporarily disabled');
    }

    const response = await axios.get(
      "http://localhost:5000/api/auth/check-auth",
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);

export const forgotPassword = createAsyncThunk(
  "/auth/forgot-password",
  async (email) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/forgot-password",
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async ({ token, newPassword }) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/reset-password",
      { token, newPassword },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
    forceLogout: (state, action) => {
      state.isLoading = false;
      state.isLoggingOut = false;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.isLoggingOut = true;
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggingOut = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutGoogleUser.pending, (state, action) => {
        state.isLoggingOut = true;
        state.isLoading = true;
      })
      .addCase(logoutGoogleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggingOut = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggingOut = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutGoogleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggingOut = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, forceLogout } = authSlice.actions;
export default authSlice.reducer;