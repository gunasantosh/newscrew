import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000/"; // Replace with your backend URL
const API_BASE_URL = "https://96d3e9c8-2a32-4a33-abdd-c3b42b4496ee-dev.e1-eu-north-azure.choreoapis.dev/newscrew/backend/v1.0/";

// const apiUrl = "/choreo-apis/newscrew/backend/v1";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
// });

const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
     "Content-Type": "application/json",
   },
 });

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
