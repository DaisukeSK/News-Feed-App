import axios from "axios";
// import baseUrl from './data-service';

const app = axios.create({
  // baseURL: baseUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default app;
