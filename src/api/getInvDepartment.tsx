import { useState } from "react";
import axios from "./axiosInstance";

const useGetInvDepartment = () => {
  const [loadingForGetInvDepartment, setLoadingForGetInvDepartment] =
    useState(false);

  const getInvDepartment = async () => {
    try {
      setLoadingForGetInvDepartment(true);
      const response = await axios.get("/inventory-department/get-department");
      return response.data;
    } catch (error: any) {
      console.log(error);
      if (error.status >= 400) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
      return {
        success: false,
        message: "API calling failed",
      };
    } finally {
      setLoadingForGetInvDepartment(false);
    }
  };

  return {
    getInvDepartment,
    loadingForGetInvDepartment,

  };

};

export default useGetInvDepartment;
