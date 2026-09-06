import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginUser,
  registerUser,
  updateProfile as updateProfileApi,
  fetchMe,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("pageturn_token");
        if (stored) {
          setToken(stored);
          try {
            const data = await fetchMe();
            setUser(data.user || data);
          } catch {
            await AsyncStorage.removeItem("pageturn_token");
            setToken(null);
            setUser(null);
          }
        }
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });
    const newToken = data.token;
    const loggedInUser = data.user;
    await AsyncStorage.setItem("pageturn_token", newToken);
    setToken(newToken);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser({
      ...payload,
      email: (payload.email || "").trim().toLowerCase(),
    });
    const newToken = data.token;
    const newUser = data.user;
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

  const updateProfile = useCallback(async (payload) => {
    const data = await updateProfileApi(payload);
    const updated = data.user || data;
    setUser(updated);
    return updated;
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!(token && user),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}