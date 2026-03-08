import React, { useState, createContext, useEffect, useMemo, useCallback } from "react";
import { apiRequest } from "../lib/apiRequest";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    // Only parse if it's not "undefined" or null
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Use useCallback to prevent unnecessary re-renders in consumers
  const logout = useCallback(async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  const updateData = useCallback((data) => {
    setCurrentUser(data);
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRequest.get("/auth/me");
        if (res.status != 200) 
         updateData(null);
        
      } catch (error) {
        updateData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [updateData]);

  // Memoize context value to prevent re-rendering all children 
  // unless one of these values actually changes.
  const value = useMemo(() => ({ 
    currentUser, 
    updateData, 
    logout, 
    isLoading 
  }), [currentUser, logout, updateData, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};