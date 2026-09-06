import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser, fetchMe, updateProfile as updateProfileApi, setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // restoring session on app boot

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem("pageturn_token");
        if (savedToken) {
          setToken(savedToken);
          const { user: me } = await fetchMe();
          setUser(me);
        }
      } catch (e) {
        await AsyncStorage.removeItem("pageturn_token");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const { token: newToken, user: loggedInUser } = await loginUser({ email, password });
    await AsyncStorage.setItem("pageturn_token", newToken);
    setToken(newToken);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { token: newToken, user: newUser } = await registerUser(payload);
    await AsyncStorage.setItem("pageturn_token", newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("pageturn_token");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      AsyncStorage.removeItem("pageturn_token");
      setToken(null);
      setUser(null);
    });
  }, []);

  // --- Sprint 5 - Task 5: Build Account Settings Screen (backing logic) ---
  const updateProfile = useCallback(async (payload) => {
    const { user: updated } = await updateProfileApi(payload);
    setUser(updated);
    return updated;
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
