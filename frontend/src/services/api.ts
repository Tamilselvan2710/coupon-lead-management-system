import axios from "axios";

const API = axios.create({
  baseURL: "https://coupon-lead-management-system.onrender.com/api",
});

export default API;