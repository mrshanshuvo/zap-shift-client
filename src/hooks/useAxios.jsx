import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://zap-shift-server-sand.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;