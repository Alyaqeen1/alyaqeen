import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_WebApi_URL,
  withCredentials: true,
});

import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function useAxiosSecure() {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        if (error.status === 401 || error.status === 403) {
          signOutUser().then(() => {
            navigate("/login");
            if (error.status === 401) {
              return toast.error("Unauthorized Access, Please login again");
            }
            if (error.status === 403) {
              return toast.error("Forbidden Access, Please login again");
            }
          });
        }
      }
    );
  }, []);
  return axiosSecure;
}
