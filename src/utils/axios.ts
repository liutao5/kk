import { HOST_API_KEY } from "@/config-global";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: HOST_API_KEY,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;
