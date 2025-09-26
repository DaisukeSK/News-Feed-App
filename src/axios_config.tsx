import axios from "axios";
// import baseUrl from './data-service';

const app = axios.create({
  // baseURL: baseUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default app;
