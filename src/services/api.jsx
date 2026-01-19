import axios from "axios";

export const api = axios.create({
  baseURL: "https://taimimos-backend.onrender.com",
});
