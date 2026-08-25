import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser, fetchMe, updateProfile as updateProfileApi } from "../services/api";

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
