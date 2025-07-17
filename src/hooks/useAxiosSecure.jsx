import axios from "axios";
import React from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});
const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  axiosSecure.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${user?.accessToken}`;
    return config;
  },
    (error) => {
      return Promise.reject(error);
    });

  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("inside res interceptor", error);
      const status = error.response?.status;
      if (status === 403) {
        navigate('/forbidden')
      }
      if (status === 401) {
        logOut()
          .then(() => {
            console.log("Logged out due to unauthorized access");
            navigate('/login');
          })
          .catch((err) => {
            console.error("Error during logout:", err);
          });
      }
      return Promise.reject(error);
    });
  return axiosSecure;
};

export default useAxiosSecure;
