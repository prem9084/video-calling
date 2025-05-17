import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { LANGUAGE_TO_FLAG } from "../constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial load true
  const [error, setError] = useState(null);
  const [recommendedUser, setRecommendedUser] = useState([]);

  const getRecommendedUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users/recommended");
      if (data.success) {
        setRecommendedUser(data.users);
      } else {
        toast.error(data.message);
      }
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

  const getLanguageFlage = async (language) => {
    if (!language) return null;

    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if (countryCode) {
      return (
        <img
          src={`https://flagcdn.com/16x12/${countryCode}.png`}
          alt={`${langLower} flag`}
          className="h-3 mr-1 inline-block"
        />
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
    getLanguageFlage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
