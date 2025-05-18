import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://stream-phsz.onrender.com/api",
  withCredentials: true,
});
