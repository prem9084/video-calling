import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://stream-phsz.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
