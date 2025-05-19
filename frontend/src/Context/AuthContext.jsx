import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial load true
  const [error, setError] = useState(null);
  const [recommendedUser, setRecommendedUser] = useState([]);

  const getRecommendedUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users/recommended");

      setRecommendedUser(data.users);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRecommendedUsers();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/me");
      setUser(data.user);
      setError(data.message);
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Automatically include token from localStorage
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const value = {
    user,
    isAuth: !!user,
    isOnboarded: !!user?.isOnboarded,
    loading,
    setLoading,
    error,
    setUser,
    fetchUser,
    recommendedUser,
    setRecommendedUser,
    getRecommendedUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
