// axios.js
import axios from 'axios';
import Cookies from 'js-cookie';

// import store from "../store.js";
// let token;

// if (!store.getters.token) {
//   token = Cookies.get("papiloomToken") || "";
// } else {
//   token = this.$store.getters.token;
// }

// Set base URL based on environment
const baseURL =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:4000';

// console.log(`Axios baseURL: ${baseURL}`);

// Create an axios instance with base configuration
const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Always send cookies with requests
});

// Add a request interceptor to include auth token from cookies if available
instance.interceptors.request.use(
  function (config) {
    // Ensure withCredentials is always true
    config.withCredentials = true;

    // Get token from cookie
    const token = Cookies.get('papiloomToken');

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// axios.defaults.headers.common = { Authorization: `bearer ${token}` };
export default instance;
