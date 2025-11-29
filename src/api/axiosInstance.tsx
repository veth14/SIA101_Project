import axios from "axios";

// 1. Determine the URL based on the environment
// Vite uses 'import.meta.env.PROD' to know if it's running in production (Netlify)
const API_URL = import.meta.env.PROD 
  ? "/api" // On Netlify: use the relative path (handled by netlify.toml redirects)
  : "http://localhost:3000/.netlify/functions/server"; // On Local: point to local backend

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default axiosInstance;