import axios from "axios";

// const BASE_URL =
//   import.meta.env.MODE === "development"
//     ? "https://video-calling-6grd.onrender.com/api"
//     : "/api";

export const axiosInstance = axios.create({
  baseURL: "https://video-calling-6grd.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
