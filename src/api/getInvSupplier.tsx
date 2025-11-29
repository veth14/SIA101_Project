import { useState } from "react";
import axios from "./axiosInstance";

const useGetInvSupplier = () => {
  const [loadingForGetInvSupplier, setLoadingForGetInvSupplier] =
    useState(false);

  const getInvSuppliers = async () => {
    try {
      setLoadingForGetInvSupplier(true);
      const response = await axios.get("/inventory-supplier/get-suppliers");
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
      setLoadingForGetInvSupplier(false);
    }
  };

  return {
    getInvSuppliers,
    loadingForGetInvSupplier,
  };
};

export default useGetInvSupplier;
